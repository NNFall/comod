# QA report

Дата последнего прогона: 24.08.2026 (Europe/Samara).

## Автоматические проверки

| Проверка | Результат |
| --- | --- |
| `npm.cmd run typecheck` | PASS |
| `npm.cmd run lint` | PASS |
| `npm.cmd test -- --run` | PASS — 16 файлов, 81 тест |
| `npm.cmd run media:check` | PASS — 17 tracked assets, hashes/dimensions/provenance |
| `npm.cmd run build` | PASS — Vite 8.2.2, 4580 modules |
| Playwright smoke/navigation/axe | PASS — 5/5 |
| `git diff --check` | PASS |

## Browser evidence

Playwright custom probe прошёл без runtime/page/request ошибок и горизонтального overflow на 1920×1080, 1672×941, 390×844 и 320×844. На мобильных viewport `document.documentElement.scrollWidth` равен viewport width: 390 и 320 px.

Снимки последнего запуска:

- `C:\Users\User\AppData\Local\Temp\komod-final-qa-20260824\desktop-1920x1080.png`
- `C:\Users\User\AppData\Local\Temp\komod-final-qa-20260824\desktop-1672x941.png`
- `C:\Users\User\AppData\Local\Temp\komod-final-qa-20260824\mobile-390x844.png`
- `C:\Users\User\AppData\Local\Temp\komod-final-qa-20260824\mobile-320x844.png`

Встроенный Browser использовался для ручной проверки hero, меню, событий, контактов, desktop и узких mobile-композиций. `prefers-reduced-motion` отключает reveal/transform-анимации; обычный режим получает scroll-reveal, hover и carousel transitions.

## Locked visual contract

Проверка `tests/e2e/scene-visual.spec.ts` сохранила все геометрические, map и media provenance gates, но raw pixel threshold ≤2.5% не достигнут из-за отличий документальных source photos, copy и декоративных деталей от шести синтетических/референсных компов:

| Scene | Masked mismatch |
| --- | ---: |
| hero | 14.98% |
| events | 13.83% |
| contacts | 9.62% |
| about | 15.80% |
| work | 14.24% |
| breakfasts | 15.95% |

Это намеренное, явно зафиксированное отклонение: тест не ослаблен и остаётся красным, чтобы будущая замена референсных компов или approved photo pack могла вернуть строгий ≤2.5% gate.
