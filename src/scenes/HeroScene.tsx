import {
  ArrowRight,
  Coffee,
  Receipt,
  WifiHigh,
} from '@phosphor-icons/react'

import { MediaImage } from '../components/MediaImage'
import { Reveal } from '../components/Reveal'
import { siteContent } from '../content/site'
import '../styles/scenes/hero.css'

export function HeroScene() {
  return (
    <section
      id="home"
      className="scene hero-scene"
      aria-labelledby="hero-title"
      data-scene=""
      data-scene-ready="hero"
      data-tone="orange"
    >
      <div
        className="hero-scene__media-boundary"
        data-visual-guide="hero-media-boundary"
      >
        <MediaImage
          className="hero-scene__facade"
          mediaId="exterior-wide"
          alt="Фасад кофейни Комод на Галактионовской улице"
          loading="eager"
          fetchPriority="high"
          data-visual-media="hero-facade"
        />
      </div>

      <Reveal className="hero-scene__copy" data-visual-guide="hero-copy">
        <p className="hero-scene__eyebrow">{siteContent.hero.eyebrow}</p>
        <h1 id="hero-title" className="hero-scene__title">
          <span className="hero-scene__visually-hidden">Комод: </span>
          <span className="hero-scene__title-line">Кофе,</span>
          <span className="hero-scene__title-line">завтраки</span>
          <span className="hero-scene__title-line">и уют</span>
        </h1>
        <p className="hero-scene__accent">В одном месте</p>
        <p className="hero-scene__description">
          {siteContent.hero.description}
        </p>
      </Reveal>

      <a
        className="hero-scene__cta"
        href={siteContent.hero.primaryAction.href}
        data-visual-guide="hero-cta"
      >
        <span>{siteContent.hero.primaryAction.label}</span>
        <span className="hero-scene__cta-icon" aria-hidden="true">
          <ArrowRight size={24} weight="bold" />
        </span>
      </a>

      <nav
        className="hero-scene__facts"
        aria-label="Быстрые ссылки о кофейне"
        data-testid="hero-facts"
        data-visual-guide="hero-facts"
      >
        <a className="hero-scene__fact" href="#breakfasts">
          <Coffee aria-hidden="true" size={30} weight="regular" />
          <span>
            <strong>Завтраки</strong>
            <small>из снимка меню</small>
          </span>
        </a>
        <a
          className="hero-scene__fact"
          href={siteContent.menu.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Receipt aria-hidden="true" size={30} weight="regular" />
          <span>
            <strong>Снимок меню</strong>
            <small>от 24.08.2026</small>
          </span>
        </a>
        <a className="hero-scene__fact" href="#work">
          <WifiHigh aria-hidden="true" size={30} weight="regular" />
          <span>
            <strong>Для работы</strong>
            <small>Wi-Fi отмечен</small>
          </span>
        </a>
      </nav>

      <MediaImage
        className="hero-scene__cutout hero-scene__cutout--waffle"
        mediaId="waffle-berries"
        alt="Вафля с ягодами на тарелке"
        loading="eager"
        data-visual-media="hero-cutout"
      />
      <MediaImage
        className="hero-scene__cutout hero-scene__cutout--coffee"
        mediaId="coffee-cup"
        alt="Чашка кофе с рисунком на пене"
        loading="eager"
        data-visual-media="hero-cutout"
      />

      <svg
        className="hero-scene__doodle hero-scene__doodle--press"
        viewBox="0 0 190 205"
        fill="none"
        aria-hidden="true"
        focusable="false"
        data-hero-decoration=""
      >
        <path d="M54 53h82l-9 119H63L54 53Z" />
        <path d="M43 52h104M74 53v119M117 53v119M65 34h61l8 18H57l8-18Z" />
        <path d="M94 9v25M76 9h36M93 9h1M136 74c31 7 35 26 11 44" />
        <path d="M63 151c17-10 47-10 64 0" />
      </svg>
      <svg
        className="hero-scene__doodle hero-scene__doodle--orbit"
        viewBox="0 0 150 150"
        fill="none"
        aria-hidden="true"
        focusable="false"
        data-hero-decoration=""
      >
        <circle cx="75" cy="75" r="48" />
        <circle cx="75" cy="75" r="60" />
        <path d="M52 88c12 4 39-5 45-28 6 20-2 40-26 44-10 2-17-3-19-16Z" />
        <path d="m122 35 18-8 7 17-18 8M22 115 7 130" />
      </svg>
      <span
        className="hero-scene__doodle hero-scene__doodle--diamond"
        aria-hidden="true"
        data-hero-decoration=""
      />
      <span
        className="hero-scene__doodle hero-scene__doodle--bean"
        aria-hidden="true"
        data-hero-decoration=""
      />
    </section>
  )
}
