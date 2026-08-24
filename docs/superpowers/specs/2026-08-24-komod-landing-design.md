# Komod Landing Design Specification

## Decision

Build one semantic, scrollable React/TypeScript page made of six art-directed scenes. Each scene mirrors one supplied 1672×941 reference, but shares a single navigation, data layer, media inventory and motion system. At desktop, scenes preserve the reference's fold-level compositions. On mobile, they are purposefully recomposed into readable single-column sequences.

The user explicitly approved proceeding without another interview and supplied the visual direction, source list, required skills, viewport matrix and publication target.

## Approaches considered

### A. Six literal fixed-height replicas

Each reference becomes a 1672:941 fixed canvas scaled to the viewport. This offers the fastest screenshot match but fails normal document flow, mobile accessibility, text zoom and content changes. Rejected.

### B. Art-directed responsive scenes (selected)

Each reference becomes a responsive CSS grid with measured desktop proportions, fluid tokens and breakpoint-specific placement. Real content remains semantic and interactive. Decorative motifs are layered independently from documentary media. This is the best balance of pixel fidelity, accessibility and maintainability.

### C. Reference screenshots as page backgrounds

The screenshots are displayed as full-page imagery with invisible interaction hotspots. It would appear exact at one size but is inaccessible, unresponsive and dishonest about the implementation. Rejected.

## Source status and content rules

- GitHub `NNFall/comod` is a private, empty repository. The authenticated user has admin access. Work occurs only in `D:\papka for all\work\sites\comod`.
- The Yandex organisation card was directly opened on 24 August 2026. Stable-enough identity facts confirmed for the prototype: «Комод», Галактионовская ул., 130, Самара and +7 (927) 265-56-56. Rating, opening status, features, prices and counts are treated as volatile source snapshots rather than permanent brand facts.
- Volatile counts changed between surfaces (495 photos on the overview and 489 in a later gallery view; reviews changed from a stored 1678 to 1679). The landing will not surface those counts.
- Current menu items directly visible: Большой Морской завтрак 1250 ₽, Большой завтрак 1110 ₽, зелёная гречка с креветками 610 ₽, скрембл Карбонара 740 ₽, сырники с кокосовым кремом и вишнёвым конфи 490 ₽. Menu copy states that on-site dishes and prices may differ from delivery; the site links to the current source.
- VK direct URLs were retried on 24 August 2026 through the available managed/public-source routes and returned a non-retryable open error. Search-indexed public snippets and a third-party mirror expose apparent VK-origin posts, but are not equivalent to direct VK review and contain inconsistent address metadata. They may inform a private research log only; no statement or photograph is attributed to VK until a directly viewable export, permalink or owner media pack is available.
- The six supplied screenshots are `reference` assets. They set composition and style, not factual truth.
- Public visibility is not a commercial-use licence. Yandex gallery files remain temporary, source-attributed prototype assets in the private repository until the café confirms authorship, depicted-person consent and permission for web use, cropping and AI-derived edits. A public production deployment must use an owner-approved media pack.

## Scene architecture

### 1. Hero: «Кофе, завтраки и уют»

- Desktop composition: 53% orange copy field, 47% curved documentary facade field, overlapping breakfast/cup cutouts at the lower seam.
- Sticky top navigation: logo, `Меню`, `Завтраки`, `Для работы`, `О нас`, `События`, `Контакты`, location, phone, booking CTA.
- Hero CTA scrolls to the booking scene. Secondary indicators link to breakfast, price/source and space features.
- Reference doodles become lightweight CSS/SVG motifs; no copied AI lettering is used as a factual logo.

### 2. Breakfasts

- Large two-line heading, documentary-led horizontal slider, previous/next controls and a source-link CTA.
- Menu cards contain verified titles/prices only. Each visible photograph receives an accurate scene-level alt text, not a potentially false dish-to-photo claim.
- Slider supports buttons, keyboard arrows and touch/trackpad scrolling; JS controls only the active index and accessibility announcements.

### 3. Work and meetings

- Left statement and CTA; right asymmetric documentary interior collage.
- Feature strip: Wi-Fi, seating, breakfast/coffee, atmosphere. Claims are limited to Yandex-listed features or clearly subjective editorial language.
- No invented power-outlet guarantee. Reference copy that promises outlets at every table is removed.

### 4. About the space

- Left editorial copy plus four compact factual feature blocks.
- Right collage uses the wide interior, yellow chair, facade/terrace and coffee/window photographs.
- A circular `Сделано с любовью` seal is decorative and accessible-hidden.

### 5. Seasonal reasons to visit

- Reference event cards are preserved visually but content becomes `Сезонное меню`, `Встретиться за кофе` and `Завтраки каждый день`. The middle slot deliberately avoids the unsupported historical `Komod club` claim because no directly verifiable source permalink was available.
- No invented 2026 event dates. The 2025 Yandex seasonal post may be linked as historical context but not presented as current.
- Filters animate the visible selection locally; `Все`, `Сезонное`, `Для постоянных гостей`, `Каждый день`.

### 6. Contacts and booking

- Verified address, telephone and current-hours link.
- A stylised local SVG map provides the reference composition and links to Yandex for live routing; it is not presented as a precise navigation map.
- A two-step booking helper validates visit details, then presents a copyable request summary and the verified `tel:` action. It never claims a confirmed reservation and contains no backend or secret. A WhatsApp deep link is not exposed because availability of that phone number in WhatsApp has not been verified.
- `index.html` contains a visible `<noscript>` fallback with the verified phone and supplied Yandex route URL because the React application itself is client rendered.

## Responsive behaviour

- `1672×941`: primary screenshot contract. Header height is 127–134 px; major scene zones, image masks and card widths stay within ±8 px; display-heading baselines and line breaks stay within ±4 px; radii within ±2 px; strokes within ±1 px; dominant colours within ΔE 3 where content has not intentionally changed. UI-only masked pixel difference target is at most 2.5%; whole-frame difference is informative because documentary photos intentionally differ from AI references.
- `1920×1080`: layout expands through fluid gutters and max scene width; typography grows only within defined clamps.
- `1024px`: condensed navigation, two-column scenes remain when readable, controls stay at least 44 px.
- `390×844`: each scene becomes a deliberate vertical poster. Hero copy precedes imagery; sliders show 1.08 cards to imply horizontal interaction; header uses a menu disclosure.
- `320px`: no horizontal page overflow, 16 px side gutter, no fixed text widths, booking controls remain usable.

## Motion

- Intersection Observer reveals scene groups with transform/opacity only.
- Slider movement uses transform or native scroll; hover lift never changes layout.
- The hero uses a short stagger and subtle motif drift, not continuous parallax.
- With `prefers-reduced-motion: reduce`, reveals are immediate, auto motion is disabled and scrolling is non-animated.

## Media and ImageGen policy

- `documentary`: downloaded from the directly viewed Yandex gallery, original URL and capture date recorded.
- `documentary-derived`: crop, colour grade or transparent cutout derived from a documentary file. It retains a source link and transformation note.
- `reference`: the six user-supplied AI concept screens or mechanical crops from them.
- `generated-decorative`: ImageGen output used only for texture, background, motif or clearly editorial composite. It is never labelled as a real view or dish.
- Hero facade/interior and food source images receive versioned ImageGen edit trials for colour grade, canvas extension, crop recovery or local object cleanup. Each prompt names the edit target, locks geometry/signage/dish composition and changes only the requested property. Original files remain in the repository for side-by-side comparison; rejected variants are logged and never used.
- The asset pass includes at least one texture generation, one decorative motif generation and three focused edit iterations across exterior, interior and food imagery. More iterations are allowed only when each one has a defined page placement and improves the reference match.
- Remove Background is used for the documentary breakfast plate and coffee cup only if the checkerboard preview preserves edges and food details.

## Accessibility, performance and failure states

- Semantic headings, landmarks, buttons and form controls; skip link; visible focus; contrast checked against WCAG AA.
- All images have dimensions; below-fold photos use lazy loading; hero uses responsive sources and `fetchpriority=high` only for the actual LCP image.
- No runtime dependency on third-party image hosts. Public source images used by the site are stored locally with provenance.
- Booking validation is inline. If WhatsApp cannot open, the phone number and a copyable message remain visible.
- No secret, token, analytics identifier or private API is committed.

## Testing and evidence

- Unit/integration: navigation anchors, slider bounds/keyboard operation, filters, booking validation/message construction, mobile menu and reduced-motion class behaviour.
- Static: TypeScript, ESLint and production build.
- Browser: every CTA/anchor, form error/success path, keyboard focus, console errors and horizontal overflow.
- Visual: screenshots at 1672×941, 1920×1080, 390×844 and 320px; independent visual comparison by a subagent and Antigravity; material findings fixed and rechecked.
- Performance: image dimensions/formats, lazy loading, no scroll listeners, transform/opacity motion only.

## Intentional reference deviations to report

1. AI-generated venue/food composites are replaced with verified documentary photographs or explicitly labelled derivatives.
2. Volatile ratings/counts, invented dates, outlet guarantees and unverified event claims are omitted or softened.
3. A booking helper prepares contact rather than simulating a confirmed reservation.
4. Mobile is recomposed rather than proportionally shrinking a 16:9 canvas.
5. Motion is reduced or removed for users who request it.

## Self-review

- Every implementation decision required to start work is resolved in this specification.
- All six references map to one scene with a clear purpose and acceptance criteria.
- Architecture, content rules, media classes and testing agree with one another.
- Scope is one deployable landing page; no backend, CMS or payment subsystem has been added.
