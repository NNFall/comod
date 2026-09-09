# Комод — кофейня в Самаре

Адаптивный React/TypeScript-лендинг кофейни «Комод» на Галактионовской, 130. Сайт собран как единый прокручиваемый editorial-повествовательный экран: hero, меню завтраков, рабочий ритм, атмосфера, сезонные поводы и контакты с локальным помощником заявки.

## Локальный запуск

```powershell
npm.cmd install
npm.cmd run dev
```

Фиксированный адрес разработки: <http://127.0.0.1:4173/>. Порт намеренно строгий (`strictPort`), чтобы ссылки и QA не расходились.

## Проверки

```powershell
npm.cmd run verify
npx.cmd playwright test tests/e2e/navigation.spec.ts tests/e2e/smoke.spec.ts tests/e2e/accessibility.spec.ts --workers=1
npx.cmd playwright test tests/e2e/scene-visual.spec.ts --workers=1
```

`verify` выполняет typecheck, ESLint, Vitest, проверку media manifest и production build. Визуальный контракт дополнительно проверяет размеры, направляющие, provenance, карту и media IDs. Зафиксированные референсы остаются отдельными входами QA; документальные фотографии в production помечены как реальные публичные кадры, а generated decorative assets не смешиваются с ними.

## Источники и ограничения

- Yandex Maps проверен напрямую; актуальные часы, рейтинг и наличие событий намеренно не захардкожены.
- Прямой VK URL блокируется managed browser. Для архивной проверки использован открытый индексированный mirror с сохранением исходных VK permalink и дат; это не является подтверждением авторства или коммерческой лицензии.
- Документальные изображения требуют подтверждения прав владельцем. Текстовая марка «КОМОД» — UI-типографика, не заявление об официальном logo-файле.

Подробности: [`docs/SOURCES.md`](docs/SOURCES.md), [`docs/CONTENT_VERIFICATION.md`](docs/CONTENT_VERIFICATION.md), [`docs/VK_RESEARCH.md`](docs/VK_RESEARCH.md), [`docs/FINAL_REPORT.md`](docs/FINAL_REPORT.md).
