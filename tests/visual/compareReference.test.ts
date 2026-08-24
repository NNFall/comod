// @vitest-environment node

import { createHash } from 'node:crypto'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import sharp from 'sharp'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { compareReference } from './compareReference'
import { sceneVisualContracts } from './contracts'
import type { PhotoMask, SceneVisualContract } from './contracts'

type FixtureColor = {
  red: number
  green: number
  blue: number
  alpha?: number
}

let fixtureDirectory: string

beforeEach(async () => {
  fixtureDirectory = await mkdtemp(join(tmpdir(), 'komod-visual-contract-'))
})

afterEach(async () => {
  await rm(fixtureDirectory, { recursive: true, force: true })
})

const writePng = async (
  name: string,
  width: number,
  height: number,
  color: FixtureColor,
) => {
  const path = join(fixtureDirectory, name)
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: {
        r: color.red,
        g: color.green,
        b: color.blue,
        alpha: color.alpha ?? 1,
      },
    },
  })
    .png()
    .toFile(path)
  return path
}

const sha256 = async (path: string) =>
  createHash('sha256').update(await readFile(path)).digest('hex').toUpperCase()

const contractFor = async ({
  referenceFile,
  width,
  height,
  masks = [],
  expectedSha256,
}: {
  referenceFile: string
  width: number
  height: number
  masks?: readonly PhotoMask[]
  expectedSha256?: string
}) =>
  ({
    id: 'hero',
    anchorUrl: '/#fixture',
    sceneSelector: '#fixture',
    readySelector: '#fixture[data-scene-ready="hero"]',
    referenceFile,
    referenceSha256: expectedSha256 ?? (await sha256(referenceFile)),
    viewport: { width, height },
    maxMismatchRatio: 0.025,
    photoMasks: masks,
    flatUiSamples: [],
    geometryGuides: [],
    requiredMedia: [],
  }) as unknown as SceneVisualContract

const compare = async ({
  contract,
  currentFile,
  suffix,
}: {
  contract: SceneVisualContract
  currentFile: string
  suffix: string
}) =>
  compareReference({
    contract,
    currentFile,
    diffFile: join(fixtureDirectory, `${suffix}-diff.png`),
  })

describe('compareReference', () => {
  it.each(sceneVisualContracts)(
    'locks the exact SHA-256 for $id before comparison',
    async (contract) => {
      expect(contract.referenceSha256).toMatch(/^[A-F0-9]{64}$/)
      expect(await sha256(contract.referenceFile)).toBe(contract.referenceSha256)
    },
  )

  it('rejects a reference whose exact SHA-256 is not the locked digest', async () => {
    const referenceFile = await writePng('reference.png', 2, 2, {
      red: 20,
      green: 30,
      blue: 40,
    })
    const contract = await contractFor({
      referenceFile,
      width: 2,
      height: 2,
      expectedSha256: '0'.repeat(64),
    })

    await expect(
      compare({ contract, currentFile: referenceFile, suffix: 'bad-hash' }),
    ).rejects.toThrow(/SHA-256/i)
  })

  it('clips an out-of-bounds rectangle to the image canvas', async () => {
    const referenceFile = await writePng('reference.png', 4, 4, {
      red: 10,
      green: 20,
      blue: 30,
    })
    const contract = await contractFor({
      referenceFile,
      width: 4,
      height: 4,
      masks: [{ kind: 'rectangle', x: -1, y: -1, width: 3, height: 3 }],
    })

    const result = await compare({
      contract,
      currentFile: referenceFile,
      suffix: 'clipped-rectangle',
    })

    expect(result.maskedPixels).toBe(4)
    expect(result.comparedPixels).toBe(12)
  })

  it('uses pixel centres to keep polygon boundaries deterministic', async () => {
    const referenceFile = await writePng('reference.png', 4, 4, {
      red: 10,
      green: 20,
      blue: 30,
    })
    const contract = await contractFor({
      referenceFile,
      width: 4,
      height: 4,
      masks: [
        {
          kind: 'polygon',
          points: [
            { x: 0, y: 0 },
            { x: 4, y: 0 },
            { x: 0, y: 4 },
          ],
        },
      ],
    })

    const result = await compare({
      contract,
      currentFile: referenceFile,
      suffix: 'polygon-boundary',
    })

    expect(result.maskedPixels).toBe(6)
    expect(result.comparedPixels).toBe(10)
  })

  it('keeps rounded mask corners available to the visual diff', async () => {
    const referenceFile = await writePng('reference.png', 4, 4, {
      red: 10,
      green: 20,
      blue: 30,
    })
    const contract = await contractFor({
      referenceFile,
      width: 4,
      height: 4,
      masks: [
        {
          kind: 'rounded-rectangle',
          x: 0,
          y: 0,
          width: 4,
          height: 4,
          radius: 2,
        },
      ],
    })

    const result = await compare({
      contract,
      currentFile: referenceFile,
      suffix: 'rounded-corners',
    })

    expect(result.maskedPixels).toBe(12)
    expect(result.comparedPixels).toBe(4)
  })

  it('counts overlapping mask pixels once in the mismatch denominator', async () => {
    const referenceFile = await writePng('reference.png', 3, 3, {
      red: 10,
      green: 20,
      blue: 30,
    })
    const contract = await contractFor({
      referenceFile,
      width: 3,
      height: 3,
      masks: [
        { kind: 'rectangle', x: 0, y: 0, width: 2, height: 2 },
        { kind: 'rectangle', x: 1, y: 1, width: 2, height: 2 },
      ],
    })

    const result = await compare({
      contract,
      currentFile: referenceFile,
      suffix: 'overlapping-masks',
    })

    expect(result.maskedPixels).toBe(7)
    expect(result.comparedPixels).toBe(2)
  })

  it('reports the expected CIE76 RGB delta through flat UI samples', async () => {
    const referenceFile = await writePng('reference.png', 1, 1, {
      red: 0,
      green: 0,
      blue: 0,
    })
    const currentFile = await writePng('current.png', 1, 1, {
      red: 255,
      green: 255,
      blue: 255,
    })
    const contract = {
      ...(await contractFor({ referenceFile, width: 1, height: 1 })),
      flatUiSamples: [
        {
          label: 'black reference',
          x: 0,
          y: 0,
          expected: [0, 0, 0] as const,
          maxDeltaE: 3,
        },
      ],
    } as SceneVisualContract

    const result = await compare({
      contract,
      currentFile,
      suffix: 'rgb-delta',
    })

    expect(result.samples[0].referenceDeltaE).toBe(0)
    expect(result.samples[0].actualDeltaE).toBeCloseTo(100, 3)
  })

  it('returns zero for identical pixels and detects changed pixels', async () => {
    const referenceFile = await writePng('reference.png', 2, 2, {
      red: 0,
      green: 0,
      blue: 0,
    })
    const changedFile = await writePng('changed.png', 2, 2, {
      red: 255,
      green: 255,
      blue: 255,
    })
    const contract = await contractFor({ referenceFile, width: 2, height: 2 })

    const identical = await compare({
      contract,
      currentFile: referenceFile,
      suffix: 'identical',
    })
    const changed = await compare({
      contract,
      currentFile: changedFile,
      suffix: 'changed',
    })

    expect(identical.differentPixels).toBe(0)
    expect(identical.mismatchRatio).toBe(0)
    expect(changed.differentPixels).toBe(4)
    expect(changed.mismatchRatio).toBe(1)
  })

  it('rejects a current image with dimensions different from the contract', async () => {
    const referenceFile = await writePng('reference.png', 2, 2, {
      red: 0,
      green: 0,
      blue: 0,
    })
    const currentFile = await writePng('current.png', 3, 2, {
      red: 0,
      green: 0,
      blue: 0,
    })
    const contract = await contractFor({ referenceFile, width: 2, height: 2 })

    await expect(
      compare({ contract, currentFile, suffix: 'dimension-mismatch' }),
    ).rejects.toThrow(/current frame must be 2x2; received 3x2/)
  })
})
