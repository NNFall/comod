import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react'

import { useReducedMotion } from '../hooks/useReducedMotion'

type RevealProps = ComponentPropsWithoutRef<'div'>

export const Reveal = forwardRef<HTMLDivElement, RevealProps>(function Reveal(
  { className = '', ...props },
  forwardedRef,
) {
  const prefersReducedMotion = useReducedMotion()
  const elementRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(prefersReducedMotion)

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return undefined
    }

    const element = elementRef.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsVisible(true)
        observer.unobserve(entry.target)
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  const setRefs = (element: HTMLDivElement | null) => {
    elementRef.current = element
    if (typeof forwardedRef === 'function') forwardedRef(element)
    else if (forwardedRef) forwardedRef.current = element
  }

  return (
    <div
      ref={setRefs}
      className={['reveal', className].filter(Boolean).join(' ')}
      data-reveal-state={isVisible ? 'visible' : 'hidden'}
      {...props}
    />
  )
})
