// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { getMediaById } from '../../src/content/mediaManifest'
import { sceneVisualContracts } from './contracts'
import {
  mediaProvenanceIssues,
  type RenderedMediaEvidence,
} from './mediaProvenance'

const pageUrl = 'http://127.0.0.1:4173/#fixture'

const yandexOnly = {
  allowedKinds: ['documentary'],
  allowedSourceUrlPatterns: [/^https:\/\/avatars\.mds\.yandex\.net\//],
} as const

const yandexOrVk = {
  allowedKinds: ['documentary'],
  allowedSourceUrlPatterns: [
    /^https:\/\/avatars\.mds\.yandex\.net\//,
    /^https:\/\/sun9-[^.]+\.userapi\.com\//,
  ],
} as const

const evidence = (
  overrides: Partial<RenderedMediaEvidence> = {},
): RenderedMediaEvidence => ({
  mediaId: 'exterior-wide',
  mediaKind: 'documentary',
  mediaSource:
    'https://avatars.mds.yandex.net/get-altay/10447847/2a0000018ae85004eea8274e79b4096b4a78/XXXL',
  currentSrc:
    'http://127.0.0.1:4173/media/documentary/originals/exterior-wide.webp',
  pageUrl,
  ...overrides,
})

describe('mediaProvenanceIssues', () => {
  it('accepts only evidence that resolves to the independent manifest entry', () => {
    expect(mediaProvenanceIssues(evidence(), yandexOnly)).toEqual([])

    expect(
      mediaProvenanceIssues(
        evidence({
          mediaSource: 'Яндекс Карты — публичная галерея «Комод»',
        }),
        yandexOnly,
      ),
    ).toEqual([])
  })

  it('rejects an unknown DOM media id instead of trusting its other attributes', () => {
    expect(
      mediaProvenanceIssues(
        evidence({
          mediaId: 'forged-id',
          mediaKind: 'documentary',
        }),
        yandexOnly,
      ),
    ).toEqual([
      'data-media-id=forged-id does not resolve in the independent media manifest',
    ])
  })

  it('rejects forged kind, source and local pathname claims', () => {
    const issues = mediaProvenanceIssues(
      evidence({
        mediaKind: 'documentary-derived',
        mediaSource: 'https://avatars.mds.yandex.net/forged',
        currentSrc:
          'http://127.0.0.1:4173/media/documentary/originals/entrance-close.webp',
      }),
      yandexOnly,
    )

    expect(issues).toContain(
      'data-media-kind=documentary-derived does not match manifest kind=documentary',
    )
    expect(issues).toContain(
      'data-media-source does not match a source field on manifest entry exterior-wide',
    )
    expect(issues).toContain(
      'currentSrc pathname=/media/documentary/originals/entrance-close.webp does not match manifest src=/media/documentary/originals/exterior-wide.webp',
    )
  })

  it('accepts validated VK-origin userapi media only when its scene contract allows it', () => {
    const vkAsset = getMediaById('vk-chicory-cups-2026-03-05')
    const vkEvidence = evidence({
      mediaId: vkAsset.id,
      mediaSource: vkAsset.sourceUrl,
      currentSrc: new URL(vkAsset.src, pageUrl).href,
    })

    expect(mediaProvenanceIssues(vkEvidence, yandexOrVk)).toEqual([])
    expect(mediaProvenanceIssues(vkEvidence, yandexOnly)).toContain(
      'manifest sourceUrl is not allowed by this visual media contract',
    )
  })

  it('rejects a remote runtime image even when its pathname resembles the manifest src', () => {
    expect(
      mediaProvenanceIssues(
        evidence({
          currentSrc:
            'https://example.com/media/documentary/originals/exterior-wide.webp',
        }),
        yandexOnly,
      ),
    ).toContain(
      'currentSrc origin=https://example.com does not match page origin=http://127.0.0.1:4173',
    )
  })
})

describe('scene media provenance contracts', () => {
  it('locks all four masked contact-map thumbnails to their individual bounds', () => {
    const contacts = sceneVisualContracts.find(({ id }) => id === 'contacts')
    const thumbnails = contacts?.requiredMedia.find(
      ({ selector }) => selector === '[data-map-thumb]',
    )

    expect(thumbnails).toMatchObject({
      count: 4,
      bounds: [
        { expected: { x: 616, y: 174, width: 150, height: 100 } },
        { expected: { x: 905, y: 174, width: 112, height: 105 } },
        { expected: { x: 616, y: 466, width: 150, height: 100 } },
        { expected: { x: 905, y: 466, width: 112, height: 100 } },
      ],
    })
  })

  it('allows validated userapi media in the event contract without widening contact media', () => {
    const eventMedia = sceneVisualContracts
      .find(({ id }) => id === 'events')
      ?.requiredMedia.find(
        ({ selector }) => selector === '[data-visual-media="event-card"]',
      )
    const contactMedia = sceneVisualContracts
      .find(({ id }) => id === 'contacts')
      ?.requiredMedia.find(
        ({ selector }) => selector === '[data-visual-media="contacts-exterior"]',
      )
    const userapi =
      'https://sun9-46.userapi.com/s/v1/ig2/validated-documentary.jpg'
    const accepts = (media: typeof eventMedia, value: string) =>
      (
        media?.provenance as unknown as {
          allowedSourceUrlPatterns?: readonly RegExp[]
        }
      ).allowedSourceUrlPatterns?.some((pattern) => pattern.test(value)) ?? false

    expect(accepts(eventMedia, userapi)).toBe(true)
    expect(accepts(contactMedia, userapi)).toBe(false)
  })
})
