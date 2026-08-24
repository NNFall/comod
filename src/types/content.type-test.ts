import type { DocumentaryMediaAsset } from './content'

interface DocumentaryTypeFixture {
  readonly id: 'type-fixture'
  readonly src: '/media/documentary/originals/type-fixture.jpg'
  readonly kind: 'documentary'
  readonly documentary: true
  readonly recordedOn: '2026-08-24'
  readonly sourceLabel: 'type fixture'
  readonly rightsStatus: 'owner-approval-required'
  readonly transformationNote: 'unchanged'
  readonly altStrategy: 'describe the visible subject'
  readonly sha256: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  readonly width: 1
  readonly height: 1
}

type DirectFixture = DocumentaryTypeFixture & {
  readonly sourceAccess: 'direct-public-gallery'
  readonly sourceUrl: 'https://avatars.mds.yandex.net/example'
  readonly sourcePageUrl: 'https://yandex.ru/maps/org/komod/231221046215/'
  readonly immutableSourcePath: 'source-assets/yandex-2026-08-24/example.jpg'
}

type PublicMirrorFixture = DocumentaryTypeFixture & {
  readonly sourceAccess: 'public-mirror'
  readonly sourceUrl: 'https://sun9-46.userapi.com/example.jpg'
  readonly sourcePageUrl: 'https://komod-samara.orgs.biz/news/3540'
  readonly originUrl: 'https://vk.com/club118960395?w=wall-118960395_3540'
  readonly sourcePublishedOn: '2026-03-05'
  readonly immutableSourcePath: 'source-assets/vk-mirror-2026-08-24/example.jpg'
}

type AssertTrue<Value extends true> = Value
type AssertFalse<Value extends false> = Value
type IsAssignable<Source, Target> = Source extends Target ? true : false

export type DirectFixtureIsAccepted = AssertTrue<
  IsAssignable<DirectFixture, DocumentaryMediaAsset>
>
export type PublicMirrorFixtureIsAccepted = AssertTrue<
  IsAssignable<PublicMirrorFixture, DocumentaryMediaAsset>
>
export type DirectFixtureRejectsOriginUrl = AssertFalse<
  IsAssignable<
    DirectFixture & { readonly originUrl: PublicMirrorFixture['originUrl'] },
    DocumentaryMediaAsset
  >
>
export type DirectFixtureRejectsPublishedOn = AssertFalse<
  IsAssignable<
    DirectFixture & {
      readonly sourcePublishedOn: PublicMirrorFixture['sourcePublishedOn']
    },
    DocumentaryMediaAsset
  >
>
export type PublicMirrorFixtureRequiresOriginUrl = AssertFalse<
  IsAssignable<Omit<PublicMirrorFixture, 'originUrl'>, DocumentaryMediaAsset>
>
export type PublicMirrorFixtureRequiresPublishedOn = AssertFalse<
  IsAssignable<
    Omit<PublicMirrorFixture, 'sourcePublishedOn'>,
    DocumentaryMediaAsset
  >
>
