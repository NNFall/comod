/* global console, process */

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, normalize, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDirectory, '..')
const mediaRoot = resolve(projectRoot, 'public', 'media')
const manifestUrl = pathToFileURL(
  resolve(projectRoot, 'src', 'content', 'mediaManifest.ts'),
)
const { mediaManifest } = await import(manifestUrl.href)

function collectFiles(directory) {
  if (!existsSync(directory)) return []

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name)

    if (entry.isDirectory()) return collectFiles(absolutePath)
    if (entry.name === '.gitkeep') return []
    return [absolutePath]
  })
}

function sha256(absolutePath) {
  return createHash('sha256')
    .update(readFileSync(absolutePath))
    .digest('hex')
    .toUpperCase()
}

function manifestPath(src) {
  if (!src.startsWith('/media/')) {
    throw new Error(`Manifest path must start with /media/: ${src}`)
  }

  const absolutePath = normalize(resolve(projectRoot, 'public', src.slice(1)))
  const outsideMediaRoot = relative(mediaRoot, absolutePath).startsWith('..')

  if (outsideMediaRoot) {
    throw new Error(`Manifest path escapes public/media: ${src}`)
  }

  return absolutePath
}

const errors = []
const knownPaths = new Set()
const knownIds = new Set()

for (const item of mediaManifest) {
  if (knownIds.has(item.id)) errors.push(`Duplicate media id: ${item.id}`)
  knownIds.add(item.id)

  let absolutePath
  try {
    absolutePath = manifestPath(item.src)
  } catch (error) {
    errors.push(error.message)
    continue
  }

  const comparablePath = absolutePath.toLowerCase()
  if (knownPaths.has(comparablePath)) {
    errors.push(`Duplicate media path: ${item.src}`)
  }
  knownPaths.add(comparablePath)

  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    errors.push(`Missing media file: ${item.src}`)
    continue
  }

  const actualHash = sha256(absolutePath)
  if (actualHash !== item.sha256) {
    errors.push(
      `Hash mismatch for ${item.src}: expected ${item.sha256}, got ${actualHash}`,
    )
  }

  try {
    const metadata = await sharp(absolutePath).metadata()

    if (metadata.width !== item.width || metadata.height !== item.height) {
      errors.push(
        `Dimension mismatch for ${item.src}: expected ${item.width}x${item.height}, got ${metadata.width ?? 'unknown'}x${metadata.height ?? 'unknown'}`,
      )
    }
  } catch (error) {
    errors.push(`Unable to read image metadata for ${item.src}: ${error.message}`)
  }

  if (item.kind === 'documentary') {
    const sourceAsset = resolve(
      projectRoot,
      'source-assets',
      'yandex-2026-08-24',
      absolutePath.split(/[\\/]/).at(-1),
    )

    if (!existsSync(sourceAsset)) {
      errors.push(`Missing immutable source for ${item.src}`)
    } else if (sha256(sourceAsset) !== actualHash) {
      errors.push(`Documentary copy differs from immutable source: ${item.src}`)
    }
  }
}

for (const absolutePath of collectFiles(mediaRoot)) {
  if (!knownPaths.has(absolutePath.toLowerCase())) {
    errors.push(
      `Orphan production media file: ${relative(projectRoot, absolutePath).replaceAll('\\', '/')}`,
    )
  }
}

if (errors.length > 0) {
  console.error('[media] Manifest verification failed:')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exitCode = 1
} else {
  console.log(
    `[media] OK: ${mediaManifest.length} tracked assets; all files, hashes, dimensions and immutable documentary copies verified.`,
  )
}
