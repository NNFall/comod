import { expect, test, type Page } from '@playwright/test'

import { compareReference } from '../visual/compareReference'
import { mediaProvenanceIssues } from '../visual/mediaProvenance'
import {
  REFERENCE_VIEWPORT,
  sceneVisualContracts,
  type BoxExpectation,
  type FunctionalMapRequirement,
  type GeometryGuide,
  type RequiredMedia,
  type SceneVisualContract,
} from '../visual/contracts'

test.use({
  viewport: REFERENCE_VIEWPORT,
  deviceScaleFactor: 1,
  colorScheme: 'light',
  locale: 'ru-RU',
  reducedMotion: 'reduce',
})

const settleFontsAndImages = async (page: Page, sceneSelector: string) =>
  page.evaluate(async (selector) => {
    await document.fonts.ready
    const brokenImages: string[] = []
    const roots = [
      document.querySelector('.site-header'),
      document.querySelector(selector),
    ].filter((root): root is Element => root !== null)
    const images = Array.from(
      new Set(roots.flatMap((root) => Array.from(root.querySelectorAll('img')))),
    )

    await Promise.all(
      images.map(async (image) => {
        try {
          await image.decode()
        } catch {
          brokenImages.push(image.currentSrc || image.src || image.alt)
        }
      }),
    )

    await new Promise<void>((resolveFrame) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolveFrame()))
    })

    return brokenImages
  }, sceneSelector)

const waitForSceneMarker = async (
  page: Page,
  contract: SceneVisualContract,
) => {
  try {
    await page.locator(contract.readySelector).waitFor({
      state: 'attached',
      timeout: 2_000,
    })
    return true
  } catch {
    return false
  }
}

const expectBounds = (
  label: string,
  box: { x: number; y: number; width: number; height: number },
  expectation: BoxExpectation,
) => {
  for (const dimension of ['x', 'y', 'width', 'height'] as const) {
    const drift = Math.abs(box[dimension] - expectation.expected[dimension])
    expect
      .soft(
        drift,
        `${label}: ${dimension}=${box[dimension].toFixed(2)}, expected ${expectation.expected[dimension]}±${expectation.tolerance[dimension]}`,
      )
      .toBeLessThanOrEqual(expectation.tolerance[dimension])
  }
}

const expectGuide = async (page: Page, guide: GeometryGuide) => {
  const locator = page.locator(guide.selector)
  const count = await locator.count()
  expect.soft(count, `${guide.label}: expected one ${guide.selector}`).toBe(1)

  if (count !== 1) {
    return
  }

  const box = await locator.boundingBox()
  expect.soft(box, `${guide.label}: element has no rendered box`).not.toBeNull()

  if (!box) {
    return
  }

  expectBounds(guide.label, box, guide)
}

const expectRequiredMedia = async (page: Page, media: RequiredMedia) => {
  const locator = page.locator(media.selector)
  const count = await locator.count()
  expect
    .soft(count, `${media.label}: expected ${media.count} ${media.selector}`)
    .toBe(media.count)

  for (let index = 0; index < Math.min(count, media.count); index += 1) {
    const item = locator.nth(index)
    const itemLabel = `${media.label} ${index + 1}`
    const box = await item.boundingBox()
    expect.soft(box, `${itemLabel}: media has no rendered box`).not.toBeNull()
    if (box) {
      expectBounds(itemLabel, box, media.bounds[index])
    }

    const [kind, mediaId, source] = await Promise.all([
      item.getAttribute('data-media-kind'),
      item.getAttribute('data-media-id'),
      item.getAttribute('data-media-source'),
    ])

    const isImage = await item.evaluate((element) => element.tagName === 'IMG')
    const image = isImage ? item : item.locator('img')
    const imageCount = await image.count()
    expect.soft(imageCount, `${itemLabel}: expected one rendered img`).toBe(1)

    let currentSource = ''
    if (imageCount === 1) {
      currentSource = await image.evaluate(
        (element) => (element as HTMLImageElement).currentSrc,
      )
      expect
        .soft(
          currentSource.length,
          `${itemLabel}: rendered img has no currentSrc`,
        )
        .toBeGreaterThan(0)
    }

    const provenanceIssues = mediaProvenanceIssues(
      {
        mediaId,
        mediaKind: kind,
        mediaSource: source,
        currentSrc: currentSource,
        pageUrl: page.url(),
      },
      media.provenance,
    )
    expect
      .soft(
        provenanceIssues,
        `${itemLabel}: independent media manifest provenance and local path`,
      )
      .toEqual([])
  }
}

const expectFunctionalMap = async (
  page: Page,
  map: FunctionalMapRequirement,
) => {
  const locator = page.locator(map.selector)
  const count = await locator.count()
  expect.soft(count, `functional map: expected one ${map.selector}`).toBe(1)

  if (count !== 1) {
    return
  }

  expect
    .soft(await locator.getAttribute('href'), 'functional map: Yandex route link')
    .toMatch(map.hrefPattern)
  expect
    .soft(await locator.locator(map.svgSelector).count(), 'functional map: SVG')
    .toBe(1)
  expect
    .soft(await locator.locator(map.pinSelector).count(), 'functional map: pin')
    .toBe(1)

  for (const selector of map.geometrySelectors) {
    expect
      .soft(
        await locator.locator(selector).count(),
        `functional map: meaningful SVG geometry ${selector}`,
      )
      .toBe(1)
  }
}

for (const contract of sceneVisualContracts) {
  test(`${contract.id} matches its locked 1672x941 UI contract`, async ({
    page,
  }, testInfo) => {
    const runtimeErrors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(`console: ${message.text()}`)
      }
    })
    page.on('pageerror', (error) => {
      runtimeErrors.push(`page: ${error.message}`)
    })
    page.on('requestfailed', (request) => {
      runtimeErrors.push(
        `request: ${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`,
      )
    })

    const response = await page.goto(contract.anchorUrl, {
      waitUntil: 'networkidle',
    })
    expect(response?.ok(), `${contract.id}: page response`).toBe(true)

    const scene = page.locator(contract.sceneSelector)
    await expect(scene, `${contract.id}: scene anchor`).toBeAttached()
    await scene.evaluate((element) => {
      element.scrollIntoView({ behavior: 'instant', block: 'start' })
    })

    const brokenImages = await settleFontsAndImages(page, contract.sceneSelector)
    const markerReady = await waitForSceneMarker(page, contract)
    const currentFile = testInfo.outputPath(
      `${contract.id}-current-1672x941.png`,
    )
    const diffFile = testInfo.outputPath(`${contract.id}-diff-1672x941.png`)

    await page.screenshot({
      path: currentFile,
      fullPage: false,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    })
    await testInfo.attach(`${contract.id} current 1672x941`, {
      path: currentFile,
      contentType: 'image/png',
    })

    const comparison = await compareReference({
      contract,
      currentFile,
      diffFile,
    })
    await testInfo.attach(`${contract.id} masked diff 1672x941`, {
      path: diffFile,
      contentType: 'image/png',
    })

    expect
      .soft(
        markerReady,
        `${contract.id}: missing deterministic ready marker ${contract.readySelector}`,
      )
      .toBe(true)
    expect
      .soft(brokenImages, `${contract.id}: every image must decode before capture`)
      .toEqual([])
    expect
      .soft(runtimeErrors, `${contract.id}: browser runtime errors`)
      .toEqual([])
    expect
      .soft(
        comparison.mismatchRatio,
        `${contract.id}: ${(comparison.mismatchRatio * 100).toFixed(2)}% UI mismatch (${comparison.differentPixels}/${comparison.comparedPixels} compared pixels); inspect ${diffFile}`,
      )
      .toBeLessThanOrEqual(contract.maxMismatchRatio)

    for (const sample of comparison.samples) {
      expect
        .soft(
          sample.referenceDeltaE,
          `${contract.id}/${sample.label}: locked reference sample changed; expected rgb(${sample.expected.join(',')}), received rgb(${sample.reference.join(',')})`,
        )
        .toBeLessThanOrEqual(0.05)
      expect
        .soft(
          sample.actualDeltaE,
          `${contract.id}/${sample.label}: expected ΔE≤${sample.maxDeltaE}, received ${sample.actualDeltaE.toFixed(2)} at rgb(${sample.actual.join(',')})`,
        )
        .toBeLessThanOrEqual(sample.maxDeltaE)
    }

    for (const geometryGuide of contract.geometryGuides) {
      await expectGuide(page, geometryGuide)
    }

    for (const requiredMedia of contract.requiredMedia) {
      await expectRequiredMedia(page, requiredMedia)
    }

    if (contract.functionalMap) {
      await expectFunctionalMap(page, contract.functionalMap)
    }
  })
}
