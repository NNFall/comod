import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { MediaImage } from './MediaImage'

afterEach(cleanup)

describe('MediaImage', () => {
  it('renders the registered local file with immutable provenance metadata', () => {
    render(
      <MediaImage
        mediaId="exterior-wide"
        alt="Фасад кофейни Комод"
        loading="eager"
        fetchPriority="high"
      />,
    )

    const image = screen.getByRole('img', { name: 'Фасад кофейни Комод' })

    expect(image).toHaveAttribute(
      'src',
      '/media/documentary/originals/exterior-wide.webp',
    )
    expect(image).toHaveAttribute('width', '1280')
    expect(image).toHaveAttribute('height', '960')
    expect(image).toHaveAttribute('data-media-id', 'exterior-wide')
    expect(image).toHaveAttribute('data-media-kind', 'documentary')
    expect(image).toHaveAttribute(
      'data-media-source',
      expect.stringMatching(/^https:\/\/avatars\.mds\.yandex\.net\//),
    )
    expect(image).toHaveAttribute('data-media-documentary', 'true')
    expect(image).toHaveAttribute('data-media-rights', 'owner-approval-required')
    expect(image).toHaveAttribute('loading', 'eager')
    expect(image).toHaveAttribute('fetchpriority', 'high')
  })
})
