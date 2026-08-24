import { Reveal } from './components/Reveal'
import { Scene } from './components/Scene'
import { SiteHeader } from './components/SiteHeader'

export default function App() {
  return (
    <div data-site-shell>
      <a className="skip-link" href="#main-content">
        Перейти к содержанию
      </a>

      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <Scene id="home" aria-labelledby="hero-title" tone="orange">
          <Reveal>
            <p className="eyebrow">Городская кофейня · Самара</p>
            <h1 id="hero-title">Комод — место с характером</h1>
            <p>
              Кофе, завтраки и тёплый интерьер на Галактионовской, 130.
            </p>
            <a href="#breakfasts">Посмотреть меню</a>
          </Reveal>
        </Scene>

        <Scene id="breakfasts" aria-labelledby="breakfasts-title">
          <Reveal id="menu" className="anchor-target">
            <p className="eyebrow">Меню</p>
            <h2 id="breakfasts-title">Завтраки в Комоде</h2>
            <p>
              Большие завтраки, сырники и другие позиции из актуального меню
              кофейни.
            </p>
          </Reveal>
        </Scene>

        <Scene id="work" aria-labelledby="work-title" tone="light">
          <Reveal>
            <p className="eyebrow">Смена обстановки</p>
            <h2 id="work-title">Работать и встречаться</h2>
            <p>
              Кофе, еда и живой интерьер — чтобы ненадолго сменить привычный
              рабочий фон.
            </p>
          </Reveal>
        </Scene>

        <Scene id="about" aria-labelledby="about-title" tone="orange">
          <Reveal>
            <p className="eyebrow">О месте</p>
            <h2 id="about-title">Комод, который хочется рассматривать</h2>
            <p>
              Узнаваемый интерьер собирает винтажные детали, насыщенные цвета и
              камерное настроение.
            </p>
          </Reveal>
        </Scene>

        <Scene id="events" aria-labelledby="events-title">
          <Reveal>
            <p className="eyebrow">Поводы заглянуть</p>
            <h2 id="events-title">Новое в меню и знакомые ритуалы</h2>
            <p>
              Перед визитом проверьте свежие новости и позиции меню в официальных
              источниках кофейни.
            </p>
          </Reveal>
        </Scene>

        <Scene id="contacts" aria-labelledby="contacts-title" tone="espresso">
          <Reveal>
            <p className="eyebrow">Галактионовская, 130</p>
            <h2 id="contacts-title">Контакты и бронирование</h2>
            <p>
              Позвоните в кофейню или постройте маршрут в Яндекс Картах. Заявка на
              этом сайте не подтверждает бронирование.
            </p>
            <div id="booking">
              <a href="tel:+79272655656">+7 (927) 265-56-56</a>
            </div>
          </Reveal>
        </Scene>
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
