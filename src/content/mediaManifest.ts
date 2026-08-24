import type { MediaAsset } from '../types/content'

const yandexSourceLabel = 'Яндекс Карты — публичная галерея «Комод»'
const yandexCaptureDate = '2026-08-24'
const yandexOrganisationUrl =
  'https://yandex.ru/maps/org/komod/231221046215/' as const
const vkMirrorCaptureDate = '2026-08-24'

const yandexDocumentaryAssets = [
  {
    id: 'exterior-wide',
    src: '/media/documentary/originals/exterior-wide.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/10447847/2a0000018ae85004eea8274e79b4096b4a78/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать фасад и террасу без предположений о дате съёмки.',
    sha256: '6092C9C42D94F15C89EA1FCAC14BFA270BBD1B173458ECE5166F272460E834DC',
    width: 1280,
    height: 960,
  },
  {
    id: 'entrance-close',
    src: '/media/documentary/originals/entrance-close.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/4335161/2a0000017973f2e5cd178de37f860f5e1035/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать вход и вывеску кофейни, не заявляя актуальные часы работы.',
    sha256: 'EA78B70C35E8F86E048C76EA0BBC53F6D71600B2F12600F9AFDE43657BA6891A',
    width: 1280,
    height: 949,
  },
  {
    id: 'interior-wide',
    src: '/media/documentary/originals/interior-wide.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/1879929/2a0000016efa75bec2b1a0ed13666538f669/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать общий вид интерьера и видимые предметы без обещаний о посадке.',
    sha256: 'DDBA6AEE6F0D2C6858A15F0CC00A177A2EE73369475FEB5921ACD3BB51869330',
    width: 1280,
    height: 853,
  },
  {
    id: 'coffee-by-window',
    src: '/media/documentary/originals/coffee-by-window.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/14920824/2a00000194463bd80f0c7626518d54d2f06d/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать чашку у зимнего окна; не датировать и не идентифицировать напиток.',
    sha256: '3267F11FBE86A9438BE8ADC93306EF52B0302A81712B69D6898B04CDC1567CA6',
    width: 720,
    height: 1280,
  },
  {
    id: 'illuminated-cabinet',
    src: '/media/documentary/originals/illuminated-cabinet.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/19883212/2a0000019ed63bd9851cf62b06ea4de375a7/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать подсвеченный шкаф и интерьерную деталь без трактовки знака как логотипа.',
    sha256: 'AF1168A67C7942CABB78BDE1A84ECFEF29B272ADD562A66EE5DB1E127FBC3CD7',
    width: 960,
    height: 1280,
  },
  {
    id: 'fireplace-corner',
    src: '/media/documentary/originals/fireplace-corner.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/13461681/2a0000019081d576bf6a19fcdeff28ee2453/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать уголок интерьера с камином без утверждения, что камин действует.',
    sha256: 'ED21F21D83B6DC5DC0D1001F4ABBBD1530C5FFBBFFFB15CCFBC2868FC6D2AA3A',
    width: 958,
    height: 1280,
  },
  {
    id: 'ornate-mirror',
    src: '/media/documentary/originals/ornate-mirror.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/11383855/2a0000018b62c8cbb15535695efb5af5ab81/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать декоративное зеркало и окружающие интерьерные детали.',
    sha256: '49CDD896AAC25AAEEE07AC00E39B6442FC14565606158E9C387011191E598C9E',
    width: 961,
    height: 1280,
  },
  {
    id: 'yellow-chair',
    src: '/media/documentary/originals/yellow-chair.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/16497373/2a00000198eb15297f02447623c5c20b95e8/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать горчичное кресло и плиточный интерьер без обещания доступности места.',
    sha256: '73F8C0A4E45D772AC29C1A4CCD4E4B8E3AF836A7ACE5C07B214B42E4959CF884',
    width: 962,
    height: 1280,
  },
  {
    id: 'marine-breakfast',
    src: '/media/documentary/originals/marine-breakfast.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/17692458/2a0000019e9863870cfbd51a8cee798c879d/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать тарелку с завтраком и кофе без привязки к конкретному названию меню.',
    sha256: '7C6C754B958E27F87F3A61EDAFAC3230B591CD954AD96B93DA813C9663ADE2A6',
    width: 960,
    height: 1280,
  },
  {
    id: 'big-breakfast',
    src: '/media/documentary/originals/big-breakfast.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/10703420/2a0000018c348673ac2e67fa3dd476cd3f16/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать большую тарелку с завтраком без утверждения о текущей подаче.',
    sha256: 'C053D0B84B07D5BFE031D4162AAD4FA5504A98F22370331ECC8285A413DA073E',
    width: 1280,
    height: 957,
  },
  {
    id: 'waffle-berries',
    src: '/media/documentary/originals/waffle-berries.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/1908863/2a00000187f0b3775726c6f91b8652a11562/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать вафлю с ягодами без утверждения о наличии позиции сегодня.',
    sha256: 'C01F96C13F899D21A765FC1D7FB07839AEC2570971C1F6A2482715AC8236DE47',
    width: 1280,
    height: 960,
  },
  {
    id: 'coffee-cup',
    src: '/media/documentary/originals/coffee-cup.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/9719535/2a0000018b17ced39186f94e53958094b9d2/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать крупный план чашки кофе без определения рецепта.',
    sha256: 'AEB699A329395B04BBBC3780A550092FF638F1998C07D2A96F23C58314D76E67',
    width: 576,
    height: 768,
  },
  {
    id: 'cold-drinks',
    src: '/media/documentary/originals/cold-drinks.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/1705560/2a0000016efa7aec595b72489e97631b704f/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать ряд цветных холодных напитков без названий и состава.',
    sha256: '98276F59E2061AA55FBF78133A90FBACEE2E830FA2472DF49D0623AE04FACD3C',
    width: 1280,
    height: 847,
  },
  {
    id: 'marshmallow-drink',
    src: '/media/documentary/originals/marshmallow-drink.webp',
    kind: 'documentary',
    documentary: true,
    recordedOn: yandexCaptureDate,
    sourceLabel: yandexSourceLabel,
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/3912953/2a000001762e2cac31d306d56b584a467e11/XXXL',
    rightsStatus: 'owner-approval-required',
    transformationNote: 'Неизменённый файл из галереи; преобразования не выполнялись.',
    altStrategy: 'Описывать напиток с маршмеллоу без утверждения о текущем меню.',
    sha256: '4BCBA4EA8587924504729E667E3DFC403598AD5CDC5BA4F0F29433C21AD7217A',
    width: 852,
    height: 1280,
  },
] as const

const registeredYandexDocumentaryAssets = yandexDocumentaryAssets.map(
  (item) => ({
    ...item,
    sourceAccess: 'direct-public-gallery' as const,
    sourcePageUrl: yandexOrganisationUrl,
    immutableSourcePath:
      `source-assets/yandex-2026-08-24/${item.src.split('/').at(-1)}` as `source-assets/yandex-2026-08-24/${string}`,
  }),
) satisfies readonly MediaAsset[]

const vkMirrorDocumentaryAssets = [
  {
    id: 'vk-chicory-cups-2026-03-05',
    src: '/media/documentary/originals/vk-chicory-cups-2026-03-05.jpg',
    kind: 'documentary',
    documentary: true,
    recordedOn: vkMirrorCaptureDate,
    sourcePublishedOn: '2026-03-05',
    sourceLabel:
      'VK-origin media через public mirror orgs.biz; прямой VK не открыт',
    sourceUrl:
      'https://sun9-46.userapi.com/s/v1/ig2/AyoGwJIgTcUDMjxkCSKZvJ28Bq5r8Wn78skWP6QzZVNQAA4aPdkaY3hnylCbsWuHghbN1PHz7LOvpLxEuafgRW1l.jpg?quality=95&as=32x48,48x72,72x108,108x162,160x240,240x360,360x540,480x720,540x810,640x960,720x1080,1080x1621,1280x1921,1440x2161,1706x2560&from=bu',
    sourceAccess: 'public-mirror',
    sourcePageUrl: 'https://komod-samara.orgs.biz/news/3540',
    originUrl:
      'https://vk.com/club118960395?w=wall-118960395_3540',
    immutableSourcePath:
      'source-assets/vk-mirror-2026-08-24/vk-chicory-cups-2026-03-05.jpg',
    rightsStatus: 'owner-approval-required',
    transformationNote:
      'Неизменённые байты полноразмерного userapi-файла; преобразования не выполнялись.',
    altStrategy:
      'Описывать две чашки напитков в светлом интерьере без утверждения о текущем меню или составе.',
    sha256: '8AB9E5BF322F4DF213251FBB35114862C4FCA306CFF99C2552EEE81B500B36A1',
    width: 1706,
    height: 2560,
  },
] as const satisfies readonly MediaAsset[]

const generatedDecorativeAssets = [
  {
    id: 'paper-texture-v1',
    src: '/media/generated-decorative/paper-texture-v1.png',
    kind: 'generated-decorative',
    documentary: false,
    recordedOn: '2026-08-24',
    sourceLabel: 'OpenAI ImageGen — встроенная генерация',
    rightsStatus: 'project-generated',
    transformationNote:
      'Сгенерирована как бесшовная тёплая бумажная текстура без текста, логотипов и предметов.',
    altStrategy: 'Чисто декоративный фон: пустой alt и aria-hidden при выводе.',
    sha256: 'BC39ED6CEB80F9674EF403F9F2C8BD64494A2F0CCB70A18D34A4292C87014779',
    width: 1254,
    height: 1254,
  },
  {
    id: 'motif-sheet-v1',
    src: '/media/generated-decorative/motif-sheet-v1.png',
    kind: 'generated-decorative',
    documentary: false,
    recordedOn: '2026-08-24',
    sourceLabel: 'OpenAI ImageGen — встроенная генерация',
    rightsStatus: 'project-generated',
    transformationNote:
      'Сгенерирован лист изолированных рисованных мотивов в палитре проекта; это не логотип и не вид кофейни.',
    altStrategy: 'Декоративные мотивы: пустой alt и aria-hidden при выводе.',
    sha256: 'EEF3D35A10D857FDDC306ADF83A8B61813A4BC6665F3FC1772C448BA2D36E450',
    width: 1254,
    height: 1254,
  },
] as const satisfies readonly MediaAsset[]

export const mediaManifest = [
  ...registeredYandexDocumentaryAssets,
  ...vkMirrorDocumentaryAssets,
  ...generatedDecorativeAssets,
] as const satisfies readonly MediaAsset[]

export type MediaId = (typeof mediaManifest)[number]['id']

export const mediaById = new Map(
  mediaManifest.map((item) => [item.id, item] as const),
)

export function getMediaById(id: MediaId): MediaAsset {
  const item = mediaById.get(id)

  if (!item) {
    throw new Error(`Unknown media id: ${id}`)
  }

  return item
}
