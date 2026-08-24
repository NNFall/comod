import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import { siteContent } from '../content/site'
import { EventsScene } from './EventsScene'

const filterLabels = [
  'Все',
  'Сезонное',
  'Для постоянных гостей',
  'Каждый день',
] as const

afterEach(cleanup)

const stylesheet = readFileSync(
  resolve(process.cwd(), 'src/styles/scenes/events.css'),
  'utf8',
)

function contrastRatio(foreground: string, background: string) {
  const luminance = (hex: string) => {
    const channels = hex
      .slice(1)
      .match(/.{2}/gu)
      ?.map((channel) => Number.parseInt(channel, 16) / 255)
      .map((channel) =>
        channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4,
      )

    if (!channels || channels.length !== 3) throw new Error(`Bad hex: ${hex}`)
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
  }

  const lighter = Math.max(luminance(foreground), luminance(background))
  const darker = Math.min(luminance(foreground), luminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

function cssToken(name: string) {
  const match = stylesheet.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'iu'))
  if (!match) throw new Error(`Missing CSS token --${name}`)
  return match[1]
}

describe('EventsScene', () => {
  it('renders truthful source-ordered cards and the visual contract markers', () => {
    const { container } = render(<EventsScene />)

    const scene = screen.getByRole('region', { name: /поводы заглянуть/i })
    expect(scene).toHaveAttribute('id', 'events')
    expect(scene).toHaveAttribute('data-scene-ready', 'events')

    ;[
      'events-copy',
      'event-filters',
      'event-cards',
      'events-banner',
    ].forEach((guide) => {
      expect(
        container.querySelector(`[data-visual-guide="${guide}"]`),
      ).toBeInTheDocument()
    })
    expect(
      container.querySelector('[data-visual-guide="events-copy"]'),
    ).toHaveAttribute('data-reveal-state')

    const cards = within(scene).getAllByRole('article')
    expect(cards).toHaveLength(siteContent.seasonalCards.length)
    expect(
      cards.map((card) => within(card).getByRole('heading').textContent),
    ).toEqual(siteContent.seasonalCards.map((card) => card.title))
    cards.forEach((card, index) => {
      expect(card).toHaveAccessibleName(siteContent.seasonalCards[index].title)
    })
    expect(
      container.querySelectorAll('[data-visual-media="event-card"]'),
    ).toHaveLength(siteContent.seasonalCards.length)

    expect(scene).toHaveTextContent('Встретиться за кофе')
    cards.forEach((card, index) => {
      expect(
        within(card).getByText(
          siteContent.seasonalCards[index].verificationNote,
          { exact: true },
        ),
      ).toBeVisible()
    })

    const cardImages = container.querySelectorAll('[data-visual-media="event-card"] img')
    cardImages.forEach((image) => expect(image).toHaveAttribute('loading', 'lazy'))
  })

  it('locks accessible small-text colours, touch targets and scene specificity', () => {
    const colourPairs = [
      ['events-orange-copy', 'events-paper'],
      ['events-on-accent', 'events-active-filter'],
      ['events-on-accent', 'events-orange-accent'],
      ['events-on-accent', 'events-coral-accent'],
      ['events-on-accent', 'events-red-accent'],
      ['events-link', 'events-card'],
      ['events-status', 'events-card'],
    ] as const

    colourPairs.forEach(([foreground, background]) => {
      expect(
        contrastRatio(cssToken(foreground), cssToken(background)),
        `${foreground} on ${background}`,
      ).toBeGreaterThanOrEqual(4.5)
    })

    expect(stylesheet).toMatch(/^\.scene\.events-scene\s*\{/mu)
    expect(stylesheet).not.toMatch(/^\.events-scene(?=\s|:|\{)/mu)
    expect(stylesheet).toMatch(
      /\.events-all-link\s*\{[^}]*min-height:\s*2\.75rem;/su,
    )
    expect(stylesheet).toMatch(
      /\.event-card__link\s*\{[^}]*min-height:\s*2\.75rem;/su,
    )
    expect(stylesheet).toMatch(
      /\.event-filter\s*\{[^}]*height:\s*2\.9375rem;/su,
    )
  })

  it('uses native pressed buttons and filters cards without changing source order', async () => {
    const user = userEvent.setup()
    render(<EventsScene />)

    const filterGroup = screen.getByRole('group', { name: /фильтр поводов/i })
    const buttons = filterLabels.map((label) =>
      within(filterGroup).getByRole('button', { name: label }),
    )

    buttons.forEach((button, index) => {
      expect(button.tagName).toBe('BUTTON')
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveAttribute(
        'aria-pressed',
        index === 0 ? 'true' : 'false',
      )
    })

    await user.click(buttons[2])

    expect(buttons[0]).toHaveAttribute('aria-pressed', 'false')
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getAllByRole('article').map((card) => card.dataset.cardId),
    ).toEqual(
      siteContent.seasonalCards
        .filter((card) => card.category === 'community')
        .map((card) => card.id),
    )

    await user.click(buttons[0])

    expect(
      screen.getAllByRole('article').map((card) => card.dataset.cardId),
    ).toEqual(siteContent.seasonalCards.map((card) => card.id))
  })

  it.each([
    ['Сезонное', 'seasonal'],
    ['Для постоянных гостей', 'community'],
    ['Каждый день', 'breakfasts'],
  ] as const)(
    'keeps the shipped %s filter non-empty',
    async (label, category) => {
      const user = userEvent.setup()
      render(<EventsScene />)

      await user.click(screen.getByRole('button', { name: label }))

      const visibleCards = screen.getAllByRole('article')
      expect(visibleCards.length).toBeGreaterThan(0)
      expect(visibleCards.map((card) => card.dataset.category)).toEqual(
        siteContent.seasonalCards
          .filter((card) => card.category === category)
          .map((card) => card.category),
      )
    },
  )
})
