import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { siteContent } from '../content/site'
import { BreakfastScene } from './BreakfastScene'

afterEach(cleanup)

describe('BreakfastScene', () => {
  it('renders the locked breakfast scene structure and four verified menu cards', () => {
    const { container } = render(<BreakfastScene />)
    const scene = container.querySelector('#breakfasts')

    expect(scene).toHaveAttribute('data-scene-ready', 'breakfasts')
    expect(
      container.querySelector('[data-visual-guide="breakfast-heading"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-visual-guide="breakfast-carousel"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-visual-guide="breakfast-facts"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-visual-guide="breakfast-heading"]'),
    ).toHaveAttribute('data-reveal-state')
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Завтраки, ради которых хочется заглянуть',
      }),
    ).toBeInTheDocument()

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(4)

    for (const item of siteContent.menu.items.slice(0, 4)) {
      const heading = screen.getByRole('heading', { level: 3, name: item.name })
      const card = heading.closest('article')

      expect(card).not.toBeNull()
      expect(
        within(card!).getByText(
          (text) => text.replace(/\s/g, '') === `${item.priceRub}₽`,
        ),
      ).toBeInTheDocument()
    }
  })

  it('uses four local documentary images with explicit provenance and truthful alt text', () => {
    const { container } = render(<BreakfastScene />)
    const media = Array.from(
      container.querySelectorAll<HTMLElement>(
        '[data-visual-media="breakfast-card"]',
      ),
    )

    expect(media).toHaveLength(4)
    expect(media.map((item) => item.dataset.mediaId)).toEqual([
      'waffle-berries',
      'marine-breakfast',
      'big-breakfast',
      'coffee-cup',
    ])

    const expectedAltText = [
      'Вафля с ягодами на светлой тарелке.',
      'Тарелка с завтраком и чашка кофе на столе.',
      'Большая тарелка с завтраком на деревянном столе.',
      'Крупный план чашки кофе.',
    ]

    media.forEach((item, index) => {
      expect(item).toHaveAttribute('data-media-kind', 'documentary')
      expect(item.dataset.mediaSource).toMatch(
        /^https:\/\/avatars\.mds\.yandex\.net\//,
      )
      const image = item.matches('img')
        ? item
        : within(item).getByRole('img')
      expect(image).toHaveAttribute('src', expect.stringMatching(/^\/media\/documentary\/originals\//))
      expect(image).toHaveAttribute('alt', expectedAltText[index])
      expect(image.getAttribute('alt')).not.toBe(siteContent.menu.items[index].name)
    })
  })

  it('shows the dated menu caveat and a source link without invented dietary claims', () => {
    render(<BreakfastScene />)

    expect(screen.getByText(siteContent.menu.caveat)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Проверить всё меню' }),
    ).toHaveAttribute('href', siteContent.menu.sourceUrl)
    expect(screen.queryByText(/веган|без глютена|диетическ/i)).not.toBeInTheDocument()
  })
})
