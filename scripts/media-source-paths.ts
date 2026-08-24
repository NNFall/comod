/// <reference types="node" />

import { existsSync, realpathSync } from 'node:fs'
import { isAbsolute, normalize, relative, resolve, sep } from 'node:path'

import type { MediaSourceAccess } from '../src/types/content'

interface ImmutableSourceResolution {
  readonly projectRoot: string
  readonly sourceAccess: MediaSourceAccess
  readonly immutableSourcePath: string
}

const packDirectoryByAccess = {
  'direct-public-gallery': 'yandex-2026-08-24',
  'public-mirror': 'vk-mirror-2026-08-24',
} as const satisfies Record<MediaSourceAccess, string>

function isInside(root: string, candidate: string): boolean {
  const candidateRelativePath = relative(root, candidate)

  return (
    candidateRelativePath === '' ||
    (candidateRelativePath !== '..' &&
      !candidateRelativePath.startsWith(`..${sep}`) &&
      !isAbsolute(candidateRelativePath))
  )
}

function realPath(path: string): string {
  return realpathSync.native(path)
}

export function resolveImmutableSourcePath({
  projectRoot,
  sourceAccess,
  immutableSourcePath,
}: ImmutableSourceResolution): string {
  if (!immutableSourcePath.startsWith('source-assets/')) {
    throw new Error('Invalid immutable source path')
  }

  const sourceAssetsRoot = resolve(projectRoot, 'source-assets')
  const packRoot = resolve(
    sourceAssetsRoot,
    packDirectoryByAccess[sourceAccess],
  )
  const sourceAsset = normalize(resolve(projectRoot, immutableSourcePath))

  if (!isInside(packRoot, sourceAsset)) {
    throw new Error(`${sourceAccess} source escapes its immutable pack`)
  }

  if (existsSync(sourceAssetsRoot) && existsSync(packRoot)) {
    const realProjectRoot = realPath(projectRoot)
    const realSourceAssetsRoot = realPath(sourceAssetsRoot)
    const realPackRoot = realPath(packRoot)

    if (!isInside(realProjectRoot, realSourceAssetsRoot)) {
      throw new Error('source-assets resolves outside project root')
    }

    if (!isInside(realSourceAssetsRoot, realPackRoot)) {
      throw new Error(`${sourceAccess} pack resolves outside source-assets`)
    }

    if (existsSync(sourceAsset)) {
      const realSourceAsset = realPath(sourceAsset)

      if (!isInside(realPackRoot, realSourceAsset)) {
        throw new Error(`${sourceAccess} source resolves outside its immutable pack`)
      }
    }
  }

  return sourceAsset
}
