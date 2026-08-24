# Implementation review

Статус: функционально готово к handoff; raw locked-pixel contract требует отдельного approved visual pass.

## Что проверено

- React/TypeScript composition состоит из шести сцен с общими `Scene`, `Reveal`, `MediaImage`, header, carousel, schematic map и booking helper.
- Навигация имеет verified anchor order, active-section state, mobile focus trap, Escape/resize close и scroll lock через `overflow: clip`, сохраняющий sticky header.
- Form helper не отправляет заявку наружу, валидирует дату/гостей, возвращает фокус к первой ошибке и предоставляет status live region.
- Все documentary assets проходят manifest/hash/dimension/source-chain checks; decorative generated assets маркированы отдельно.
- Accessibility smoke (axe), no-overflow probe, console/request error probe и focused scene/unit tests зелёные.

## Известные отклонения

1. Шесть supplied reference screens не являются теми же документальными кадрами и текстовыми данными, что доступны в Yandex/VK source pack. Поэтому raw screenshot mismatch выше строгого порога; геометрические guides, map construction и provenance gates проходят.
2. Часы, рейтинг и будущие события не выдуманы для сходства с reference copy; вместо этого показаны проверяемые ссылки и caveats.
3. Прямой VK managed access недоступен; архивный material подтверждён через публичный mirror, а documentary rights остаются owner-approval required.
4. Brand mark набран типографикой как UI approximation, а не выдан за официальный логотип.

Ни одно из этих отклонений не скрывает проверочный RED результат и не ослабляет визуальный тест.
