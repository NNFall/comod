/// <reference types="node" />

import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'
import { cwd, platform } from 'node:process'
import { describe, expect, it } from 'vitest'

import { resolveImmutableSourcePath } from '../../scripts/media-source-paths'

const projectRoot = cwd()

describe('immutable documentary source paths', () => {
  it('rejects a public-mirror path that traverses into the Yandex pack', () => {
    expect(() =>
      resolveImmutableSourcePath({
        projectRoot,
        sourceAccess: 'public-mirror',
        immutableSourcePath:
          'source-assets/vk-mirror-2026-08-24/../yandex-2026-08-24/exterior-wide.webp',
      }),
    ).toThrow(/public-mirror source escapes its immutable pack/i)
  })

  it('rejects source-assets when the whole directory resolves outside the project', (context) => {
    const sandboxRoot = mkdtempSync(join(tmpdir(), 'komod-source-junction-'))
    const resolvedSandboxRoot = resolve(sandboxRoot)
    const resolvedTemporaryRoot = resolve(tmpdir())
    const temporaryProjectRoot = join(sandboxRoot, 'project')
    const externalSourceAssetsRoot = join(
      sandboxRoot,
      'external-source-assets',
    )
    const externalVkPackRoot = join(
      externalSourceAssetsRoot,
      'vk-mirror-2026-08-24',
    )
    const sourceAssetsLink = join(temporaryProjectRoot, 'source-assets')

    if (!resolvedSandboxRoot.startsWith(`${resolvedTemporaryRoot}${sep}`)) {
      throw new Error('Refusing to use a test fixture outside the temp root')
    }

    try {
      mkdirSync(temporaryProjectRoot, { recursive: true })
      mkdirSync(externalVkPackRoot, { recursive: true })
      writeFileSync(join(externalVkPackRoot, 'fixture.jpg'), 'fixture')

      try {
        symlinkSync(
          externalSourceAssetsRoot,
          sourceAssetsLink,
          platform === 'win32' ? 'junction' : 'dir',
        )
      } catch (error) {
        const errorCode = (error as NodeJS.ErrnoException).code

        if (['EPERM', 'EACCES', 'ENOSYS', 'ENOTSUP'].includes(errorCode ?? '')) {
          context.skip()
          return
        }

        throw error
      }

      expect(() =>
        resolveImmutableSourcePath({
          projectRoot: temporaryProjectRoot,
          sourceAccess: 'public-mirror',
          immutableSourcePath:
            'source-assets/vk-mirror-2026-08-24/fixture.jpg',
        }),
      ).toThrow(/source-assets resolves outside project root/i)
    } finally {
      rmSync(resolvedSandboxRoot, { recursive: true, force: true })
    }
  })
})
