import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { siteContent } from '../content/site'
import { AboutScene } from './AboutScene'

afterEach(cleanup)

describe('AboutScene', () => {
  it('renders exactly four ordered factual or subjective feature blocks', () => {
    const { container } = render(<AboutScene />)
    const scene = screen.getByRole('region', {
      name: 'Место, которое хочется рассматривать',
    })

    expect(scene).toHaveAttribute('id', 'about')
    expect(scene).toHaveAttribute('data-scene-ready', 'about')
    expect(
      within(scene).getByRole('heading', {
        level: 2,
        name: 'Место, которое хочется рассматривать',
      }),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-visual-guide="about-copy"]'),
    ).toHaveAttribute('data-reveal-state')

    const features = Array.from(
      container.querySelectorAll<HTMLElement>('[data-about-feature]'),
    )
    expect(features).toHaveLength(4)
    expect(features.map((feature) => feature.dataset.featureId)).toEqual(
      siteContent.aboutFeatures.map((feature) => feature.id),
    )
    expect(
      features.map(
        (feature) =>
          within(feature).getByRole('heading', { level: 3 }).textContent,
      ),
    ).toEqual(siteContent.aboutFeatures.map((feature) => feature.title))

    for (const feature of features) {
      expect(feature.dataset.evidence).toMatch(
        /^(source-snapshot|editorial-observation)$/,
      )
    }
  })

  it('exposes every locked guide and three documentary provenance markers', () => {
    const { container } = render(<AboutScene />)

    for (const guide of [
      'about-copy',
      'about-gallery',
      'about-features',
      'about-quote',
    ]) {
      expect(
        container.querySelectorAll(`[data-visual-guide="${guide}"]`),
      ).toHaveLength(1)
    }

    const photos = container.querySelectorAll(
      '[data-visual-media="about-photo"]',
    )
    expect(photos).toHaveLength(3)

    for (const photo of photos) {
      expect(photo).toHaveAttribute('data-media-kind', 'documentary')
      expect(photo.getAttribute('data-media-id')).toBeTruthy()
      expect(photo.getAttribute('data-media-source')).toMatch(
        /^https:\/\/avatars\.mds\.yandex\.net\//,
      )
    }
  })
})
