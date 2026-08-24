import { ArrowUpRight } from '@phosphor-icons/react/ArrowUpRight'
import { Armchair } from '@phosphor-icons/react/Armchair'
import { Coffee } from '@phosphor-icons/react/Coffee'
import { CoffeeBean } from '@phosphor-icons/react/CoffeeBean'
import { Compass } from '@phosphor-icons/react/Compass'
import { WifiHigh } from '@phosphor-icons/react/WifiHigh'

import { Scene } from '../components/Scene'
import { Reveal } from '../components/Reveal'
import { getMediaById, type MediaId } from '../content/mediaManifest'
import { siteContent, yandexOrganisationUrl, yandexRouteUrl } from '../content/site'
import './styles/work-about.css'

type DocumentaryImageProps = {
  readonly mediaId: MediaId
  readonly alt: string
  readonly className: string
  readonly visualMarker: 'work-lead' | 'work-card'
}

function DocumentaryImage({
  mediaId,
  alt,
  className,
  visualMarker,
}: DocumentaryImageProps) {
  const media = getMediaById(mediaId)

  return (
    <img
      alt={alt}
      className={className}
      data-media-id={media.id}
      data-media-kind={media.kind}
      data-media-source={media.sourceUrl}
      data-visual-media={visualMarker}
      decoding="async"
      height={media.height}
      loading="lazy"
      src={media.src}
      width={media.width}
    />
  )
}

const workCards = [
  {
    feature: siteContent.workFeatures[0],
    mediaId: 'illuminated-cabinet' as const,
    alt: 'Подсвеченная буква и цветной комод в интерьере кофейни',
    icon: WifiHigh,
  },
  {
    feature: siteContent.workFeatures[1],
    mediaId: 'coffee-by-window' as const,
    alt: 'Чашка кофе у окна кофейни в зимний день',
    icon: Coffee,
  },
  {
    feature: siteContent.workFeatures[2],
    mediaId: 'fireplace-corner' as const,
    alt: 'Светлый уголок кофейни с декоративным камином и креслами',
    icon: Armchair,
  },
] as const

export function WorkScene() {
  return (
    <Scene
      aria-labelledby="work-title"
      className="work-scene editorial-scene"
      data-scene-ready="work"
      id="work"
      tone="light"
    >
      <div className="work-scene__canvas">
        <Reveal className="work-scene__copy" data-visual-guide="work-copy">
          <p className="editorial-scene__eyebrow">
            Городская кофейня · Самара
          </p>
          <h2 id="work-title">
            <span>Для работы,</span>{' '}
            <span>встреч</span>{' '}
            <span>и приятных пауз</span>
          </h2>
          <p className="work-scene__lead">
            Кофе, еда и живой интерьер — чтобы ненадолго сменить привычный
            рабочий фон или спокойно поговорить.
          </p>
          <a className="editorial-scene__primary-action" href={yandexRouteUrl}>
            <span>Построить маршрут</span>
            <ArrowUpRight aria-hidden="true" size={25} weight="bold" />
          </a>
        </Reveal>

        <span
          aria-hidden="true"
          className="editorial-scene__shape editorial-scene__shape--bean"
        >
          <CoffeeBean size={22} weight="fill" />
        </span>
        <span
          aria-hidden="true"
          className="editorial-scene__shape editorial-scene__shape--ring"
        />
        <span
          aria-hidden="true"
          className="editorial-scene__shape editorial-scene__shape--diamond"
        />
        <span aria-hidden="true" className="work-scene__line-art">
          <Coffee size={128} weight="thin" />
        </span>

        <div className="work-scene__gallery" data-visual-guide="work-gallery">
          <DocumentaryImage
            alt="Общий вид интерьера кофейни с горчичными диванами и стойкой"
            className="work-scene__lead-photo"
            mediaId="interior-wide"
            visualMarker="work-lead"
          />

          <article className="work-scene__side-card">
            <div className="work-scene__side-copy">
              <Compass aria-hidden="true" size={27} weight="duotone" />
              <div>
                <h3>Смена обстановки</h3>
                <p>Можно выбрать свой темп и сделать паузу.</p>
              </div>
            </div>
            <DocumentaryImage
              alt="Горчичное кресло и цветные интерьерные панели кофейни"
              className="work-scene__side-photo"
              mediaId="yellow-chair"
              visualMarker="work-card"
            />
          </article>

          {workCards.map(({ feature, mediaId, alt, icon: Icon }, index) => (
            <article
              className={`work-scene__feature-card work-scene__feature-card--${index + 1}`}
              data-evidence={feature.evidence}
              key={feature.id}
            >
              <div className="work-scene__feature-copy">
                <span aria-hidden="true" className="work-scene__feature-icon">
                  <Icon size={24} weight="duotone" />
                </span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
              <DocumentaryImage
                alt={alt}
                className="work-scene__feature-photo"
                mediaId={mediaId}
                visualMarker="work-card"
              />
            </article>
          ))}
        </div>

        <ul className="work-scene__facts" data-visual-guide="work-facts">
          <li>
            <WifiHigh aria-hidden="true" size={29} weight="duotone" />
            <span>Wi‑Fi отмечен в карточке кофейни</span>
          </li>
          <li>
            <Coffee aria-hidden="true" size={29} weight="duotone" />
            <span>Кофе и еда — в одном месте</span>
          </li>
          <li>
            <Armchair aria-hidden="true" size={29} weight="duotone" />
            <span>Интерьер с заметными деталями</span>
          </li>
          <li>
            <Compass aria-hidden="true" size={29} weight="duotone" />
            <span>Условия лучше уточнить заранее</span>
          </li>
        </ul>

        {/* The reference contains fixed opening hours. Those are volatile, so
            this panel preserves its visual mass while linking to a live check. */}
        <aside
          aria-label="Проверка перед визитом"
          className="work-scene__verification"
          data-visual-guide="work-hours"
        >
          <div>
            <p className="work-scene__verification-kicker">Перед визитом</p>
            <p>Расписание и условия могут меняться.</p>
          </div>
          <a href={yandexOrganisationUrl} rel="noreferrer" target="_blank">
            Проверить актуальные часы
            <ArrowUpRight aria-hidden="true" size={19} weight="bold" />
          </a>
        </aside>

        <span aria-hidden="true" className="work-scene__closing-dot" />
      </div>
    </Scene>
  )
}
