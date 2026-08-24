import { List, MapPin, Phone, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

import { siteContent, yandexRouteUrl } from '../content/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { BrandMark } from './BrandMark'

const observedSectionIds = [
  'home',
  ...siteContent.navigation.map(({ href }) => href.slice(1)),
] as const
const desktopHeaderQuery = '(min-width: 74.0625rem)'

interface NavigationLinksProps {
  readonly activeSection: string
  readonly onNavigate?: () => void
}

function NavigationLinks({ activeSection, onNavigate }: NavigationLinksProps) {
  return (
    <ul className="site-navigation__list">
      {siteContent.navigation.map((item) => {
        const sectionId = item.href.slice(1)
        return (
          <li key={item.href}>
            <a
              className="site-navigation__link"
              href={item.href}
              aria-current={activeSection === sectionId ? 'location' : undefined}
              onClick={onNavigate}
            >
              {item.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const activeSection = useActiveSection(observedSectionIds)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileNavigationRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined

    const desktopMedia = window.matchMedia(desktopHeaderQuery)
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false)
    }

    desktopMedia.addEventListener('change', closeAtDesktop)
    return () => desktopMedia.removeEventListener('change', closeAtDesktop)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const focusTimer = window.setTimeout(() => {
      mobileNavigationRef.current
        ?.querySelector<HTMLElement>('a[href]')
        ?.focus({ preventScroll: true })
    }, 0)

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsMenuOpen(false)
        window.setTimeout(
          () => menuButtonRef.current?.focus({ preventScroll: true }),
          0,
        )
        return
      }

      if (event.key !== 'Tab') return

      const navigationTargets = Array.from(
        mobileNavigationRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      )
      const focusableElements = menuButtonRef.current
        ? [menuButtonRef.current, ...navigationTargets]
        : navigationTargets
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)
      if (!firstElement || !lastElement) return

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

  const closeMobileMenu = () => setIsMenuOpen(false)
  const toggleMobileMenu = () => setIsMenuOpen((isOpen) => !isOpen)
  return (
    <header className="site-header" data-menu-open={isMenuOpen ? '' : undefined}>
      <div className="site-header__inner">
        <BrandMark current={activeSection === 'home'} />

        <nav className="desktop-navigation" aria-label="Основная навигация">
          <NavigationLinks activeSection={activeSection} />
        </nav>

        <div className="site-header__meta">
          <a
            className="header-meta-link header-location"
            href={yandexRouteUrl}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin aria-hidden="true" size={23} weight="regular" />
            <span>{siteContent.identity.city}</span>
          </a>
          <a className="header-meta-link header-phone" href={siteContent.identity.phone.href}>
            <Phone aria-hidden="true" size={23} weight="regular" />
            <span>{siteContent.identity.phone.display}</span>
          </a>
          <a className="header-action" href="#booking">
            Подготовить заявку
          </a>
          <button
            ref={menuButtonRef}
            className="mobile-menu-toggle"
            type="button"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={toggleMobileMenu}
          >
            {isMenuOpen ? (
              <X aria-hidden="true" size={25} weight="regular" />
            ) : (
              <List aria-hidden="true" size={27} weight="regular" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          ref={mobileNavigationRef}
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Мобильная навигация"
        >
          <NavigationLinks
            activeSection={activeSection}
            onNavigate={closeMobileMenu}
          />
          <div className="mobile-navigation__contacts">
            <a href={yandexRouteUrl} target="_blank" rel="noreferrer">
              <MapPin aria-hidden="true" size={22} weight="regular" />
              {siteContent.identity.city}, {siteContent.identity.address}
            </a>
            <a href={siteContent.identity.phone.href}>
              <Phone aria-hidden="true" size={22} weight="regular" />
              {siteContent.identity.phone.display}
            </a>
          </div>
          <a
            className="mobile-navigation__action"
            href="#booking"
            onClick={closeMobileMenu}
          >
            Подготовить заявку
          </a>
        </nav>
      ) : null}
    </header>
  )
}
