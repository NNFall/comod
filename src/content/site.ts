import type { SiteContent } from '../types/content'
import type { MediaId } from './mediaManifest'

export const yandexOrganisationUrl =
  'https://yandex.ru/maps/org/komod/231221046215/'
export const yandexRouteUrl = 'https://yandex.ru/maps/-/CTwTI6~D'
export const contentVerificationDate = '2026-08-24'

const menuCaveat =
  'Снимок меню от 24.08.2026: наличие, состав и цену уточняйте перед визитом.'

export const siteContent = {
  navigation: [
    { href: '#breakfasts', label: 'Завтраки' },
    { href: '#work', label: 'Для работы' },
    { href: '#about', label: 'О Комоде' },
    { href: '#events', label: 'Поводы заглянуть' },
    { href: '#contacts', label: 'Контакты' },
  ],
  identity: {
    name: 'Комод',
    descriptor: 'Городская кофейня',
    city: 'Самара',
    address: 'Галактионовская улица, 130',
    phone: {
      display: '+7 (927) 265-56-56',
      e164: '+79272655656',
      href: 'tel:+79272655656',
    },
    verifiedOn: contentVerificationDate,
    sourceUrl: yandexOrganisationUrl,
  },
  hero: {
    eyebrow: 'Городская кофейня · Самара',
    title: 'Кофе, завтраки и уют',
    description:
      'Тёплый интерьер с характером и меню, ради которого приятно встретиться на Галактионовской, 130.',
    primaryAction: { href: '#booking', label: 'Подготовить заявку' },
    secondaryAction: { href: '#breakfasts', label: 'Смотреть завтраки' },
  },
  menu: {
    verifiedOn: contentVerificationDate,
    sourceUrl: yandexOrganisationUrl,
    caveat: menuCaveat,
    items: [
      {
        id: 'marine-breakfast',
        name: 'Большой Морской завтрак',
        priceRub: 1250,
        verifiedOn: contentVerificationDate,
        sourceUrl: yandexOrganisationUrl,
        caveat: menuCaveat,
      },
      {
        id: 'big-breakfast',
        name: 'Большой завтрак',
        priceRub: 1110,
        verifiedOn: contentVerificationDate,
        sourceUrl: yandexOrganisationUrl,
        caveat: menuCaveat,
      },
      {
        id: 'green-buckwheat-shrimp',
        name: 'Зелёная гречка с креветками',
        priceRub: 610,
        verifiedOn: contentVerificationDate,
        sourceUrl: yandexOrganisationUrl,
        caveat: menuCaveat,
      },
      {
        id: 'carbonara-scramble',
        name: 'Скрембл Карбонара',
        priceRub: 740,
        verifiedOn: contentVerificationDate,
        sourceUrl: yandexOrganisationUrl,
        caveat: menuCaveat,
      },
      {
        id: 'syrniki',
        name: 'Сырники с кокосовым кремом и вишнёвым конфи',
        priceRub: 490,
        verifiedOn: contentVerificationDate,
        sourceUrl: yandexOrganisationUrl,
        caveat: menuCaveat,
      },
    ],
  },
  workFeatures: [
    {
      id: 'wifi',
      title: 'Wi‑Fi',
      description: 'Можно ненадолго сменить привычный рабочий фон.',
      evidence: 'source-snapshot',
      sourceUrl: yandexOrganisationUrl,
    },
    {
      id: 'coffee-and-food',
      title: 'Кофе и еда рядом',
      description: 'Завтрак или чашка кофе помогают собрать встречу без спешки.',
      evidence: 'source-snapshot',
      sourceUrl: yandexOrganisationUrl,
    },
    {
      id: 'characterful-space',
      title: 'Живой интерьер',
      description: 'Насыщенные цвета и винтажные детали задают настроение.',
      evidence: 'editorial-observation',
    },
  ],
  aboutFeatures: [
    {
      id: 'vintage-details',
      title: 'Винтажные детали',
      description: 'Мебель, свет и декор хочется рассматривать по отдельности.',
      evidence: 'editorial-observation',
    },
    {
      id: 'bold-colour',
      title: 'Смелый цвет',
      description: 'Горчичный, красный и тёмное дерево собирают цельный образ.',
      evidence: 'editorial-observation',
    },
    {
      id: 'summer-veranda',
      title: 'Летняя веранда',
      description: 'Веранда отмечена в карточке кофейни; доступность лучше уточнить.',
      evidence: 'source-snapshot',
      sourceUrl: yandexOrganisationUrl,
    },
    {
      id: 'dog-friendly',
      title: 'Можно с собакой',
      description: 'В карточке указаны собаки до 35 см; правила стоит подтвердить перед визитом.',
      evidence: 'source-snapshot',
      sourceUrl: yandexOrganisationUrl,
    },
  ],
  seasonalCards: [
    {
      id: 'seasonal-menu',
      category: 'seasonal',
      eyebrow: 'Меню меняется',
      title: 'Сезонные сочетания',
      description:
        'Новинки появляются в меню — перед визитом загляните в актуальную карточку кофейни.',
      mediaId: 'cold-drinks',
      sourceUrl: yandexOrganisationUrl,
      verificationNote:
        'Основано на архивной новости 2025 года; не является заявлением о текущей акции.',
    },
    {
      id: 'meet-over-coffee',
      category: 'community',
      eyebrow: 'Вместе уютнее',
      title: 'Встретиться за кофе',
      description:
        'Небольшая встреча, разговор без спешки и яркий интерьер вокруг.',
      mediaId: 'marshmallow-drink',
      sourceUrl: yandexOrganisationUrl,
      verificationNote:
        'Редакционный сценарий посещения; это не событие, акция или программа лояльности.',
    },
    {
      id: 'breakfast-ritual',
      category: 'breakfasts',
      eyebrow: 'Знакомый ритуал',
      title: 'Завтраки в меню',
      description:
        'Большие завтраки, сырники и другие позиции из проверенного снимка меню.',
      mediaId: 'big-breakfast',
      sourceUrl: yandexOrganisationUrl,
      verificationNote: menuCaveat,
    },
  ],
  contactActions: [
    {
      kind: 'call',
      label: 'Позвонить в Комод',
      href: 'tel:+79272655656',
      external: false,
    },
    {
      kind: 'route',
      label: 'Построить маршрут',
      href: yandexRouteUrl,
      external: true,
    },
    {
      kind: 'source',
      label: 'Проверить актуальную информацию',
      href: yandexOrganisationUrl,
      external: true,
    },
  ],
} as const satisfies SiteContent<MediaId>
