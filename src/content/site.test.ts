import { describe, expect, it } from 'vitest'

import packageManifest from '../../package.json'
import { mediaById, mediaManifest } from './mediaManifest'
import { siteContent } from './site'

const allowedKinds = new Set([
  'documentary',
  'documentary-derived',
  'reference',
  'reference-derived',
  'generated-decorative',
])

describe('Komod content provenance contract', () => {
  it('gives every media item a unique, local and complete provenance record', () => {
    const ids = mediaManifest.map((item) => item.id)
    const paths = mediaManifest.map((item) => item.src)

    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(paths).size).toBe(paths.length)

    mediaManifest.forEach((item) => {
      expect(item.id).not.toHaveLength(0)
      expect(item.src).toMatch(/^\/media\//)
      expect(allowedKinds.has(item.kind)).toBe(true)
      expect(item.recordedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(item.sourceLabel.trim()).not.toHaveLength(0)
      expect(item.rightsStatus.trim()).not.toHaveLength(0)
      expect(item.transformationNote.trim()).not.toHaveLength(0)
      expect(item.altStrategy.trim()).not.toHaveLength(0)
      expect(item.sha256).toMatch(/^[A-F0-9]{64}$/)
      expect(item.width).toBeGreaterThan(0)
      expect(item.height).toBeGreaterThan(0)
    })
  })

  it('marks only untouched documentary originals as documentary evidence', () => {
    mediaManifest.forEach((item) => {
      expect(item.documentary).toBe(item.kind === 'documentary')

      if (item.kind === 'documentary') {
        expect(item.sourceUrl).toMatch(/^https:\/\/avatars\.mds\.yandex\.net\//)
      }
    })
  })

  it('resolves every content media reference through the provenance manifest', () => {
    siteContent.seasonalCards.forEach((card) => {
      expect(mediaById.has(card.mediaId), card.mediaId).toBe(true)
    })
  })

  it('keeps the community card editorial instead of claiming an unverified club', () => {
    const serializedCards = JSON.stringify(siteContent.seasonalCards)

    expect(siteContent.seasonalCards.map((card) => card.category)).not.toContain(
      'club',
    )
    expect(serializedCards).not.toMatch(/komod club|клубн/iu)
  })

  it('labels every published menu price with its verification date and source', () => {
    expect(siteContent.menu.items.length).toBeGreaterThan(0)

    siteContent.menu.items.forEach((item) => {
      expect(item.priceRub).toBeGreaterThan(0)
      expect(item.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(item.sourceUrl).toMatch(/^https:\/\//)
      expect(item.caveat.trim()).not.toHaveLength(0)
    })
  })

  it('publishes only verified contact actions and no unverified WhatsApp route', () => {
    expect(siteContent.identity.phone.e164).toBe('+79272655656')
    expect(siteContent.contactActions.map((action) => action.kind)).toEqual([
      'call',
      'route',
      'source',
    ])
    expect(
      siteContent.contactActions.some((action) =>
        action.href.toLowerCase().includes('whatsapp'),
      ),
    ).toBe(false)
  })

  it('runs media verification through the local and CI verification contract', () => {
    expect(packageManifest.scripts['media:check']).toBe(
      'node scripts/check-media-manifest.mjs',
    )
    expect(packageManifest.scripts.verify).toContain('npm run media:check')
  })
})
