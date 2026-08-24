import { ArrowRight, CalendarDots, Coffee } from '@phosphor-icons/react'
import { useState } from 'react'

import { Scene } from '../components/Scene'
import { Reveal } from '../components/Reveal'
import { getMediaById } from '../content/mediaManifest'
import { siteContent, yandexOrganisationUrl } from '../content/site'
import type { SeasonalCategory } from '../types/content'

import '../styles/scenes/events.css'

type EventsFilter = 'all' | SeasonalCategory

const filters: readonly { id: EventsFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'seasonal', label: 'Сезонное' },
  { id: 'community', label: 'Для постоянных гостей' },
  { id: 'breakfasts', label: 'Каждый день' },
]

const mediaAltById = {
  'cold-drinks': 'Ряд цветных холодных напитков.',
  'marshmallow-drink': 'Напиток с маршмеллоу.',
  'big-breakfast': 'Большая тарелка с завтраком.',
} as const

export function EventsScene() {
  const [activeFilter, setActiveFilter] = useState<EventsFilter>('all')
  const visibleCards = siteContent.seasonalCards.filter(
    (card) => activeFilter === 'all' || card.category === activeFilter,
  )

  return (
    <Scene
      id="events"
      className="events-scene"
      aria-labelledby="events-title"
      data-scene-ready="events"
    >
      <div className="events-layout">
        <Reveal className="events-copy" data-visual-guide="events-copy">
          <p className="events-copy__eyebrow">Вкусные поводы зайти</p>
          <h2 id="events-title">
            <span>Сезонные</span>{' '}
            <span>поводы</span>{' '}
            <span>заглянуть</span>
          </h2>
          <p className="events-copy__description">
            Новинки в меню, встреча за кофе и знакомый ритуал завтрака — без
            выдуманных дат и обещаний.
          </p>
        </Reveal>

        <div className="events-main">
          <div
            className="event-filters-scroll"
            data-visual-guide="event-filters"
          >
            <div
              className="event-filters"
              role="group"
              aria-label="Фильтр поводов"
            >
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className="event-filter"
                  type="button"
                  aria-pressed={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <a
            className="events-all-link"
            href={yandexOrganisationUrl}
            target="_blank"
            rel="noreferrer"
          >
            Актуальная информация
            <span aria-hidden="true">
              <ArrowRight size={21} weight="bold" />
            </span>
          </a>

          <div
            className="event-card-list"
            data-visual-guide="event-cards"
            aria-live="polite"
          >
            {visibleCards.map((card, index) => {
              const media = getMediaById(card.mediaId)
              const alt = mediaAltById[card.mediaId]

              return (
                <article
                  key={card.id}
                  className="event-card"
                  aria-labelledby={`event-card-title-${card.id}`}
                  data-card-id={card.id}
                  data-category={card.category}
                  style={{ '--card-index': index } as React.CSSProperties}
                >
                  <figure
                    className="event-card__media"
                    data-visual-media="event-card"
                    data-media-kind={media.kind}
                    data-media-id={media.id}
                    data-media-source={media.sourceUrl}
                  >
                    <img
                      src={media.src}
                      alt={alt}
                      width={media.width}
                      height={media.height}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                    <span className="event-card__badge">{card.eyebrow}</span>
                  </figure>

                  <div className="event-card__body">
                    <p className="event-card__status">
                      <CalendarDots size={17} weight="bold" aria-hidden="true" />
                      Актуальность — по ссылке
                    </p>
                    <h3 id={`event-card-title-${card.id}`}>{card.title}</h3>
                    <p className="event-card__description">{card.description}</p>
                    <p className="event-card__note">
                      <span className="event-card__note-label">Проверка:</span>{' '}
                      <span>{card.verificationNote}</span>
                    </p>
                    <a
                      className="event-card__link"
                      href={card.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Подробнее: ${card.title}`}
                    >
                      Подробнее
                      <span aria-hidden="true">
                        <ArrowRight size={16} weight="bold" />
                      </span>
                    </a>
                  </div>
                </article>
              )
            })}
          </div>

          <aside className="events-banner" data-visual-guide="events-banner">
            <span className="events-banner__icon" aria-hidden="true">
              <Coffee size={25} weight="bold" />
            </span>
            <p>
              Перед визитом проверьте актуальные позиции и новости в карточке
              кофейни.
            </p>
            <a href={yandexOrganisationUrl} target="_blank" rel="noreferrer">
              Проверить
              <span aria-hidden="true">
                <ArrowRight size={18} weight="bold" />
              </span>
            </a>
          </aside>
        </div>
      </div>
    </Scene>
  )
}
