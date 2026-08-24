import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Reveal } from './Reveal'
import { SiteHeader } from './SiteHeader'

class FakeIntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]
  readonly observed = new Set<Element>()
  readonly observe = vi.fn((target: Element) => this.observed.add(target))
  readonly unobserve = vi.fn((target: Element) => this.observed.delete(target))
  readonly disconnect = vi.fn(() => this.observed.clear())
  readonly takeRecords = vi.fn(() => [] as IntersectionObserverEntry[])

  constructor(private readonly callback: IntersectionObserverCallback) {
    intersectionObservers.push(this)
  }

  trigger(target: Element, intersectionRatio = 1) {
    const entry = {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio,
      intersectionRect: target.getBoundingClientRect(),
      isIntersecting: intersectionRatio > 0,
      rootBounds: null,
      target,
      time: performance.now(),
    } satisfies IntersectionObserverEntry

    this.callback([entry], this as unknown as IntersectionObserver)
  }
}

let intersectionObservers: FakeIntersectionObserver[] = []

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const desktopHeaderQuery = '(min-width: 74.0625rem)'

function createControlledMediaQuery(query: string, initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<EventListenerOrEventListenerObject>()
  const mediaQuery = {
    get matches() {
      return matches
    },
    media: query,
    onchange: null,
    addEventListener: vi.fn(
      (event: string, listener: EventListenerOrEventListenerObject) => {
        if (event === 'change') listeners.add(listener)
      },
    ),
    removeEventListener: vi.fn(
      (event: string, listener: EventListenerOrEventListenerObject) => {
        if (event === 'change') listeners.delete(listener)
      },
    ),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  } as unknown as MediaQueryList

  return {
    mediaQuery,
    setMatches(nextMatches: boolean) {
      matches = nextMatches
      const event = { matches, media: query } as MediaQueryListEvent
      listeners.forEach((listener) => {
        if (typeof listener === 'function') listener.call(mediaQuery, event)
        else listener.handleEvent(event)
      })
    },
  }
}

function installMatchMedia(reducedMotion: boolean) {
  const queries = new Map<
    string,
    ReturnType<typeof createControlledMediaQuery>
  >()
  const getQuery = (query: string) => {
    const existing = queries.get(query)
    if (existing) return existing
    const created = createControlledMediaQuery(
      query,
      query === reducedMotionQuery ? reducedMotion : false,
    )
    queries.set(query, created)
    return created
  }

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => getQuery(query).mediaQuery),
  )
  return {
    setMatches(query: string, matches: boolean) {
      getQuery(query).setMatches(matches)
    },
  }
}

function renderHeaderWithSections() {
  return render(
    <>
      <SiteHeader />
      <main>
        <section id="home" aria-label="Главная" />
        <section id="breakfasts" aria-label="Завтраки">
          <div id="menu" />
        </section>
        <section id="work" aria-label="Для работы" />
        <section id="about" aria-label="О Комоде" />
        <section id="events" aria-label="Поводы заглянуть" />
        <section id="contacts" aria-label="Контакты" />
      </main>
    </>,
  )
}

beforeEach(() => {
  intersectionObservers = []
  vi.stubGlobal(
    'IntersectionObserver',
    FakeIntersectionObserver as unknown as typeof IntersectionObserver,
  )
  installMatchMedia(false)
})

afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('SiteHeader', () => {
  it('renders the verified anchor order and named header actions', () => {
    renderHeaderWithSections()

    const navigation = screen.getByRole('navigation', {
      name: 'Основная навигация',
    })
    const links = within(navigation).getAllByRole('link')

    expect(links.map((link) => link.textContent)).toEqual([
      'Меню',
      'Завтраки',
      'Для работы',
      'О нас',
      'События',
      'Контакты',
    ])
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#menu',
      '#breakfasts',
      '#work',
      '#about',
      '#events',
      '#contacts',
    ])
    expect(screen.getByRole('link', { name: 'Комод, на главную' })).toHaveAttribute(
      'href',
      '#home',
    )
    expect(
      screen.getByRole('link', { name: 'Подготовить заявку' }),
    ).toHaveAttribute('href', '#booking')
    expect(screen.getByRole('button', { name: 'Открыть меню' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )

    for (const target of screen.getAllByRole('link')) {
      expect(target).toHaveAccessibleName()
    }
  })

  it('marks the section selected by IntersectionObserver without a scroll listener', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener')
    renderHeaderWithSections()

    const workSection = document.getElementById('work')
    expect(workSection).not.toBeNull()
    expect(intersectionObservers).toHaveLength(1)

    act(() => intersectionObservers[0].trigger(workSection!))

    expect(
      within(
        screen.getByRole('navigation', { name: 'Основная навигация' }),
      ).getByRole('link', { name: 'Для работы' }),
    ).toHaveAttribute('aria-current', 'location')
    expect(intersectionObservers).toHaveLength(1)
    expect(addEventListener).not.toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.anything(),
    )
  })

  it('opens the mobile disclosure, moves focus inside and restores focus on Escape', async () => {
    const user = userEvent.setup()
    const focus = vi.spyOn(HTMLElement.prototype, 'focus')
    document.body.style.overflow = 'clip'
    renderHeaderWithSections()

    const menuButton = screen.getByRole('button', { name: 'Открыть меню' })
    await user.click(menuButton)

    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(menuButton).toHaveAccessibleName('Закрыть меню')
    const mobileNavigation = screen.getByRole('navigation', {
      name: 'Мобильная навигация',
    })
    expect(document.body.style.overflow).toBe('clip')
    await waitFor(() =>
      expect(within(mobileNavigation).getAllByRole('link')[0]).toHaveFocus(),
    )
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    focus.mockClear()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('navigation', { name: 'Мобильная навигация' })).not.toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveFocus()
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(document.body.style.overflow).toBe('clip')
  })

  it('closes and restores scrolling when the viewport crosses the desktop breakpoint', async () => {
    const user = userEvent.setup()
    const media = installMatchMedia(false)
    document.body.style.overflow = 'clip'
    renderHeaderWithSections()

    await user.click(screen.getByRole('button', { name: 'Открыть меню' }))
    expect(document.body.style.overflow).toBe('clip')

    act(() => media.setMatches(desktopHeaderQuery, true))

    await waitFor(() =>
      expect(
        screen.queryByRole('navigation', { name: 'Мобильная навигация' }),
      ).not.toBeInTheDocument(),
    )
    expect(document.body.style.overflow).toBe('clip')
    expect(
      screen.getByRole('button', { name: 'Открыть меню' }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes after choosing a mobile anchor and restores body scrolling', async () => {
    const user = userEvent.setup()
    renderHeaderWithSections()

    await user.click(screen.getByRole('button', { name: 'Открыть меню' }))
    const mobileNavigation = screen.getByRole('navigation', {
      name: 'Мобильная навигация',
    })
    await user.click(within(mobileNavigation).getByRole('link', { name: 'Контакты' }))

    expect(screen.queryByRole('navigation', { name: 'Мобильная навигация' })).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })

  it('keeps keyboard focus inside the open mobile menu', async () => {
    const user = userEvent.setup()
    renderHeaderWithSections()

    await user.click(screen.getByRole('button', { name: 'Открыть меню' }))
    const mobileNavigation = screen.getByRole('navigation', {
      name: 'Мобильная навигация',
    })
    const menuButton = screen.getByRole('button', { name: 'Закрыть меню' })
    const menuTargets = within(mobileNavigation).getAllByRole('link')

    menuButton.focus()
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(menuTargets.at(-1)).toHaveFocus()

    menuTargets.at(-1)!.focus()
    await user.keyboard('{Tab}')
    expect(menuButton).toHaveFocus()
  })

  it('restores the previous body overflow when unmounted while open', async () => {
    const user = userEvent.setup()
    document.body.style.overflow = 'auto'
    const view = renderHeaderWithSections()

    await user.click(screen.getByRole('button', { name: 'Открыть меню' }))
    expect(document.body.style.overflow).toBe('clip')

    view.unmount()
    expect(document.body.style.overflow).toBe('auto')
  })
})

describe('Reveal', () => {
  it('is immediately visible and skips observation under reduced motion', () => {
    installMatchMedia(true)

    render(<Reveal data-testid="reveal">Содержимое</Reveal>)

    expect(screen.getByTestId('reveal')).toHaveAttribute(
      'data-reveal-state',
      'visible',
    )
    expect(intersectionObservers).toHaveLength(0)
  })

  it('observes once and exposes only a data-state when motion is allowed', () => {
    render(<Reveal data-testid="reveal">Содержимое</Reveal>)

    const reveal = screen.getByTestId('reveal')
    expect(reveal).toHaveAttribute('data-reveal-state', 'hidden')
    expect(intersectionObservers).toHaveLength(1)

    act(() => intersectionObservers[0].trigger(reveal))

    expect(reveal).toHaveAttribute('data-reveal-state', 'visible')
    expect(intersectionObservers[0].unobserve).toHaveBeenCalledWith(reveal)
    expect(reveal).not.toHaveAttribute('style')
  })
})
