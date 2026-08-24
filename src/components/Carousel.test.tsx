import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Carousel } from './Carousel'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function installReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() =>
      ({
        matches,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
      }) satisfies MediaQueryList,
    ),
  )
}

function renderCarousel() {
  return render(
    <Carousel label="Завтраки">
      <article>Первый завтрак</article>
      <article>Второй завтрак</article>
      <article>Третий завтрак</article>
    </Carousel>,
  )
}

function configureViewport({
  clientWidth = 300,
  scrollWidth = 900,
  slideOffsets = [0, 300, 600],
}: {
  readonly clientWidth?: number
  readonly scrollWidth?: number
  readonly slideOffsets?: readonly number[]
} = {}) {
  const carousel = screen.getByRole('region', { name: 'Завтраки' })
  const viewport = carousel.querySelector<HTMLElement>(
    '[data-carousel-viewport]',
  )!
  const slides = Array.from(
    carousel.querySelectorAll<HTMLElement>('[data-carousel-slide]'),
  )

  Object.defineProperties(viewport, {
    clientWidth: { configurable: true, value: clientWidth },
    scrollWidth: { configurable: true, value: scrollWidth },
  })
  slides.forEach((slide, index) => {
    Object.defineProperty(slide, 'offsetLeft', {
      configurable: true,
      value: slideOffsets[index],
    })
  })

  const scrollTo = vi.fn((options: ScrollToOptions) => {
    viewport.scrollLeft = Number(options.left ?? viewport.scrollLeft)
    fireEvent.scroll(viewport)
  })
  Object.defineProperty(viewport, 'scrollTo', {
    configurable: true,
    value: scrollTo,
  })
  fireEvent(window, new Event('resize'))

  return { carousel, scrollTo, slides, viewport }
}

describe('Carousel', () => {
  it('announces the active card and keeps controls within hard bounds', async () => {
    const user = userEvent.setup()
    renderCarousel()
    configureViewport()

    const previous = screen.getByRole('button', { name: 'Предыдущая карточка' })
    const next = screen.getByRole('button', { name: 'Следующая карточка' })
    const status = screen.getByRole('status')

    await waitFor(() => expect(previous).toBeDisabled())
    expect(next).toBeEnabled()
    expect(status).toHaveTextContent('Карточка 1 из 3')

    await user.click(next)
    await user.click(next)

    expect(status).toHaveTextContent('Карточка 3 из 3')
    expect(previous).toBeEnabled()
    expect(next).toBeDisabled()

    await user.click(next)
    expect(status).toHaveTextContent('Карточка 3 из 3')
  })

  it('disables both controls and keeps the first announcement when the track does not overflow', async () => {
    const user = userEvent.setup()
    renderCarousel()
    configureViewport({ clientWidth: 900, scrollWidth: 900 })

    const previous = screen.getByRole('button', { name: 'Предыдущая карточка' })
    const next = screen.getByRole('button', { name: 'Следующая карточка' })

    await waitFor(() => expect(next).toBeDisabled())
    expect(previous).toBeDisabled()
    await user.click(next)
    expect(screen.getByRole('status')).toHaveTextContent('Карточка 1 из 3')
  })

  it('supports ArrowLeft and ArrowRight from the named carousel region', async () => {
    const user = userEvent.setup()
    renderCarousel()
    configureViewport()

    const carousel = screen.getByRole('region', { name: 'Завтраки' })
    const viewport = carousel.querySelector<HTMLElement>(
      '[data-carousel-viewport]',
    )
    expect(viewport).toHaveAttribute('tabindex', '0')
    viewport!.focus()

    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowLeft}')

    expect(screen.getByRole('status')).toHaveTextContent('Карточка 2 из 3')
    expect(viewport).toHaveFocus()
  })

  it('syncs the announcement and button bounds from native scrolling', async () => {
    renderCarousel()
    const { viewport } = configureViewport()

    viewport.scrollLeft = 302
    fireEvent.scroll(viewport)
    expect(screen.getByRole('status')).toHaveTextContent('Карточка 2 из 3')
    expect(
      screen.getByRole('button', { name: 'Предыдущая карточка' }),
    ).toBeEnabled()

    viewport.scrollLeft = 600
    fireEvent.scroll(viewport)
    expect(screen.getByRole('status')).toHaveTextContent('Карточка 3 из 3')
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Следующая карточка' }),
      ).toBeDisabled(),
    )
  })

  it('clamps button scrolling to the real end and respects reduced motion', async () => {
    const user = userEvent.setup()
    installReducedMotion(true)
    renderCarousel()
    const { scrollTo } = configureViewport({
      clientWidth: 300,
      scrollWidth: 750,
      slideOffsets: [0, 300, 600],
    })

    await user.click(screen.getByRole('button', { name: 'Следующая карточка' }))
    await user.click(screen.getByRole('button', { name: 'Следующая карточка' }))

    expect(scrollTo).toHaveBeenLastCalledWith({ left: 450, behavior: 'auto' })
  })

  it('uses smooth programmatic scrolling when motion is allowed', async () => {
    const user = userEvent.setup()
    installReducedMotion(false)
    renderCarousel()
    const { scrollTo } = configureViewport()

    await user.click(screen.getByRole('button', { name: 'Следующая карточка' }))

    expect(scrollTo).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' })
  })

  it('exposes an ordered, focusable native scroll track', () => {
    renderCarousel()

    const carousel = screen.getByRole('region', { name: 'Завтраки' })
    const viewport = carousel.querySelector('[data-carousel-viewport]')
    const slides = carousel.querySelectorAll('[data-carousel-slide]')

    expect(viewport).toHaveAttribute('tabindex', '0')
    expect(slides).toHaveLength(3)
    expect(Array.from(slides).map((slide) => slide.getAttribute('aria-label'))).toEqual([
      '1 из 3',
      '2 из 3',
      '3 из 3',
    ])
  })
})
