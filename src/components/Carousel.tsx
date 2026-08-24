import {
  Children,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type UIEvent,
} from 'react'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'

import { useReducedMotion } from '../hooks/useReducedMotion'

interface CarouselProps {
  readonly children: ReactNode
  readonly label: string
  readonly className?: string
  readonly viewportGuide?: string
}

const scrollEdgeTolerance = 1

export function Carousel({
  children,
  label,
  className = '',
  viewportGuide,
}: CarouselProps) {
  const slides = Children.toArray(children)
  const slideCount = slides.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollBounds, setScrollBounds] = useState({
    canMovePrevious: false,
    canMoveNext: false,
  })
  const viewportRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const syncFromViewport = useCallback((viewport: HTMLDivElement) => {
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
    const currentScroll = Math.min(Math.max(viewport.scrollLeft, 0), maxScroll)
    const candidates = Array.from(
      viewport.querySelectorAll<HTMLElement>('[data-carousel-slide]'),
    )

    if (candidates.length > 0) {
      const nearestIndex = candidates.reduce(
        (nearest, candidate, index) =>
          Math.abs(candidate.offsetLeft - currentScroll) <=
          Math.abs(candidates[nearest].offsetLeft - currentScroll)
            ? index
            : nearest,
        0,
      )
      setActiveIndex(nearestIndex)
    }

    setScrollBounds({
      canMovePrevious: currentScroll > scrollEdgeTolerance,
      canMoveNext: currentScroll < maxScroll - scrollEdgeTolerance,
    })
  }, [])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const sync = () => syncFromViewport(viewport)
    sync()
    window.addEventListener('resize', sync)

    const resizeObserver =
      typeof ResizeObserver === 'function' ? new ResizeObserver(sync) : null
    resizeObserver?.observe(viewport)

    return () => {
      window.removeEventListener('resize', sync)
      resizeObserver?.disconnect()
    }
  }, [syncFromViewport, slideCount])

  const moveTo = useCallback(
    (requestedIndex: number) => {
      const viewport = viewportRef.current
      if (!viewport || slideCount === 0) return

      const nextIndex = Math.min(Math.max(requestedIndex, 0), slideCount - 1)
      const target = viewport?.querySelectorAll<HTMLElement>(
        '[data-carousel-slide]',
      )[nextIndex]
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
      const targetScroll = Math.min(Math.max(target?.offsetLeft ?? 0, 0), maxScroll)

      if (target && typeof viewport.scrollTo === 'function') {
        viewport.scrollTo({
          left: targetScroll,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        })
      } else {
        syncFromViewport(viewport)
      }
    },
    [prefersReducedMotion, slideCount, syncFromViewport],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveTo(activeIndex - 1)
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveTo(activeIndex + 1)
    }
  }

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    syncFromViewport(event.currentTarget)
  }

  const classes = ['carousel', className].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      role="region"
      aria-label={label}
      aria-roledescription="карусель"
      onKeyDown={handleKeyDown}
    >
      <button
        className="carousel__control carousel__control--previous"
        type="button"
        aria-label="Предыдущая карточка"
        disabled={!scrollBounds.canMovePrevious}
        onClick={() => moveTo(activeIndex - 1)}
      >
        <ArrowLeft aria-hidden="true" size={24} weight="bold" />
      </button>

      <div
        ref={viewportRef}
        className="carousel__viewport"
        data-carousel-viewport=""
        data-visual-guide={viewportGuide}
        aria-label={`${label}: прокручиваемая лента`}
        tabIndex={0}
        onScroll={handleScroll}
      >
        <div className="carousel__track">
          {slides.map((slide, index) => (
            <div
              className="carousel__slide"
              data-carousel-slide=""
              data-active={index === activeIndex ? '' : undefined}
              role="group"
              aria-roledescription="карточка"
              aria-label={`${index + 1} из ${slideCount}`}
              key={index}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <button
        className="carousel__control carousel__control--next"
        type="button"
        aria-label="Следующая карточка"
        disabled={!scrollBounds.canMoveNext}
        onClick={() => moveTo(activeIndex + 1)}
      >
        <ArrowRight aria-hidden="true" size={24} weight="bold" />
      </button>

      <p className="carousel__status" role="status" aria-live="polite" aria-atomic="true">
        {slideCount === 0
          ? 'Нет карточек'
          : `Карточка ${activeIndex + 1} из ${slideCount}`}
      </p>
    </div>
  )
}
