const navigation = [
  { href: '#breakfasts', label: 'Завтраки' },
  { href: '#work', label: 'Для работы' },
  { href: '#about', label: 'О Комоде' },
  { href: '#events', label: 'Поводы заглянуть' },
  { href: '#contacts', label: 'Контакты' },
]

export default function App() {
  return (
    <div data-site-shell>
      <a className="skip-link" href="#main-content">
        Перейти к содержанию
      </a>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Комод — на главную">
          КОМОД
        </a>
        <nav aria-label="Основная навигация">
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="header-action" href="#booking">
          Подготовить заявку
        </a>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section id="home" aria-labelledby="hero-title">
          <p className="eyebrow">Городская кофейня · Самара</p>
          <h1 id="hero-title">Комод — место с характером</h1>
          <p>
            Кофе, завтраки и тёплый интерьер на Галактионовской, 130.
          </p>
          <a href="#breakfasts">Посмотреть меню</a>
        </section>

        <section id="breakfasts" aria-labelledby="breakfasts-title">
          <p className="eyebrow">Меню</p>
          <h2 id="breakfasts-title">Завтраки в Комоде</h2>
          <p>
            Большие завтраки, сырники и другие позиции из актуального меню
            кофейни.
          </p>
        </section>

        <section id="work" aria-labelledby="work-title">
          <p className="eyebrow">Смена обстановки</p>
          <h2 id="work-title">Работать и встречаться</h2>
          <p>
            Кофе, еда и живой интерьер — чтобы ненадолго сменить привычный
            рабочий фон.
          </p>
        </section>

        <section id="about" aria-labelledby="about-title">
          <p className="eyebrow">О месте</p>
          <h2 id="about-title">Комод, который хочется рассматривать</h2>
          <p>
            Узнаваемый интерьер собирает винтажные детали, насыщенные цвета и
            камерное настроение.
          </p>
        </section>

        <section id="events" aria-labelledby="events-title">
          <p className="eyebrow">Поводы заглянуть</p>
          <h2 id="events-title">Новое в меню и знакомые ритуалы</h2>
          <p>
            Перед визитом проверьте свежие новости и позиции меню в официальных
            источниках кофейни.
          </p>
        </section>

        <section id="contacts" aria-labelledby="contacts-title">
          <p className="eyebrow">Галактионовская, 130</p>
          <h2 id="contacts-title">Контакты и бронирование</h2>
          <p>
            Позвоните в кофейню или постройте маршрут в Яндекс Картах. Заявка на
            этом сайте не подтверждает бронирование.
          </p>
          <div id="booking">
            <a href="tel:+79272655656">+7 (927) 265-56-56</a>
          </div>
        </section>
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
