export type MediaKind =
  | 'documentary'
  | 'documentary-derived'
  | 'reference'
  | 'reference-derived'
  | 'generated-decorative'

export type MediaRightsStatus =
  | 'owner-approval-required'
  | 'project-generated'
  | 'private-reference-only'

interface MediaAssetBase {
  readonly id: string
  readonly src: string
  readonly recordedOn: string
  readonly sourceLabel: string
  readonly sourceUrl?: string
  readonly rightsStatus: MediaRightsStatus
  readonly transformationNote: string
  readonly altStrategy: string
  readonly sha256: string
  readonly width: number
  readonly height: number
}

export interface DocumentaryMediaAsset extends MediaAssetBase {
  readonly kind: 'documentary'
  readonly documentary: true
  readonly sourceUrl: string
  readonly rightsStatus: 'owner-approval-required'
}

export interface NonDocumentaryMediaAsset extends MediaAssetBase {
  readonly kind: Exclude<MediaKind, 'documentary'>
  readonly documentary: false
}

export type MediaAsset = DocumentaryMediaAsset | NonDocumentaryMediaAsset

export interface NavigationItem {
  readonly href: `#${string}`
  readonly label: string
}

export interface VerifiedPhone {
  readonly display: string
  readonly e164: `+${number}`
  readonly href: `tel:+${number}`
}

export interface SiteIdentity {
  readonly name: string
  readonly descriptor: string
  readonly city: string
  readonly address: string
  readonly phone: VerifiedPhone
  readonly verifiedOn: string
  readonly sourceUrl: string
}

export interface MenuItem {
  readonly id: string
  readonly name: string
  readonly priceRub: number
  readonly verifiedOn: string
  readonly sourceUrl: string
  readonly caveat: string
}

export type EvidenceLevel = 'source-snapshot' | 'editorial-observation'

export interface FeatureItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly evidence: EvidenceLevel
  readonly sourceUrl?: string
}

export type SeasonalCategory = 'seasonal' | 'community' | 'breakfasts'

export interface SeasonalCard<MediaId extends string = string> {
  readonly id: string
  readonly category: SeasonalCategory
  readonly eyebrow: string
  readonly title: string
  readonly description: string
  readonly mediaId: MediaId
  readonly sourceUrl: string
  readonly verificationNote: string
}

export type ContactActionKind = 'call' | 'route' | 'source'

export interface ContactAction {
  readonly kind: ContactActionKind
  readonly label: string
  readonly href: string
  readonly external: boolean
}

export interface SiteContent<MediaId extends string = string> {
  readonly navigation: readonly NavigationItem[]
  readonly identity: SiteIdentity
  readonly hero: {
    readonly eyebrow: string
    readonly title: string
    readonly description: string
    readonly primaryAction: NavigationItem
    readonly secondaryAction: NavigationItem
  }
  readonly menu: {
    readonly verifiedOn: string
    readonly sourceUrl: string
    readonly caveat: string
    readonly items: readonly MenuItem[]
  }
  readonly workFeatures: readonly FeatureItem[]
  readonly aboutFeatures: readonly FeatureItem[]
  readonly seasonalCards: readonly SeasonalCard<MediaId>[]
  readonly contactActions: readonly ContactAction[]
}
