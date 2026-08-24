import type { MediaProvenanceExpectation } from './mediaProvenance'

export const REFERENCE_VIEWPORT = {
  width: 1672,
  height: 941,
} as const

export const UI_MISMATCH_THRESHOLD = 0.025

export type SceneId =
  | 'hero'
  | 'events'
  | 'contacts'
  | 'about'
  | 'work'
  | 'breakfasts'

export type Rgb = readonly [red: number, green: number, blue: number]

export type RectangleMask = {
  kind: 'rectangle'
  x: number
  y: number
  width: number
  height: number
}

export type RoundedRectangleMask = {
  kind: 'rounded-rectangle'
  x: number
  y: number
  width: number
  height: number
  radius: number
}

export type PolygonMask = {
  kind: 'polygon'
  points: readonly { x: number; y: number }[]
}

export type PhotoMask = RectangleMask | RoundedRectangleMask | PolygonMask

export type FlatUiSample = {
  label: string
  x: number
  y: number
  expected: Rgb
  maxDeltaE: number
}

export type BoxExpectation = {
  expected: {
    x: number
    y: number
    width: number
    height: number
  }
  tolerance: {
    x: number
    y: number
    width: number
    height: number
  }
}

export type GeometryGuide = BoxExpectation & {
  label: string
  selector: string
}

export type RequiredMedia = {
  label: string
  selector: string
  count: number
  bounds: readonly BoxExpectation[]
  provenance: MediaProvenanceExpectation
}

export type FunctionalMapRequirement = {
  selector: string
  hrefPattern: RegExp
  svgSelector: string
  pinSelector: string
  geometrySelectors: readonly string[]
}

export type SceneVisualContract = {
  id: SceneId
  anchorUrl: string
  sceneSelector: string
  readySelector: string
  referenceFile: string
  referenceSha256: string
  viewport: { readonly width: number; readonly height: number }
  maxMismatchRatio: number
  photoMasks: readonly PhotoMask[]
  flatUiSamples: readonly FlatUiSample[]
  geometryGuides: readonly GeometryGuide[]
  requiredMedia: readonly RequiredMedia[]
  functionalMap?: FunctionalMapRequirement
}

const headerGuide: GeometryGuide = {
  label: 'sticky desktop header',
  selector: '.site-header',
  expected: { x: 0, y: 0, width: 1672, height: 130 },
  tolerance: { x: 0, y: 0, width: 0, height: 4 },
}

const sceneGuide = (sceneSelector: string): GeometryGuide => ({
  label: 'scene boundary below the header',
  selector: sceneSelector,
  expected: { x: 0, y: 130, width: 1672, height: 811 },
  tolerance: { x: 0, y: 8, width: 0, height: 8 },
})

const guide = (
  label: string,
  selector: string,
  expected: GeometryGuide['expected'],
  tolerance = 8,
): GeometryGuide => ({
  label,
  selector,
  expected,
  tolerance: {
    x: tolerance,
    y: tolerance,
    width: tolerance,
    height: tolerance,
  },
})

const rectangle = (
  x: number,
  y: number,
  width: number,
  height: number,
): RectangleMask => ({ kind: 'rectangle', x, y, width, height })

const polygon = (points: PolygonMask['points']): PolygonMask => ({
  kind: 'polygon',
  points,
})

const roundedRectangle = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): RoundedRectangleMask => ({
  kind: 'rounded-rectangle',
  x,
  y,
  width,
  height,
  radius,
})

const bounds = (
  expected: BoxExpectation['expected'],
  tolerance = 8,
): BoxExpectation => ({
  expected,
  tolerance: {
    x: tolerance,
    y: tolerance,
    width: tolerance,
    height: tolerance,
  },
})

const yandexDocumentaryProvenance: RequiredMedia['provenance'] = {
  allowedKinds: ['documentary', 'documentary-derived'],
  allowedSourceUrlPatterns: [/^https:\/\/avatars\.mds\.yandex\.net\//],
}

const eventDocumentaryProvenance: RequiredMedia['provenance'] = {
  allowedKinds: ['documentary', 'documentary-derived'],
  allowedSourceUrlPatterns: [
    /^https:\/\/avatars\.mds\.yandex\.net\//,
    /^https:\/\/sun9-[^.]+\.userapi\.com\//,
  ],
}

const media = (
  label: string,
  selector: string,
  expectedBounds: readonly BoxExpectation['expected'][],
  provenance: RequiredMedia['provenance'],
  tolerance = 8,
): RequiredMedia => ({
  label,
  selector,
  count: expectedBounds.length,
  bounds: expectedBounds.map((expected) => bounds(expected, tolerance)),
  provenance,
})

/**
 * Only documentary/reference-image pixels are masked. Text, badges, controls,
 * card surfaces, section seams and editorial decoration intentionally remain
 * in the comparison. Geometry guides are an independent anti-overmasking
 * contract.
 */
export const sceneVisualContracts: readonly SceneVisualContract[] = [
  {
    id: 'hero',
    anchorUrl: '/#home',
    sceneSelector: '#home',
    readySelector: '#home[data-scene-ready="hero"]',
    referenceFile: 'tests/references/01-hero-1672x941.png',
    referenceSha256:
      '7E882B4C819D1F0894298ADEC45DD7E368EA3078179DD4E603B9C19D1B301D3E',
    viewport: REFERENCE_VIEWPORT,
    maxMismatchRatio: UI_MISMATCH_THRESHOLD,
    photoMasks: [
      polygon([
        { x: 959, y: 133 },
        { x: 1672, y: 130 },
        { x: 1672, y: 941 },
        { x: 679, y: 941 },
        { x: 742, y: 770 },
        { x: 806, y: 590 },
        { x: 871, y: 405 },
        { x: 928, y: 225 },
      ]),
      polygon([
        { x: 658, y: 642 },
        { x: 879, y: 570 },
        { x: 1299, y: 562 },
        { x: 1672, y: 602 },
        { x: 1672, y: 941 },
        { x: 654, y: 941 },
      ]),
    ],
    flatUiSamples: [
      {
        label: 'orange hero field',
        x: 400,
        y: 700,
        expected: [251, 149, 3],
        maxDeltaE: 3,
      },
      {
        label: 'dark primary action',
        x: 75,
        y: 735,
        expected: [37, 23, 18],
        maxDeltaE: 3,
      },
      {
        label: 'cream facts strip',
        x: 600,
        y: 860,
        expected: [249, 221, 176],
        maxDeltaE: 3,
      },
      {
        label: 'cream header field',
        x: 1100,
        y: 100,
        expected: [249, 222, 182],
        maxDeltaE: 3,
      },
    ],
    requiredMedia: [
      media(
        'hero facade',
        '[data-visual-media="hero-facade"]',
        [{ x: 680, y: 130, width: 992, height: 811 }],
        yandexDocumentaryProvenance,
        16,
      ),
      media(
        'hero documentary cutouts',
        '[data-visual-media="hero-cutout"]',
        [
          { x: 656, y: 585, width: 707, height: 327 },
          { x: 1274, y: 580, width: 398, height: 274 },
        ],
        yandexDocumentaryProvenance,
        20,
      ),
    ],
    geometryGuides: [
      headerGuide,
      sceneGuide('#home'),
      guide(
        'hero documentary boundary',
        '[data-visual-guide="hero-media-boundary"]',
        { x: 675, y: 130, width: 997, height: 811 },
        12,
      ),
      guide(
        'hero copy block',
        '[data-visual-guide="hero-copy"]',
        { x: 60, y: 188, width: 596, height: 475 },
      ),
      guide(
        'hero primary action',
        '[data-visual-guide="hero-cta"]',
        { x: 60, y: 689, width: 314, height: 65 },
        4,
      ),
      guide(
        'hero facts strip',
        '[data-visual-guide="hero-facts"]',
        { x: 42, y: 786, width: 614, height: 106 },
      ),
    ],
  },
  {
    id: 'events',
    anchorUrl: '/#events',
    sceneSelector: '#events',
    readySelector: '#events[data-scene-ready="events"]',
    referenceFile: 'tests/references/02-events-1672x941.png',
    referenceSha256:
      '041B63587A7A14C480A8B8B0E3458E2D58D62AD35EC4E7173E68E0AED9165DB7',
    viewport: REFERENCE_VIEWPORT,
    maxMismatchRatio: UI_MISMATCH_THRESHOLD,
    photoMasks: [
      rectangle(523, 266, 327, 16),
      rectangle(523, 282, 13, 40),
      rectangle(646, 282, 204, 40),
      rectangle(523, 322, 327, 181),
      rectangle(523, 503, 247, 30),
      rectangle(842, 503, 8, 30),
      rectangle(881, 266, 325, 16),
      rectangle(881, 282, 11, 40),
      rectangle(996, 282, 210, 40),
      rectangle(881, 322, 325, 184),
      rectangle(881, 506, 239, 27),
      rectangle(1192, 506, 14, 27),
      rectangle(1236, 266, 325, 16),
      rectangle(1236, 282, 12, 40),
      rectangle(1349, 282, 212, 40),
      rectangle(1236, 322, 325, 184),
      rectangle(1236, 506, 244, 27),
      rectangle(1552, 506, 9, 27),
    ],
    flatUiSamples: [
      {
        label: 'paper scene background',
        x: 300,
        y: 600,
        expected: [254, 241, 219],
        maxDeltaE: 3,
      },
      {
        label: 'active orange filter',
        x: 530,
        y: 205,
        expected: [213, 95, 3],
        maxDeltaE: 3,
      },
      {
        label: 'event card surface',
        x: 700,
        y: 700,
        expected: [252, 240, 221],
        maxDeltaE: 3,
      },
      {
        label: 'dark event banner',
        x: 700,
        y: 850,
        expected: [41, 20, 13],
        maxDeltaE: 3,
      },
    ],
    requiredMedia: [
      media(
        'event card media',
        '[data-visual-media="event-card"]',
        [
          { x: 520, y: 263, width: 333, height: 273 },
          { x: 878, y: 263, width: 331, height: 273 },
          { x: 1233, y: 263, width: 331, height: 273 },
        ],
        eventDocumentaryProvenance,
      ),
    ],
    geometryGuides: [
      headerGuide,
      sceneGuide('#events'),
      guide(
        'events editorial lead',
        '[data-visual-guide="events-copy"]',
        { x: 59, y: 193, width: 397, height: 330 },
      ),
      guide(
        'event filters',
        '[data-visual-guide="event-filters"]',
        { x: 520, y: 192, width: 481, height: 47 },
        4,
      ),
      guide(
        'event card row',
        '[data-visual-guide="event-cards"]',
        { x: 520, y: 262, width: 1044, height: 514 },
      ),
      guide(
        'event footer banner',
        '[data-visual-guide="events-banner"]',
        { x: 520, y: 807, width: 1047, height: 94 },
      ),
    ],
  },
  {
    id: 'contacts',
    anchorUrl: '/#contacts',
    sceneSelector: '#contacts',
    readySelector: '#contacts[data-scene-ready="contacts"]',
    referenceFile: 'tests/references/03-contacts-1672x941.png',
    referenceSha256:
      '0E07B19A3B98D6D4BCAC59C0CF5AAA8783BA1E3DC30D5546381397776EBA8CBE',
    viewport: REFERENCE_VIEWPORT,
    maxMismatchRatio: UI_MISMATCH_THRESHOLD,
    photoMasks: [
      roundedRectangle(616, 174, 150, 100, 18),
      roundedRectangle(905, 174, 112, 105, 18),
      roundedRectangle(616, 466, 150, 100, 18),
      roundedRectangle(905, 466, 112, 100, 18),
      roundedRectangle(1040, 167, 580, 406, 21),
    ],
    flatUiSamples: [
      {
        label: 'contacts scene background',
        x: 300,
        y: 580,
        expected: [246, 239, 232],
        maxDeltaE: 3,
      },
      {
        label: 'comfort panel',
        x: 300,
        y: 650,
        expected: [245, 231, 217],
        maxDeltaE: 3,
      },
      {
        label: 'closing paper band',
        x: 800,
        y: 850,
        expected: [242, 223, 202],
        maxDeltaE: 3,
      },
      {
        label: 'booking panel',
        x: 1500,
        y: 700,
        expected: [248, 241, 235],
        maxDeltaE: 3,
      },
      {
        label: 'map pin espresso fill',
        x: 835,
        y: 345,
        expected: [36, 15, 3],
        maxDeltaE: 3,
      },
      {
        label: 'map diagonal street field',
        x: 700,
        y: 300,
        expected: [240, 224, 209],
        maxDeltaE: 3,
      },
    ],
    requiredMedia: [
      media(
        'contact map documentary thumbnails',
        '[data-map-thumb]',
        [
          { x: 616, y: 174, width: 150, height: 100 },
          { x: 905, y: 174, width: 112, height: 105 },
          { x: 616, y: 466, width: 150, height: 100 },
          { x: 905, y: 466, width: 112, height: 100 },
        ],
        yandexDocumentaryProvenance,
        2,
      ),
      media(
        'contacts exterior',
        '[data-visual-media="contacts-exterior"]',
        [{ x: 1037, y: 164, width: 586, height: 412 }],
        yandexDocumentaryProvenance,
      ),
    ],
    functionalMap: {
      selector: '[data-visual-guide="contacts-map"]',
      hrefPattern: /^https:\/\/yandex\.ru\/maps\//,
      svgSelector: 'svg',
      pinSelector: '[data-map-pin]',
      geometrySelectors: [
        '[data-map-geometry="primary-route"]',
        '[data-map-geometry="cross-route"]',
      ],
    },
    geometryGuides: [
      headerGuide,
      sceneGuide('#contacts'),
      guide(
        'contacts editorial lead',
        '[data-visual-guide="contacts-copy"]',
        { x: 81, y: 165, width: 487, height: 400 },
      ),
      guide(
        'contacts media pair',
        '[data-visual-guide="contacts-media"]',
        { x: 606, y: 164, width: 1017, height: 413 },
      ),
      guide(
        'functional contact map',
        '[data-visual-guide="contacts-map"]',
        { x: 606, y: 164, width: 421, height: 412 },
        6,
      ),
      guide(
        'contact map pin',
        '[data-map-pin]',
        { x: 802, y: 278, width: 71, height: 82 },
        8,
      ),
      guide(
        'contact map primary route geometry',
        '[data-map-geometry="primary-route"]',
        { x: 638, y: 184, width: 352, height: 360 },
        24,
      ),
      guide(
        'contact map cross route geometry',
        '[data-map-geometry="cross-route"]',
        { x: 674, y: 250, width: 256, height: 284 },
        24,
      ),
      guide(
        'comfort feature panel',
        '[data-visual-guide="contacts-features"]',
        { x: 56, y: 595, width: 835, height: 194 },
      ),
      guide(
        'booking panel geometry',
        '[data-visual-guide="booking-panel"]',
        { x: 905, y: 595, width: 718, height: 194 },
      ),
    ],
  },
  {
    id: 'about',
    anchorUrl: '/#about',
    sceneSelector: '#about',
    readySelector: '#about[data-scene-ready="about"]',
    referenceFile: 'tests/references/04-about-1672x941.png',
    referenceSha256:
      'F4567E33E150747CD089AEC59E45D01B45CD502E0820771762F58863DD800437',
    viewport: REFERENCE_VIEWPORT,
    maxMismatchRatio: UI_MISMATCH_THRESHOLD,
    photoMasks: [
      roundedRectangle(753, 157, 864, 198, 19),
      roundedRectangle(850, 361, 767, 170, 19),
      roundedRectangle(753, 548, 374, 218, 19),
      roundedRectangle(1143, 548, 474, 218, 19),
    ],
    flatUiSamples: [
      {
        label: 'about paper background',
        x: 300,
        y: 600,
        expected: [252, 243, 226],
        maxDeltaE: 3,
      },
      {
        label: 'about feature card',
        x: 100,
        y: 700,
        expected: [249, 230, 207],
        maxDeltaE: 3,
      },
      {
        label: 'about quote panel',
        x: 1000,
        y: 830,
        expected: [246, 222, 194],
        maxDeltaE: 3,
      },
    ],
    requiredMedia: [
      media(
        'about media collage',
        '[data-visual-media="about-photo"]',
        [
          { x: 750, y: 154, width: 870, height: 380 },
          { x: 750, y: 545, width: 380, height: 224 },
          { x: 1140, y: 545, width: 480, height: 224 },
        ],
        yandexDocumentaryProvenance,
      ),
    ],
    geometryGuides: [
      headerGuide,
      sceneGuide('#about'),
      guide(
        'about editorial copy',
        '[data-visual-guide="about-copy"]',
        { x: 57, y: 174, width: 651, height: 425 },
      ),
      guide(
        'about media collage',
        '[data-visual-guide="about-gallery"]',
        { x: 750, y: 154, width: 870, height: 616 },
      ),
      guide(
        'about feature cards',
        '[data-visual-guide="about-features"]',
        { x: 52, y: 633, width: 656, height: 239 },
      ),
      guide(
        'about quote strip',
        '[data-visual-guide="about-quote"]',
        { x: 750, y: 784, width: 870, height: 85 },
      ),
    ],
  },
  {
    id: 'work',
    anchorUrl: '/#work',
    sceneSelector: '#work',
    readySelector: '#work[data-scene-ready="work"]',
    referenceFile: 'tests/references/05-work-1672x941.png',
    referenceSha256:
      '5D066A45EDC0391BD5451F81B934BC4D2D1334C75E017DB45A6AEB7B551B9FFC',
    viewport: REFERENCE_VIEWPORT,
    maxMismatchRatio: UI_MISMATCH_THRESHOLD,
    photoMasks: [
      roundedRectangle(674, 135, 601, 315, 19),
      roundedRectangle(1314, 253, 297, 196, 19),
      roundedRectangle(670, 603, 285, 148, 18),
      roundedRectangle(981, 603, 284, 148, 18),
      roundedRectangle(1315, 603, 295, 148, 18),
    ],
    flatUiSamples: [
      {
        label: 'work paper background',
        x: 400,
        y: 700,
        expected: [253, 244, 226],
        maxDeltaE: 3,
      },
      {
        label: 'dark work action',
        x: 250,
        y: 590,
        expected: [29, 13, 10],
        maxDeltaE: 3,
      },
      {
        label: 'work facts strip',
        x: 500,
        y: 850,
        expected: [254, 236, 212],
        maxDeltaE: 3,
      },
      {
        label: 'work feature card',
        x: 1100,
        y: 500,
        expected: [253, 247, 235],
        maxDeltaE: 3,
      },
    ],
    requiredMedia: [
      media(
        'work lead interior',
        '[data-visual-media="work-lead"]',
        [{ x: 671, y: 132, width: 607, height: 321 }],
        yandexDocumentaryProvenance,
      ),
      media(
        'work supporting media',
        '[data-visual-media="work-card"]',
        [
          { x: 1311, y: 250, width: 303, height: 202 },
          { x: 667, y: 600, width: 291, height: 154 },
          { x: 978, y: 600, width: 290, height: 154 },
          { x: 1312, y: 600, width: 301, height: 154 },
        ],
        yandexDocumentaryProvenance,
      ),
    ],
    geometryGuides: [
      headerGuide,
      sceneGuide('#work'),
      guide(
        'work editorial copy',
        '[data-visual-guide="work-copy"]',
        { x: 55, y: 193, width: 575, height: 433 },
      ),
      guide(
        'work media collage',
        '[data-visual-guide="work-gallery"]',
        { x: 654, y: 132, width: 973, height: 633 },
      ),
      guide(
        'work facts strip geometry',
        '[data-visual-guide="work-facts"]',
        { x: 47, y: 779, width: 856, height: 122 },
      ),
      guide(
        'work hours strip',
        '[data-visual-guide="work-hours"]',
        { x: 916, y: 779, width: 523, height: 122 },
      ),
    ],
  },
  {
    id: 'breakfasts',
    anchorUrl: '/#breakfasts',
    sceneSelector: '#breakfasts',
    readySelector: '#breakfasts[data-scene-ready="breakfasts"]',
    referenceFile: 'tests/references/06-breakfasts-1672x941.png',
    referenceSha256:
      '75276C90E23B00C8FB579CB6626A8AE82A1B32541085093AD66B9A569D12FD1D',
    viewport: REFERENCE_VIEWPORT,
    maxMismatchRatio: UI_MISMATCH_THRESHOLD,
    photoMasks: [
      roundedRectangle(102, 404, 342, 211, 17),
      roundedRectangle(476, 404, 342, 211, 17),
      roundedRectangle(850, 404, 342, 211, 17),
      roundedRectangle(1225, 404, 336, 211, 17),
    ],
    flatUiSamples: [
      {
        label: 'breakfast paper background',
        x: 50,
        y: 500,
        expected: [248, 225, 192],
        maxDeltaE: 3,
      },
      {
        label: 'breakfast card surface',
        x: 300,
        y: 700,
        expected: [253, 248, 241],
        maxDeltaE: 3,
      },
      {
        label: 'breakfast facts strip',
        x: 400,
        y: 880,
        expected: [252, 241, 226],
        maxDeltaE: 3,
      },
      {
        label: 'dark menu action',
        x: 1200,
        y: 850,
        expected: [37, 24, 19],
        maxDeltaE: 3,
      },
    ],
    requiredMedia: [
      media(
        'breakfast card media',
        '[data-visual-media="breakfast-card"]',
        [
          { x: 99, y: 401, width: 348, height: 217 },
          { x: 473, y: 401, width: 348, height: 217 },
          { x: 847, y: 401, width: 348, height: 217 },
          { x: 1222, y: 401, width: 342, height: 217 },
        ],
        yandexDocumentaryProvenance,
      ),
    ],
    geometryGuides: [
      headerGuide,
      sceneGuide('#breakfasts'),
      guide(
        'breakfast editorial heading',
        '[data-visual-guide="breakfast-heading"]',
        { x: 78, y: 174, width: 925, height: 191 },
      ),
      guide(
        'breakfast carousel',
        '[data-visual-guide="breakfast-carousel"]',
        { x: 99, y: 400, width: 1465, height: 376 },
      ),
      guide(
        'breakfast facts strip geometry',
        '[data-visual-guide="breakfast-facts"]',
        { x: 226, y: 817, width: 1219, height: 87 },
      ),
    ],
  },
] as const
