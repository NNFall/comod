import type { MediaKind } from '../../src/types/content'
import { mediaManifest } from '../../src/content/mediaManifest'

export type RenderedMediaEvidence = {
  readonly mediaId: string | null
  readonly mediaKind: string | null
  readonly mediaSource: string | null
  readonly currentSrc: string
  readonly pageUrl: string
}

export type MediaProvenanceExpectation = {
  readonly allowedKinds: readonly MediaKind[]
  readonly allowedSourceUrlPatterns: readonly RegExp[]
}

const independentMediaById = new Map(
  mediaManifest.map((item) => [item.id as string, item] as const),
)

const matchesAny = (value: string, patterns: readonly RegExp[]) =>
  patterns.some((pattern) => new RegExp(pattern.source, pattern.flags).test(value))

export const mediaProvenanceIssues = (
  evidence: RenderedMediaEvidence,
  expectation: MediaProvenanceExpectation,
): readonly string[] => {
  if (!evidence.mediaId?.trim()) {
    return ['missing data-media-id']
  }

  const manifestItem = independentMediaById.get(evidence.mediaId)
  if (!manifestItem) {
    return [
      `data-media-id=${evidence.mediaId} does not resolve in the independent media manifest`,
    ]
  }

  const issues: string[] = []
  if (evidence.mediaKind !== manifestItem.kind) {
    issues.push(
      `data-media-kind=${evidence.mediaKind ?? '<missing>'} does not match manifest kind=${manifestItem.kind}`,
    )
  }
  if (!expectation.allowedKinds.includes(manifestItem.kind)) {
    issues.push(
      `manifest kind=${manifestItem.kind} is not allowed by this visual media contract`,
    )
  }

  const manifestSources = [manifestItem.sourceUrl, manifestItem.sourceLabel].filter(
    (source): source is string => Boolean(source),
  )
  if (!evidence.mediaSource || !manifestSources.includes(evidence.mediaSource)) {
    issues.push(
      `data-media-source does not match a source field on manifest entry ${manifestItem.id}`,
    )
  }

  if (
    !manifestItem.sourceUrl ||
    !matchesAny(manifestItem.sourceUrl, expectation.allowedSourceUrlPatterns)
  ) {
    issues.push('manifest sourceUrl is not allowed by this visual media contract')
  }

  let page: URL
  let current: URL
  try {
    page = new URL(evidence.pageUrl)
    current = new URL(evidence.currentSrc, page)
  } catch {
    issues.push('currentSrc or page URL is invalid')
    return issues
  }

  if (current.origin !== page.origin) {
    issues.push(
      `currentSrc origin=${current.origin} does not match page origin=${page.origin}`,
    )
  }

  const expectedPathname = new URL(manifestItem.src, page).pathname
  if (current.pathname !== expectedPathname) {
    issues.push(
      `currentSrc pathname=${current.pathname} does not match manifest src=${expectedPathname}`,
    )
  }

  return issues
}
