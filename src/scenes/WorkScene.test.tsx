import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { WorkScene } from './WorkScene'

afterEach(cleanup)

describe('WorkScene', () => {
  it('keeps the reference composition truthful and source-marked', () => {
    const { container } = render(<WorkScene />)
    const scene = screen.getByRole('region', {
      name: 'Для работы, встреч и приятных пауз',
    })

    expect(scene).toHaveAttribute('id', 'work')
    expect(scene).toHaveAttribute('data-scene-ready', 'work')
    expect(
      within(scene).getByRole('heading', {
        level: 2,
        name: 'Для работы, встреч и приятных пауз',
      }),
    ).toBeInTheDocument()

    for (const guide of [
      'work-copy',
      'work-gallery',
      'work-facts',
      'work-hours',
    ]) {
      expect(
        container.querySelectorAll(`[data-visual-guide="${guide}"]`),
      ).toHaveLength(1)
    }
    expect(
      container.querySelector('[data-visual-guide="work-copy"]'),
    ).toHaveAttribute('data-reveal-state')

    expect(
      container.querySelectorAll('[data-visual-media="work-lead"]'),
    ).toHaveLength(1)
    expect(
      container.querySelectorAll('[data-visual-media="work-card"]'),
    ).toHaveLength(4)

    const documentaryMedia = container.querySelectorAll(
      '[data-visual-media="work-lead"], [data-visual-media="work-card"]',
    )

    for (const media of documentaryMedia) {
      expect(media).toHaveAttribute('data-media-kind', 'documentary')
      expect(media.getAttribute('data-media-id')).toBeTruthy()
      expect(media.getAttribute('data-media-source')).toMatch(
        /^https:\/\/avatars\.mds\.yandex\.net\//,
      )
    }
  })

  it('does not promise outlets, guaranteed seating, events, or opening hours', () => {
    const { container } = render(<WorkScene />)
    const scene = container.querySelector<HTMLElement>('#work')

    expect(scene).not.toBeNull()
    if (!scene) return

    const copy = scene.textContent ?? ''

    expect(copy).not.toMatch(/розетк/iu)
    expect(copy).not.toMatch(/гарантирован|всегда есть места|место гарантирован/iu)
    expect(copy).not.toMatch(/мероприят|событи/iu)
    expect(copy).not.toMatch(/\b(?:0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]\b/u)

    const verification = within(scene).getByRole('complementary', {
      name: 'Проверка перед визитом',
    })
    expect(
      within(verification).getByRole('link', {
        name: 'Проверить актуальные часы',
      }),
    ).toHaveAttribute(
      'href',
      'https://yandex.ru/maps/org/komod/231221046215/',
    )
  })
})
