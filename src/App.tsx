import { SiteHeader } from './components/SiteHeader'
import { AboutScene } from './scenes/AboutScene'
import { BreakfastScene } from './scenes/BreakfastScene'
import { ContactsScene } from './scenes/ContactsScene'
import { EventsScene } from './scenes/EventsScene'
import { HeroScene } from './scenes/HeroScene'
import { WorkScene } from './scenes/WorkScene'

export default function App() {
  return (
    <div data-site-shell>
      <a className="skip-link" href="#main-content">
        Перейти к содержанию
      </a>

      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <HeroScene />
        <BreakfastScene />
        <WorkScene />
        <AboutScene />
        <EventsScene />
        <ContactsScene />
      </main>

      <footer>
        <p>
          Комод · Самара, Галактионовская, 130. Перед визитом уточняйте
          актуальные часы работы и меню.
        </p>
      </footer>
    </div>
  )
}
