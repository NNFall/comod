import {
  Armchair,
  Coffee,
  Dog,
  MapPin,
  Phone,
  TreePalm,
  WifiHigh,
} from '@phosphor-icons/react'

import { BookingHelper } from '../components/BookingHelper'
import { Reveal } from '../components/Reveal'
import { Scene } from '../components/Scene'
import { SchematicMap } from '../components/SchematicMap'
import { getMediaById } from '../content/mediaManifest'
import { siteContent, yandexOrganisationUrl, yandexRouteUrl } from '../content/site'
import '../styles/scenes/contacts.css'

const comfortFeatures = [
  { label: 'Wi‑Fi', icon: WifiHigh },
  { label: 'Завтраки и кофе', icon: Coffee },
  { label: 'Живой интерьер', icon: Armchair },
  { label: 'Летняя веранда*', icon: TreePalm },
  { label: 'Можно с собакой*', icon: Dog },
] as const

export function ContactsScene() {
  const exterior = getMediaById('exterior-wide')

  return (
    <Scene
      id="contacts"
      className="contacts-scene"
      aria-labelledby="contacts-title"
      tone="light"
      data-scene-ready="contacts"
    >
      <div className="contacts-scene__top">
        <Reveal
          className="contacts-copy"
          data-visual-guide="contacts-copy"
        >
          <p className="contacts-copy__eyebrow">Контакты</p>
          <h2 id="contacts-title">Как нас найти</h2>
          <p className="contacts-copy__intro">
            Загляните за кофе, завтраком и тёплой паузой в центре Самары.
          </p>

          <address className="contacts-copy__facts">
            <a href={yandexRouteUrl} target="_blank" rel="noreferrer">
              <MapPin size={25} weight="regular" aria-hidden="true" />
              <span>
                <strong>{siteContent.identity.address}</strong>
                <small>{siteContent.identity.city} · открыть точный маршрут</small>
              </span>
            </a>
            <a href={siteContent.identity.phone.href}>
              <Phone size={25} weight="regular" aria-hidden="true" />
              <span>
                <strong>{siteContent.identity.phone.display}</strong>
                <small>Позвонить в Комод</small>
              </span>
            </a>
            <a href={yandexOrganisationUrl} target="_blank" rel="noreferrer">
              <span className="contacts-copy__source-mark" aria-hidden="true">
                i
              </span>
              <span>
                <strong>Проверить актуальные часы</strong>
                <small>В карточке кофейни на Яндекс Картах</small>
              </span>
            </a>
          </address>
        </Reveal>

        <div
          className="contacts-media"
          data-visual-guide="contacts-media"
        >
          <SchematicMap />
          <figure className="contacts-exterior">
            <img
              src={exterior.src}
              alt="Фасад кофейни «Комод» с панорамными окнами и уличной верандой"
              width={exterior.width}
              height={exterior.height}
              loading="lazy"
              decoding="async"
              data-visual-media="contacts-exterior"
              data-media-id={exterior.id}
              data-media-kind={exterior.kind}
              data-documentary={String(exterior.documentary)}
              data-media-source={exterior.sourceLabel}
            />
            <figcaption className="contacts-visually-hidden">
              Документальный кадр из публичной галереи Яндекс Карт; права на
              публикацию требуется подтвердить у владельца.
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="contacts-scene__lower">
        <div
          className="contacts-features"
          role="group"
          aria-label="Что есть в Комоде"
          aria-describedby="contacts-feature-note"
          data-visual-guide="contacts-features"
        >
          <h3>Для вашего комфорта</h3>
          <ul>
            {comfortFeatures.map(({ label, icon: Icon }) => (
              <li key={label}>
                <Icon size={31} weight="regular" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <p id="contacts-feature-note">
            * Снимок карточки от 24.08.2026 — условия лучше уточнить перед
            визитом.
          </p>
        </div>

        <div
          id="booking"
          className="contacts-booking"
          data-visual-guide="booking-panel"
        >
          <BookingHelper />
        </div>
      </div>

      <div className="contacts-closing" aria-hidden="true">
        <span>Любимый кофе. Рядом с вами.</span>
        <strong>Ждём вас в Комоде</strong>
      </div>
    </Scene>
  )
}
