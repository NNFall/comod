import {
  ArrowUpRight,
  CalendarCheck,
  Coffee,
  SealCheck,
} from '@phosphor-icons/react'

import { Carousel } from '../components/Carousel'
import { MediaImage } from '../components/MediaImage'
import { Reveal } from '../components/Reveal'
import { Scene } from '../components/Scene'
import { getMediaById, type MediaId } from '../content/mediaManifest'
import { siteContent } from '../content/site'
import type { MenuItem } from '../types/content'
import '../styles/scenes/breakfast.css'

type BreakfastCard = {
  readonly item: MenuItem
  readonly mediaId: MediaId
  readonly alt: string
}

const breakfastCards: readonly BreakfastCard[] = [
  {
    item: siteContent.menu.items[0],
    mediaId: 'waffle-berries',
    alt: 'Вафля с ягодами на светлой тарелке.',
  },
  {
    item: siteContent.menu.items[1],
    mediaId: 'marine-breakfast',
    alt: 'Тарелка с завтраком и чашка кофе на столе.',
  },
  {
    item: siteContent.menu.items[2],
    mediaId: 'big-breakfast',
    alt: 'Большая тарелка с завтраком на деревянном столе.',
  },
  {
    item: siteContent.menu.items[3],
    mediaId: 'coffee-cup',
    alt: 'Крупный план чашки кофе.',
  },
] as const

const priceFormatter = new Intl.NumberFormat('ru-RU')

function DocumentaryImage({ id, alt }: { readonly id: MediaId; readonly alt: string }) {
  const media = getMediaById(id)

  if (media.kind !== 'documentary' || !media.sourceUrl) {
    throw new Error(`Breakfast media must be documentary: ${id}`)
  }

  return (
    <MediaImage
      className="breakfast-card__media"
      mediaId={id}
      alt={alt}
      loading="lazy"
      data-visual-media="breakfast-card"
    />
  )
}

function BreakfastCard({ card }: { readonly card: BreakfastCard }) {
  return (
    <article className="breakfast-card">
      <DocumentaryImage id={card.mediaId} alt={card.alt} />
      <div className="breakfast-card__body">
        <p className="breakfast-card__note">Позиция из снимка меню</p>
        <h3>{card.item.name}</h3>
        <p className="breakfast-card__price">
          <data value={card.item.priceRub}>
            {priceFormatter.format(card.item.priceRub)} ₽
          </data>
        </p>
      </div>
    </article>
  )
}

export function BreakfastScene() {
  return (
    <Scene
      id="breakfasts"
      className="breakfast-scene"
      aria-labelledby="breakfasts-title"
      data-scene-ready="breakfasts"
    >
      <Reveal
        id="menu"
        className="breakfast-scene__heading anchor-target"
        data-visual-guide="breakfast-heading"
      >
        <h2 id="breakfasts-title">
          <span>Завтраки, ради</span>{' '}
          <span>которых хочется заглянуть</span>
        </h2>
        <p>
          Проверенные позиции из снимка меню и живые кадры из галереи кофейни.
          Фотография рядом не обещает точную подачу блюда.
        </p>
      </Reveal>

      <MediaImage
        className="breakfast-scene__motifs"
        mediaId="motif-sheet-v1"
        alt=""
        aria-hidden="true"
      />

      <Carousel
        className="breakfast-carousel"
        label="Завтраки из меню Комода"
        viewportGuide="breakfast-carousel"
      >
        {breakfastCards.map((card) => (
          <BreakfastCard card={card} key={card.item.id} />
        ))}
      </Carousel>

      <div
        className="breakfast-facts"
        data-visual-guide="breakfast-facts"
      >
        <div className="breakfast-facts__item breakfast-facts__item--dated">
          <CalendarCheck aria-hidden="true" size={31} weight="regular" />
          <p>{siteContent.menu.caveat}</p>
        </div>
        <div className="breakfast-facts__item">
          <Coffee aria-hidden="true" size={32} weight="regular" />
          <p>
            <strong>{siteContent.menu.items.length} позиций</strong>
            проверено в источнике
          </p>
        </div>
        <div className="breakfast-facts__item breakfast-facts__item--source">
          <SealCheck aria-hidden="true" size={32} weight="regular" />
          <p>Цены и наличие лучше уточнить перед визитом</p>
        </div>
        <a
          className="breakfast-facts__action"
          href={siteContent.menu.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Проверить всё меню
          <ArrowUpRight aria-hidden="true" size={21} weight="bold" />
        </a>
      </div>
    </Scene>
  )
}
