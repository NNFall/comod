import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import sharp from 'sharp'

import type {
  FlatUiSample,
  PhotoMask,
  Rgb,
  SceneVisualContract,
} from './contracts'

type SampleComparison = {
  label: string
  expected: Rgb
  reference: Rgb
  actual: Rgb
  referenceDeltaE: number
  actualDeltaE: number
  maxDeltaE: number
}

export type ReferenceComparison = {
  width: number
  height: number
  differentPixels: number
  maskedPixels: number
  comparedPixels: number
  mismatchRatio: number
  samples: readonly SampleComparison[]
}

const MASK_DARK: Rgb = [53, 63, 72]
const MASK_LIGHT: Rgb = [69, 81, 91]

const normalizePng = async (input: string | Buffer) => {
  const buffer = await sharp(input).rotate().ensureAlpha().png().toBuffer()
  return PNG.sync.read(buffer)
}

const pointInPolygon = (
  x: number,
  y: number,
  points: Extract<PhotoMask, { kind: 'polygon' }>['points'],
) => {
  let inside = false

  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const currentPoint = points[index]
    const previousPoint = points[previous]
    const crosses =
      currentPoint.y > y !== previousPoint.y > y &&
      x <
        ((previousPoint.x - currentPoint.x) * (y - currentPoint.y)) /
          (previousPoint.y - currentPoint.y) +
          currentPoint.x

    if (crosses) {
      inside = !inside
    }
  }

  return inside
}

const pointInRoundedRectangle = (
  x: number,
  y: number,
  mask: Extract<PhotoMask, { kind: 'rounded-rectangle' }>,
) => {
  if (
    x < mask.x ||
    y < mask.y ||
    x >= mask.x + mask.width ||
    y >= mask.y + mask.height
  ) {
    return false
  }

  const radius = Math.max(
    0,
    Math.min(mask.radius, mask.width / 2, mask.height / 2),
  )
  const closestX = Math.max(mask.x + radius, Math.min(x, mask.x + mask.width - radius))
  const closestY = Math.max(mask.y + radius, Math.min(y, mask.y + mask.height - radius))
  const deltaX = x - closestX
  const deltaY = y - closestY

  return deltaX * deltaX + deltaY * deltaY <= radius * radius
}

const rasterizeMasks = (
  width: number,
  height: number,
  masks: readonly PhotoMask[],
) => {
  const pixels = new Uint8Array(width * height)

  for (const mask of masks) {
    if (mask.kind === 'rectangle' || mask.kind === 'rounded-rectangle') {
      const left = Math.max(0, Math.floor(mask.x))
      const top = Math.max(0, Math.floor(mask.y))
      const right = Math.min(width, Math.ceil(mask.x + mask.width))
      const bottom = Math.min(height, Math.ceil(mask.y + mask.height))

      for (let y = top; y < bottom; y += 1) {
        if (mask.kind === 'rectangle') {
          pixels.fill(1, y * width + left, y * width + right)
          continue
        }

        for (let x = left; x < right; x += 1) {
          if (pointInRoundedRectangle(x + 0.5, y + 0.5, mask)) {
            pixels[y * width + x] = 1
          }
        }
      }
      continue
    }

    const xs = mask.points.map((point) => point.x)
    const ys = mask.points.map((point) => point.y)
    const left = Math.max(0, Math.floor(Math.min(...xs)))
    const top = Math.max(0, Math.floor(Math.min(...ys)))
    const right = Math.min(width, Math.ceil(Math.max(...xs)))
    const bottom = Math.min(height, Math.ceil(Math.max(...ys)))

    for (let y = top; y < bottom; y += 1) {
      for (let x = left; x < right; x += 1) {
        if (pointInPolygon(x + 0.5, y + 0.5, mask.points)) {
          pixels[y * width + x] = 1
        }
      }
    }
  }

  return pixels
}

const paintMasks = (png: PNG, maskPixels: Uint8Array) => {
  for (let pixel = 0; pixel < maskPixels.length; pixel += 1) {
    if (maskPixels[pixel] === 0) {
      continue
    }

    const offset = pixel * 4
    png.data[offset] = MASK_DARK[0]
    png.data[offset + 1] = MASK_DARK[1]
    png.data[offset + 2] = MASK_DARK[2]
    png.data[offset + 3] = 255
  }
}

const paintVisibleMask = (
  diff: PNG,
  maskPixels: Uint8Array,
  width: number,
) => {
  for (let pixel = 0; pixel < maskPixels.length; pixel += 1) {
    if (maskPixels[pixel] === 0) {
      continue
    }

    const x = pixel % width
    const y = Math.floor(pixel / width)
    const color = (Math.floor(x / 12) + Math.floor(y / 12)) % 2
      ? MASK_DARK
      : MASK_LIGHT
    const offset = pixel * 4
    diff.data[offset] = color[0]
    diff.data[offset + 1] = color[1]
    diff.data[offset + 2] = color[2]
    diff.data[offset + 3] = 255
  }
}

const pixelRgb = (png: PNG, sample: FlatUiSample): Rgb => {
  const offset = (sample.y * png.width + sample.x) * 4
  return [png.data[offset], png.data[offset + 1], png.data[offset + 2]]
}

const srgbChannelToLinear = (value: number) => {
  const channel = value / 255
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4
}

const rgbToLab = (rgb: Rgb) => {
  const red = srgbChannelToLinear(rgb[0])
  const green = srgbChannelToLinear(rgb[1])
  const blue = srgbChannelToLinear(rgb[2])
  const x = (red * 0.4124 + green * 0.3576 + blue * 0.1805) / 0.95047
  const y = red * 0.2126 + green * 0.7152 + blue * 0.0722
  const z = (red * 0.0193 + green * 0.1192 + blue * 0.9505) / 1.08883
  const transform = (value: number) =>
    value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116
  const transformedX = transform(x)
  const transformedY = transform(y)
  const transformedZ = transform(z)

  return [
    116 * transformedY - 16,
    500 * (transformedX - transformedY),
    200 * (transformedY - transformedZ),
  ] as const
}

const deltaE76 = (left: Rgb, right: Rgb) => {
  const leftLab = rgbToLab(left)
  const rightLab = rgbToLab(right)

  return Math.sqrt(
    (leftLab[0] - rightLab[0]) ** 2 +
      (leftLab[1] - rightLab[1]) ** 2 +
      (leftLab[2] - rightLab[2]) ** 2,
  )
}

const compareSamples = (
  reference: PNG,
  actual: PNG,
  samples: readonly FlatUiSample[],
): readonly SampleComparison[] =>
  samples.map((sample) => {
    const referenceRgb = pixelRgb(reference, sample)
    const actualRgb = pixelRgb(actual, sample)

    return {
      label: sample.label,
      expected: sample.expected,
      reference: referenceRgb,
      actual: actualRgb,
      referenceDeltaE: deltaE76(sample.expected, referenceRgb),
      actualDeltaE: deltaE76(sample.expected, actualRgb),
      maxDeltaE: sample.maxDeltaE,
    }
  })

export const compareReference = async ({
  contract,
  currentFile,
  diffFile,
}: {
  contract: SceneVisualContract
  currentFile: string
  diffFile: string
}): Promise<ReferenceComparison> => {
  const referenceBytes = await readFile(contract.referenceFile)
  const referenceSha256 = createHash('sha256')
    .update(referenceBytes)
    .digest('hex')
    .toUpperCase()

  if (referenceSha256 !== contract.referenceSha256.toUpperCase()) {
    throw new Error(
      `${contract.id} reference SHA-256 mismatch: expected ${contract.referenceSha256}, received ${referenceSha256}`,
    )
  }

  const [reference, actual] = await Promise.all([
    normalizePng(referenceBytes),
    normalizePng(currentFile),
  ])
  const { width, height } = contract.viewport

  if (reference.width !== width || reference.height !== height) {
    throw new Error(
      `${contract.id} reference must be ${width}x${height}; received ${reference.width}x${reference.height}`,
    )
  }
  if (actual.width !== width || actual.height !== height) {
    throw new Error(
      `${contract.id} current frame must be ${width}x${height}; received ${actual.width}x${actual.height}`,
    )
  }

  const samples = compareSamples(reference, actual, contract.flatUiSamples)
  const maskPixels = rasterizeMasks(width, height, contract.photoMasks)
  const maskedReference = PNG.sync.read(PNG.sync.write(reference))
  const maskedActual = PNG.sync.read(PNG.sync.write(actual))
  paintMasks(maskedReference, maskPixels)
  paintMasks(maskedActual, maskPixels)

  const diff = new PNG({ width, height })
  const differentPixels = pixelmatch(
    maskedReference.data,
    maskedActual.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.1,
      includeAA: false,
      alpha: 0.35,
      aaColor: [255, 190, 0],
      diffColor: [238, 65, 56],
      diffColorAlt: [0, 196, 255],
      diffMask: false,
    },
  )

  paintVisibleMask(diff, maskPixels, width)
  await mkdir(dirname(diffFile), { recursive: true })
  await writeFile(diffFile, PNG.sync.write(diff))

  const maskedPixels = maskPixels.reduce((total, value) => total + value, 0)
  const comparedPixels = width * height - maskedPixels

  return {
    width,
    height,
    differentPixels,
    maskedPixels,
    comparedPixels,
    mismatchRatio: differentPixels / comparedPixels,
    samples,
  }
}
