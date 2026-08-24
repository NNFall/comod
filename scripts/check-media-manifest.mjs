/* global console, process */

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, normalize, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'
import { resolveImmutableSourcePath } from './media-source-paths.ts'

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
    if (!item.immutableSourcePath?.startsWith('source-assets/')) {
      errors.push(`Invalid immutable source path for ${item.src}`)
    } else {
      try {
        const sourceAsset = resolveImmutableSourcePath({
          projectRoot,
          sourceAccess: item.sourceAccess,
          immutableSourcePath: item.immutableSourcePath,
        })

        if (!existsSync(sourceAsset) || !statSync(sourceAsset).isFile()) {
          errors.push(`Missing immutable source for ${item.src}`)
        } else if (sha256(sourceAsset) !== actualHash) {
          errors.push(
            `Documentary copy differs from immutable source: ${item.src}`,
          )
        }
      } catch (error) {
        errors.push(`${error.message}: ${item.src}`)
      }
    }

    if (!['direct-public-gallery', 'public-mirror'].includes(item.sourceAccess)) {
      errors.push(`Invalid source access classification for ${item.src}`)
    }

    if (!item.sourcePageUrl?.startsWith('https://')) {
      errors.push(`Missing HTTPS source page for ${item.src}`)
    }

    if (item.sourceAccess === 'public-mirror') {
      const mirrorPageMatch =
        /^https:\/\/komod-samara\.orgs\.biz\/news\/(?<postId>\d+)$/.exec(
          item.sourcePageUrl,
        )
      const vkPermalinkMatch =
        /^https:\/\/vk\.com\/club118960395\?w=wall-118960395_(?<postId>\d+)$/.exec(
          item.originUrl ?? '',
        )

      if (
        !item.immutableSourcePath.startsWith(
          'source-assets/vk-mirror-2026-08-24/',
        )
      ) {
        errors.push(`VK-origin source is outside its immutable pack: ${item.src}`)
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.sourcePublishedOn ?? '')) {
        errors.push(`Missing source publication date for ${item.src}`)
      }

      if (!mirrorPageMatch) {
        errors.push(`Unexpected public-mirror page for ${item.src}`)
      }

      if (!vkPermalinkMatch) {
        errors.push(`Missing exact VK origin permalink for ${item.src}`)
      }

      if (
        mirrorPageMatch?.groups?.postId &&
        vkPermalinkMatch?.groups?.postId &&
        mirrorPageMatch.groups.postId !== vkPermalinkMatch.groups.postId
      ) {
        errors.push(`Mirror/VK post identifier mismatch for ${item.src}`)
      }

      if (!/^https:\/\/sun9-[^.]+\.userapi\.com\//.test(item.sourceUrl)) {
        errors.push(`Unexpected VK-origin asset host for ${item.src}`)
      }
    } else if (
      !item.sourceUrl.startsWith('https://avatars.mds.yandex.net/') ||
      item.sourcePageUrl !==
        'https://yandex.ru/maps/org/komod/231221046215/' ||
      !item.immutableSourcePath.startsWith('source-assets/yandex-2026-08-24/')
    ) {
      errors.push(`Unexpected direct-gallery provenance for ${item.src}`)
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
