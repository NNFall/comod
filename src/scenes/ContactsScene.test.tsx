import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { ContactsScene } from './ContactsScene'

afterEach(cleanup)

describe('ContactsScene', () => {
  it('renders the verified contact facts and live external actions', () => {
    render(<ContactsScene />)

    const region = screen.getByRole('region', { name: 'Как нас найти' })
    expect(region).toHaveAttribute('id', 'contacts')
    expect(region).toHaveAttribute('data-scene-ready', 'contacts')
    expect(within(region).getByText('Галактионовская улица, 130')).toBeVisible()
    expect(
      region.querySelector('[data-visual-guide="contacts-copy"]'),
    ).toHaveAttribute('data-reveal-state')
    expect(within(region).getAllByRole('link', { name: /позвонить/iu })[0]).toHaveAttribute(
      'href',
      'tel:+79272655656',
    )
    expect(
      within(region).getByRole('link', { name: /^Проверить актуальные часы/ }),
    ).toHaveAttribute('href', 'https://yandex.ru/maps/org/komod/231221046215/')
  })

  it('exposes every visual guide and documentary provenance marker', () => {
    const { container } = render(<ContactsScene />)

    expect(container.querySelector('[data-visual-guide="contacts-copy"]')).not.toBeNull()
    expect(container.querySelector('[data-visual-guide="contacts-media"]')).not.toBeNull()
    expect(container.querySelector('[data-visual-guide="contacts-map"]')).not.toBeNull()
    expect(container.querySelector('[data-visual-guide="contacts-features"]')).not.toBeNull()
    expect(container.querySelector('[data-visual-guide="booking-panel"]')).not.toBeNull()

    const exterior = container.querySelector(
      '[data-visual-media="contacts-exterior"]',
    )
    expect(exterior).toHaveAttribute('data-media-id', 'exterior-wide')
    expect(exterior).toHaveAttribute('data-media-kind', 'documentary')
    expect(exterior).toHaveAttribute('data-documentary', 'true')
    expect(exterior).toHaveAttribute('data-media-source')
    expect(exterior).toHaveAttribute('width', '1280')
    expect(exterior).toHaveAttribute('height', '960')
    expect(exterior).toHaveAccessibleName(
      'Фасад кофейни «Комод» с панорамными окнами и уличной верандой',
    )
  })

  it('keeps safe comfort copy and an honest local booking helper', () => {
    render(<ContactsScene />)

    const featurePanel = screen.getByRole('group', {
      name: 'Что есть в Комоде',
    })
    expect(within(featurePanel).getAllByRole('listitem')).toHaveLength(5)
    expect(within(featurePanel).getByText('Летняя веранда*')).toBeVisible()
    expect(within(featurePanel).getByText('Можно с собакой*')).toBeVisible()
    expect(screen.getByRole('form', { name: 'Подготовить заявку' })).toBeVisible()
    expect(screen.queryByText(/бронь подтверждена|заявка отправлена/iu)).not.toBeInTheDocument()
    expect(document.querySelector('a[href*="whatsapp"]')).toBeNull()
  })
})
