import { Armchair } from '@phosphor-icons/react/Armchair'
import { Dog } from '@phosphor-icons/react/Dog'
import { LampPendant } from '@phosphor-icons/react/LampPendant'
import { PaintBrush } from '@phosphor-icons/react/PaintBrush'
import { Quotes } from '@phosphor-icons/react/Quotes'
import { UmbrellaSimple } from '@phosphor-icons/react/UmbrellaSimple'

import { Scene } from '../components/Scene'
import { Reveal } from '../components/Reveal'
import { getMediaById, type MediaId } from '../content/mediaManifest'
import { siteContent } from '../content/site'
import './styles/work-about.css'

type AboutImageProps = {
  readonly mediaId: MediaId
  readonly alt: string
  readonly className: string
}

function AboutImage({
  mediaId,
  alt,
  className,
}: AboutImageProps) {
  const media = getMediaById(mediaId)

  return (
    <img
      alt={alt}
      className={className}
      data-media-id={media.id}
      data-media-kind={media.kind}
      data-media-source={media.sourceUrl}
      data-visual-media="about-photo"
      decoding="async"
      height={media.height}
      loading="lazy"
      src={media.src}
      width={media.width}
    />
  )
}

const featureIcons = {
  'vintage-details': LampPendant,
  'bold-colour': PaintBrush,
  'summer-veranda': UmbrellaSimple,
  'dog-friendly': Dog,
} as const

export function AboutScene() {
  return (
    <Scene
      aria-labelledby="about-title"
      className="about-scene editorial-scene"
      data-scene-ready="about"
      id="about"
      tone="cream"
    >
      <div className="about-scene__canvas">
        <Reveal className="about-scene__copy" data-visual-guide="about-copy">
          <p className="editorial-scene__eyebrow">О Комоде</p>
          <h2 id="about-title">
            <span>Место, которое</span>{' '}
            <span>хочется рассматривать</span>
          </h2>
          <span aria-hidden="true" className="about-scene__rule" />
          <p>
            Комод — городская кофейня с выразительным интерьером. Цвет, свет и
            винтажные предметы собирают пространство с характером.
          </p>
          <p>
            Сюда можно заглянуть за кофе и едой, встретиться или просто сменить
            обстановку на Галактионовской, 130.
          </p>
          <p className="about-scene__emphasis">
            Здесь настроение рождается из деталей.
          </p>
        </Reveal>

        <span aria-hidden="true" className="about-scene__accent about-scene__accent--bean">
          <span />
        </span>
        <span aria-hidden="true" className="about-scene__accent about-scene__accent--square" />

        <div className="about-scene__gallery" data-visual-guide="about-gallery">
          <AboutImage
            alt="Общий вид интерьера кофейни с диванами, светильниками и стойкой"
            className="about-scene__photo about-scene__photo--lead"
            mediaId="interior-wide"
          />
          <AboutImage
            alt="Светлый уголок кофейни с декоративным камином и клетчатым полом"
            className="about-scene__photo about-scene__photo--small"
            mediaId="fireplace-corner"
          />
          <AboutImage
            alt="Золотое фигурное зеркало на стене с узорной плиткой"
            className="about-scene__photo about-scene__photo--wide"
            mediaId="ornate-mirror"
          />
        </div>

        <div className="about-scene__features" data-visual-guide="about-features">
          {siteContent.aboutFeatures.map((feature) => {
            const Icon = featureIcons[feature.id]

            return (
              <article
                className="about-scene__feature"
                data-about-feature=""
                data-evidence={feature.evidence}
                data-feature-id={feature.id}
                key={feature.id}
              >
                <Icon aria-hidden="true" size={35} weight="duotone" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            )
          })}
        </div>

        <blockquote className="about-scene__quote" data-visual-guide="about-quote">
          <Quotes aria-hidden="true" size={36} weight="fill" />
          <p>
            Интерьер складывается из мелочей, которые хочется замечать не
            спеша.
          </p>
          <cite>Редакционное наблюдение по фотографиям</cite>
        </blockquote>

        <span aria-hidden="true" className="about-scene__corner-mark">
          <Armchair size={35} weight="duotone" />
        </span>
      </div>
    </Scene>
  )
}
