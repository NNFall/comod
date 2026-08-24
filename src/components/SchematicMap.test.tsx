import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { SchematicMap } from './SchematicMap'

afterEach(cleanup)

describe('SchematicMap', () => {
  it('labels itself as a schematic and links the entire map to live Yandex routing', () => {
    const { container } = render(<SchematicMap />)

    expect(
      screen.getByRole('link', {
        name: 'Схематическая карта к Комоду. Открыть точный маршрут в Яндекс Картах',
      }),
    ).toHaveAttribute('href', 'https://yandex.ru/maps/-/CTwTI6~D')
    expect(screen.getByText('Схема · точный маршрут в Яндекс Картах')).toBeVisible()
    expect(container.querySelector('svg')).not.toBeNull()
    expect(container.querySelector('[data-map-pin]')).not.toBeNull()
    expect(
      container.querySelector('[data-map-geometry="primary-route"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('[data-map-geometry="cross-route"]'),
    ).not.toBeNull()
    expect(container.querySelector('[data-map-route="primary"]')).not.toBeNull()
    expect(container.querySelector('[data-map-route="cross"]')).not.toBeNull()
  })

  it('keeps street names and documentary thumbnails outside the purely decorative contract', () => {
    const { container } = render(<SchematicMap />)

    expect(screen.getByText('Галактионовская')).toBeInTheDocument()
    expect(screen.getByText('Красноармейская')).toBeInTheDocument()
    expect(screen.getByText('Вилоновская')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-map-thumb]')).toHaveLength(4)
    container.querySelectorAll('[data-map-thumb]').forEach((thumbnail) => {
      expect(thumbnail).toHaveAttribute('data-media-kind', 'documentary')
      expect(thumbnail).toHaveAttribute('data-documentary', 'true')
      expect(thumbnail).toHaveAttribute('data-media-id')
      expect(Number(thumbnail.getAttribute('width'))).toBeGreaterThan(0)
      expect(Number(thumbnail.getAttribute('height'))).toBeGreaterThan(0)
    })
  })
})
