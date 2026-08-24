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
        expect(item.sourceUrl).toMatch(/^https:\/\//)
        expect(item.sourcePageUrl).toMatch(/^https:\/\//)
        expect(item.immutableSourcePath).toMatch(/^source-assets\//)
        expect(['direct-public-gallery', 'public-mirror']).toContain(
          item.sourceAccess,
        )
      }
    })
  })

  it('keeps only the neutral VK-origin frame in the production manifest', () => {
    expect(mediaById.get('vk-chicory-cups-2026-03-05')).toMatchObject({
      sourcePublishedOn: '2026-03-05',
      sourcePageUrl: 'https://komod-samara.orgs.biz/news/3540',
      originUrl: 'https://vk.com/club118960395?w=wall-118960395_3540',
      sha256:
        '8AB9E5BF322F4DF213251FBB35114862C4FCA306CFF99C2552EEE81B500B36A1',
      width: 1706,
      height: 2560,
    })
    expect(mediaManifest.map((asset) => asset.id)).not.toContain(
      'vk-winter-storefront-2026-01-05',
    )

    const item = mediaById.get('vk-chicory-cups-2026-03-05')

    expect(item).toMatchObject({
      kind: 'documentary',
      documentary: true,
      sourceAccess: 'public-mirror',
      rightsStatus: 'owner-approval-required',
    })

    if (!item || item.kind !== 'documentary') return

    expect(item.sourceLabel).toMatch(/VK-origin.*public mirror/iu)
    expect(item.sourceUrl).toMatch(/^https:\/\/sun9-[^.]+\.userapi\.com\//)
    expect(item.sourcePageUrl).toMatch(
      /^https:\/\/komod-samara\.orgs\.biz\/news\/\d+$/,
    )
    expect('originUrl' in item).toBe(true)
    expect('sourcePublishedOn' in item).toBe(true)

    if (!('originUrl' in item) || !('sourcePublishedOn' in item)) return

    expect(item.originUrl).toMatch(
      /^https:\/\/vk\.com\/club118960395\?w=wall-118960395_\d+$/,
    )
    expect(item.immutableSourcePath).toMatch(
      /^source-assets\/vk-mirror-2026-08-24\//,
    )
    expect(item.sourcePublishedOn).toMatch(/^2026-\d{2}-\d{2}$/)
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
