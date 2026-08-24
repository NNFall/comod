import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { siteContent } from '../content/site'
import { HeroScene } from './HeroScene'

afterEach(cleanup)

describe('HeroScene', () => {
  it('announces one truthful Komod heading and exposes the deterministic scene marker', () => {
    const { container } = render(<HeroScene />)

    const scene = screen.getByRole('region', { name: /комод.*кофе/i })
    expect(scene).toHaveAttribute('id', 'home')
    expect(scene).toHaveAttribute('data-scene-ready', 'hero')
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /комод.*кофе.*завтраки.*уют/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(siteContent.hero.description)).toBeInTheDocument()
    expect(
      container.querySelector('[data-visual-guide="hero-copy"]'),
    ).toHaveAttribute('data-reveal-state')
  })

  it('links the primary action to booking and offers three useful fact routes', () => {
    render(<HeroScene />)

    expect(
      screen.getByRole('link', { name: siteContent.hero.primaryAction.label }),
    ).toHaveAttribute('href', '#booking')

    const facts = screen.getByTestId('hero-facts')
    const factLinks = within(facts).getAllByRole('link')
    expect(factLinks).toHaveLength(3)
    expect(factLinks.map((link) => link.getAttribute('href'))).toEqual([
      '#breakfasts',
      siteContent.menu.sourceUrl,
      '#work',
    ])
  })

  it('uses a high-priority documentary facade and documentary-only cutouts', () => {
    const { container } = render(<HeroScene />)

    const facade = container.querySelector(
      '[data-visual-media="hero-facade"]',
    )
    expect(facade).toHaveAttribute('loading', 'eager')
    expect(facade).toHaveAttribute('fetchpriority', 'high')
    expect(facade).toHaveAttribute('data-media-kind', 'documentary')
    expect(facade).toHaveAttribute(
      'data-media-source',
      expect.stringMatching(/^https:\/\/avatars\.mds\.yandex\.net\//),
    )

    const cutouts = container.querySelectorAll(
      '[data-visual-media="hero-cutout"]',
    )
    expect(cutouts).toHaveLength(2)
    cutouts.forEach((cutout) => {
      expect(cutout).toHaveAttribute('data-media-kind', 'documentary')
      expect(cutout).toHaveAttribute('data-media-documentary', 'true')
      expect(cutout).toHaveAttribute(
        'data-media-source',
        expect.stringMatching(/^https:\/\/avatars\.mds\.yandex\.net\//),
      )
    })
  })

  it('keeps every purely decorative mark out of the accessibility tree', () => {
    const { container } = render(<HeroScene />)

    const decorations = container.querySelectorAll('[data-hero-decoration]')
    expect(decorations.length).toBeGreaterThan(0)
    decorations.forEach((decoration) => {
      expect(decoration).toHaveAttribute('aria-hidden', 'true')
    })
  })
})
