# Komod Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task, with specification-compliance and code-quality review after each bounded task.

**Goal:** Build, visually polish, test and publish a single responsive React/TypeScript landing page for café «Комод» that matches all six supplied 1672×941 references to the measured acceptance contract while keeping source claims, documentary photos and generated decoration truthfully separated.

**Architecture:** A Vite React application renders six semantic scene components under one sticky navigation. Content, links and media provenance live in typed data modules; interaction state is local to the menu, carousel, filters and booking helper. Tailwind CSS provides the layout/token layer, while one authored stylesheet handles the reference-specific cut edges, curved masks, texture and motion. Vitest covers behaviour and data contracts; Playwright covers viewport, accessibility and visual evidence.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Onest variable font, Phosphor Icons, Vitest, Testing Library, Playwright and axe-core. Local preview uses `127.0.0.1:4173` with strict port binding.

---

## Execution preflight

The empty remote has no default branch. First commit this specification, plan, product/design context and immutable reference locks as the local root commit on `main`. Then create `codex/komod-landing` before application implementation. Keep implementation commits on that branch and defer remote integration until the final review workflow.

## Task 1: Bootstrap the application and verification harness

**Files:**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `eslint.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/index.css`
- Create: `src/test/setup.ts`
- Create: `src/App.test.tsx`
- Create: `playwright.config.ts`
- Create: `tests/e2e/smoke.spec.ts`
- Create: `.gitignore`

**Step 1: Create the package manifest and install the declared toolchain**

Create `package.json` with `private: true`, ESM mode and the scripts listed below, then install the runtime and development dependencies with npm so the lockfile records exact versions:

```powershell
npm.cmd install react react-dom @fontsource-variable/onest @phosphor-icons/react
npm.cmd install -D typescript vite @vitejs/plugin-react @tailwindcss/vite tailwindcss eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test axe-core @axe-core/playwright
```

**Step 2: Write the failing render and browser smoke tests**

`src/App.test.tsx` must assert that the page exposes a `main`, an `h1` containing «Комод», and six labelled regions. `tests/e2e/smoke.spec.ts` must assert that `/` loads without console errors and that `[data-site-shell]` exists.

**Step 3: Run the focused unit test and confirm RED**

Run: `npm.cmd test -- --run src/App.test.tsx`

Expected: failure because the app shell and the six labelled scenes do not exist yet.

**Step 4: Add the minimal shell and configuration**

Use these script contracts in `package.json`: `dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `test:watch`, `test:e2e`, `test:a11y` and `verify`. Configure Vite dev/preview hosts as `127.0.0.1`, port `4173`, `strictPort: true`. Load Onest locally from `@fontsource-variable/onest`; do not add third-party runtime font requests.

`App.tsx` now renders a skip link, a minimal semantic header, `main`, six semantic regions with final IDs and a footer. Region copy must already be truthful final copy. Task 3 extracts and completes the production `SiteHeader` without changing the section contract.

**Step 5: Run unit, type and production checks and confirm GREEN**

Run:

```powershell
npm.cmd test -- --run src/App.test.tsx
npm.cmd run typecheck
npm.cmd run build
```

Expected: all commands exit 0; `dist/index.html` exists.

**Step 6: Commit the bounded bootstrap**

```powershell
git add package.json package-lock.json tsconfig*.json vite.config.ts eslint.config.js index.html src playwright.config.ts tests/e2e/smoke.spec.ts .gitignore
git commit -m "chore: bootstrap Komod landing"
```

## Task 2: Establish truthful content and media provenance

**Files:**

- Create: `src/content/site.ts`
- Create: `src/content/mediaManifest.ts`
- Create: `src/content/site.test.ts`
- Create: `src/types/content.ts`
- Create: `public/media/documentary/originals/`
- Create: `public/media/documentary-derived/`
- Create: `public/media/generated-decorative/`
- Create: `public/media/reference-derived/`
- Create: `docs/SOURCES.md`
- Create: `docs/CONTENT_VERIFICATION.md`
- Create: `scripts/check-media-manifest.mjs`

**Step 1: Write the failing provenance contract**

Test that every media item has a unique ID, local `src`, `kind` from `documentary | documentary-derived | reference | reference-derived | generated-decorative`, capture/generation date, source label, rights status, transformation note and non-empty alt strategy. Assert that generated and reference media cannot set `documentary: true` and that every menu price is labelled with a verification date and source URL.

**Step 2: Run the focused contract and confirm RED**

Run: `npm.cmd test -- --run src/content/site.test.ts`

Expected: failure because the typed content and manifest do not exist.

**Step 3: Copy and classify source assets**

Copy only visually inspected Yandex originals needed by the six scenes into `public/media/documentary/originals/`, keeping stable descriptive names. Preserve the original files and record the exact CDN page-asset URL, source surface, date `2026-08-24`, observed dimensions and `rightsStatus: owner-approval-required` in `docs/SOURCES.md` and the manifest.

Use downloaded photos only in the private prototype. State in `docs/CONTENT_VERIFICATION.md` that public commercial deployment requires an owner-approved media pack, current opening schedule, phone, menu/prices, feature list, event claims, brand assets and depicted-person consent. State explicitly that VK was not directly reviewed.

**Step 4: Implement typed content and media checks**

`site.ts` owns navigation, verified identity data, menu snapshot, work/about features, seasonal cards and contact actions. `mediaManifest.ts` owns provenance only. Renderable content references media by ID rather than importing anonymous paths. `scripts/check-media-manifest.mjs` confirms that every local path exists and rejects unknown files in production media directories.

**Step 5: Run provenance verification and confirm GREEN**

Run:

```powershell
npm.cmd test -- --run src/content/site.test.ts
node scripts/check-media-manifest.mjs
```

Expected: tests pass; script reports every tracked media file with no orphan or missing entry.

**Step 6: Commit the bounded content layer**

```powershell
git add src/content src/types public/media docs/SOURCES.md docs/CONTENT_VERIFICATION.md scripts/check-media-manifest.mjs
git commit -m "feat: add verified content and media provenance"
```

## Task 3: Build the shared header, navigation and motion primitives

**Files:**

- Create: `src/components/SiteHeader.tsx`
- Create: `src/components/SiteHeader.test.tsx`
- Create: `src/components/BrandMark.tsx`
- Create: `src/components/Scene.tsx`
- Create: `src/components/Reveal.tsx`
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/hooks/useActiveSection.ts`
- Modify: `src/App.tsx`
- Modify: `src/styles/index.css`

**Step 1: Write failing navigation and accessibility tests**

Cover desktop anchor order, current-section state, opening/closing the mobile disclosure, `Escape`, focus return, body scroll restoration and reduced-motion output. Assert all interactive targets have accessible names and the booking CTA resolves to `#booking`.

**Step 2: Run the focused tests and confirm RED**

Run: `npm.cmd test -- --run src/components/SiteHeader.test.tsx`

Expected: failure because the components/hooks do not exist.

**Step 3: Implement the shared primitives**

Create a text-based `КОМОД` brand mark rather than tracing an unverified logo. Header uses semantic anchors, `aria-expanded`, one native button for the disclosure and no manual div-button roles. `Reveal` observes once, writes only a data state and becomes immediate under `prefers-reduced-motion`. Active-section observation must not install a scroll listener.

**Step 4: Match the shared reference frame**

At 1672 px, set header height within 127–134 px, horizontal canvas padding 56–60 px and navigation typography 17–19 px. At 390 px use a 68–76 px header; at 320 px use 64–70 px. Focus outlines use the coral token and remain visible against cream, orange and espresso surfaces.

**Step 5: Run focused and static checks and confirm GREEN**

```powershell
npm.cmd test -- --run src/components/SiteHeader.test.tsx
npm.cmd run typecheck
npm.cmd run lint
```

**Step 6: Commit**

```powershell
git add src/components src/hooks src/App.tsx src/styles/index.css
git commit -m "feat: add responsive Komod navigation"
```

## Task 4: Implement the hero scene to the measured reference

**Files:**

- Create: `src/scenes/HeroScene.tsx`
- Create: `src/scenes/HeroScene.test.tsx`
- Create: `src/components/MediaImage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/index.css`

**Step 1: Write the failing hero contract**

Assert one `h1`, truthful identity copy, a booking anchor, three reference-style fact links, an eager high-priority LCP image, provenance data attributes and decorative marks hidden from assistive technology.

**Step 2: Run and confirm RED**

Run: `npm.cmd test -- --run src/scenes/HeroScene.test.tsx`

**Step 3: Implement desktop and mobile compositions**

At 1672×941 preserve a 53/47 orange/photo split with the boundary moving from about x=1015 at the top to x=685 at the bottom. Keep hero copy within x=60–656 and the primary CTA near 313×65. Use an authored `clip-path`/pseudo-element curve, layered cutouts and decorative SVG/CSS marks without copying AI reference lettering as a logo.

At 390/320 px, stack copy before the documentary image, preserve a clear orange field and keep all buttons at least 44 px high. Avoid fixed scene height when content or text zoom needs more room.

**Step 4: Run checks and confirm GREEN**

```powershell
npm.cmd test -- --run src/scenes/HeroScene.test.tsx
npm.cmd run typecheck
```

**Step 5: Commit**

```powershell
git add src/scenes/HeroScene.tsx src/scenes/HeroScene.test.tsx src/components/MediaImage.tsx src/App.tsx src/styles/index.css
git commit -m "feat: build Komod hero scene"
```

## Task 5: Implement the breakfast carousel

**Files:**

- Create: `src/scenes/BreakfastScene.tsx`
- Create: `src/scenes/BreakfastScene.test.tsx`
- Create: `src/components/SnapCarousel.tsx`
- Create: `src/components/SnapCarousel.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/index.css`

**Step 1: Write failing carousel tests**

Cover previous/next bounds, disabled states, keyboard left/right, active slide announcement and a 1.08-card mobile affordance. Assert food images use scene-level descriptive alt text and do not claim that an unverified photograph depicts a specific menu item.

**Step 2: Run and confirm RED**

Run: `npm.cmd test -- --run src/components/SnapCarousel.test.tsx src/scenes/BreakfastScene.test.tsx`

**Step 3: Implement the measured composition**

Use native horizontal scroll snap with progressive button controls. At 1672 px render four cards around 344–347 px wide, 26–27 px gaps and photo crops around 347×217 px. Use the reference two-line heading scale, dark/honey cards and a source-link CTA. On narrow screens expose a 1.08-card track and keep controls reachable without hover.

**Step 4: Run and confirm GREEN**

```powershell
npm.cmd test -- --run src/components/SnapCarousel.test.tsx src/scenes/BreakfastScene.test.tsx
npm.cmd run typecheck
```

**Step 5: Commit**

```powershell
git add src/components/SnapCarousel* src/scenes/BreakfastScene* src/App.tsx src/styles/index.css
git commit -m "feat: add accessible breakfast carousel"
```

## Task 6: Implement work and about scenes

**Files:**

- Create: `src/scenes/WorkScene.tsx`
- Create: `src/scenes/AboutScene.tsx`
- Create: `src/scenes/EditorialScenes.test.tsx`
- Create: `src/components/FeatureCard.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/index.css`

**Step 1: Write failing editorial scene tests**

Assert the work scene does not promise outlets, guaranteed seating or events; assert the about scene renders exactly four factual/subjective feature blocks, documentary provenance markers and correctly ordered headings.

**Step 2: Run and confirm RED**

Run: `npm.cmd test -- --run src/scenes/EditorialScenes.test.tsx`

**Step 3: Implement measured grids**

At 1672 px, work uses a left region around x=54–634 and right collage x=654–1628, with a 608×320 dominant photo, side image and three small cards. About uses left copy x=57–709 and right collage x=750–1621 with an approximately 871×379 dominant image and four compact features. Preserve espresso and orange panel mass, ticket-cut edges and 18–28 px radii.

At 390/320 px, place statement before media and collapse feature cards to one column or a readable two-up pair only when text fits. Do not reorder DOM solely for desktop composition.

**Step 4: Run and confirm GREEN**

```powershell
npm.cmd test -- --run src/scenes/EditorialScenes.test.tsx
npm.cmd run typecheck
```

**Step 5: Commit**

```powershell
git add src/components/FeatureCard.tsx src/scenes/WorkScene.tsx src/scenes/AboutScene.tsx src/scenes/EditorialScenes.test.tsx src/App.tsx src/styles/index.css
git commit -m "feat: add work and about scenes"
```

## Task 7: Implement seasonal cards and filters

**Files:**

- Create: `src/scenes/EventsScene.tsx`
- Create: `src/scenes/EventsScene.test.tsx`
- Create: `src/components/FilterPills.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/index.css`

**Step 1: Write failing interaction tests**

Assert filter pills are native buttons, selected state uses `aria-pressed`, filtering preserves source order, the empty state is impossible for shipped filters and no fabricated event date appears.

**Step 2: Run and confirm RED**

Run: `npm.cmd test -- --run src/scenes/EventsScene.test.tsx`

**Step 3: Implement reference structure with truthful content**

At 1672 px preserve the left intro x=59–458 and three card columns beginning around x=521, 878 and 1233 with approximately 330 px widths, plus the dark lower banner. Use seasonal menu, Komod club and everyday breakfasts as reasons to visit, without presenting historical posts as current events.

**Step 4: Run and confirm GREEN**

```powershell
npm.cmd test -- --run src/scenes/EventsScene.test.tsx
npm.cmd run typecheck
```

**Step 5: Commit**

```powershell
git add src/components/FilterPills.tsx src/scenes/EventsScene* src/App.tsx src/styles/index.css
git commit -m "feat: add truthful seasonal visit scene"
```

## Task 8: Implement contacts and booking helper

**Files:**

- Create: `src/scenes/ContactScene.tsx`
- Create: `src/scenes/ContactScene.test.tsx`
- Create: `src/components/BookingForm.tsx`
- Create: `src/components/BookingForm.test.tsx`
- Create: `src/lib/booking.ts`
- Create: `src/lib/booking.test.ts`
- Create: `src/components/RouteMap.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/index.css`

**Step 1: Write failing validation and transport tests**

Cover required name/phone/date/time/guest count, Russian phone normalisation, past-date rejection, guest bounds, deterministic WhatsApp text, URI encoding and fallback message display. Assert the interface says «подготовить заявку» and never says a reservation is confirmed.

**Step 2: Run and confirm RED**

Run: `npm.cmd test -- --run src/lib/booking.test.ts src/components/BookingForm.test.tsx src/scenes/ContactScene.test.tsx`

**Step 3: Implement honest booking behaviour**

Use labelled native inputs, inline errors linked by `aria-describedby`, a live summary and an explicit submit action that opens a WhatsApp deep link in a user-initiated event. Always expose tel and Yandex route anchors. The stylised local SVG map must say it is schematic and link to the live map rather than impersonate accurate routing.

**Step 4: Match contact geometry**

At 1672 px preserve text x=81–568, schematic map x=606–1025 and facade x=1037–1624, followed by amenities and booking panels. At mobile, order contact facts, route, exterior image and booking form; inputs remain at least 44 px high and use appropriate autocomplete/inputmode.

**Step 5: Run and confirm GREEN**

```powershell
npm.cmd test -- --run src/lib/booking.test.ts src/components/BookingForm.test.tsx src/scenes/ContactScene.test.tsx
npm.cmd run typecheck
```

**Step 6: Commit**

```powershell
git add src/lib src/components/BookingForm* src/components/RouteMap.tsx src/scenes/ContactScene* src/App.tsx src/styles/index.css
git commit -m "feat: add contacts and booking helper"
```

## Task 9: Create and verify derived visual assets

**Files:**

- Create: `docs/IMAGEGEN.md`
- Create: `public/media/generated-decorative/komod-paper-texture.webp`
- Create: `public/media/generated-decorative/komod-illustration-sheet.webp`
- Create: `public/media/documentary-derived/breakfast-cutout.png`
- Create: `public/media/documentary-derived/coffee-cutout.png`
- Create: `public/media/documentary-derived/checkerboard-previews/`
- Modify: `src/content/mediaManifest.ts`
- Modify: `docs/SOURCES.md`
- Modify: `src/styles/index.css`

**Step 1: Record the visual intent before generation**

`docs/IMAGEGEN.md` records each prompt, input file, output class and placement. Generate a seamless warm recycled-paper texture and a clearly illustrative Komod motif sheet matching the reference palette; neither asset may depict a supposed real room, dish, employee or guest.

For any photo edit, preserve the unmodified documentary original and label the output `documentary-derived`. Do not claim that a generated or reconstructed dish is the café's current serving.

**Step 2: Generate, inspect and iterate**

Use ImageGen on the two decorative outputs and inspect them at original resolution. Reject embedded words, logos, watermarks, fake interface elements or scene-like imagery that could be mistaken for documentation. Iterate until the texture tiles without visible seams and the motif sheet can be used as small decorative crops.

**Step 3: Run local background removal with evidence**

Use `remove_background.py` only on the visually inspected breakfast and coffee originals. Compare at least two threshold/soft-edge settings through checkerboard previews. Keep final cutouts only if plate rim, steam/cup edge and food detail remain intact; otherwise document the rejection and use a masked rectangular crop instead.

**Step 4: Update provenance and verify the asset inventory**

Record prompts, generation date, reference inputs and transformation notes. Run:

```powershell
node scripts/check-media-manifest.mjs
npm.cmd test -- --run src/content/site.test.ts
```

Expected: every retained output is classified and no derivative replaces its original.

**Step 5: Commit**

```powershell
git add docs/IMAGEGEN.md docs/SOURCES.md public/media src/content/mediaManifest.ts src/styles/index.css
git commit -m "feat: add verified Komod visual assets"
```

## Task 10: Complete system polish, accessibility and responsive tests

**Files:**

- Create: `tests/e2e/landing.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/visual.spec.ts`
- Create: `tests/e2e/helpers.ts`
- Create: `tests/visual/.gitkeep`
- Create: `docs/QA.md`
- Modify: `src/styles/index.css`
- Modify: scene/component files found by review

**Step 1: Write failing browser acceptance tests**

At 1672×941, 1920×1080, 390×844 and 320×800 test: no page-level horizontal overflow, all six sections reachable, header/menu usable, carousel and filters operable, form validation/fallback visible, no console/page errors, focus visible and reduced-motion animations disabled. Run axe against the loaded page with documented handling for any justified warning.

**Step 2: Start the fixed-port server**

Run in a persistent session:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Expected local URL: `http://127.0.0.1:4173/`.

**Step 3: Run browser tests and confirm RED before polish**

```powershell
npx.cmd playwright test tests/e2e/landing.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/visual.spec.ts
```

Expected: at least one measured visual/responsive assertion fails before final tuning.

**Step 4: Polish in the embedded browser**

Use the in-app browser, not only terminal screenshots. Capture full-page and fold-level evidence at all required viewports after fonts and images are ready. Compare each scene against its locked reference, prioritising geometry, type scale, palette, negative space and image focal point. Record each intentional reference deviation and every fixed issue in `docs/QA.md`.

Target metrics at 1672×941: major zones ±8 px, heading baselines/line breaks ±4 px, radius ±2 px, stroke ±1 px and palette ΔE ≤3. UI-only photo-masked diff target ≤2.5%; whole-frame diff is reported, not used to punish truthful documentary substitution. At 390 px use 20 px gutters and 40–46 px display type; at 320 px use 16 px gutters and 36–40 px display type.

**Step 5: Run browser, unit and static checks and confirm GREEN**

```powershell
npm.cmd test -- --run
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npx.cmd playwright test
node scripts/check-media-manifest.mjs
git diff --check
```

Expected: every command exits 0, no unreviewed snapshot update and evidence screenshots exist.

**Step 6: Commit**

```powershell
git add src tests docs/QA.md
git commit -m "test: verify Komod landing across viewports"
```

## Task 11: Independent review and corrections

**Files:**

- Modify: only files justified by review findings
- Create: `docs/REVIEW.md`

**Step 1: Run independent reviewers**

Send the complete implementation to separate agents for specification compliance, code quality/accessibility and visual comparison. Run the required Antigravity analysis against the locked references, current screenshots and source/provenance docs. Reviewers do not edit during the first pass.

**Step 2: Triage every finding**

Record severity, evidence, accepted/rejected decision and the exact fix in `docs/REVIEW.md`. Do not accept a reviewer statement without opening the referenced code or reproducing the screenshot/behaviour.

**Step 3: Fix findings with RED/GREEN regression tests**

For each behavioural defect, first add a focused failing test, reproduce RED, apply the smallest fix, then reproduce GREEN. For a visual defect, capture before/after evidence at the affected viewport and rerun overflow/accessibility checks.

**Step 4: Re-run the complete verification matrix**

```powershell
npm.cmd run verify
npx.cmd playwright test
node scripts/check-media-manifest.mjs
git diff --check
```

**Step 5: Commit**

```powershell
git add src tests docs/REVIEW.md docs/QA.md
git commit -m "fix: address independent Komod landing review"
```

## Task 12: Finish, publish and preserve the local proof

**Files:**

- Create or modify: `README.md`
- Create: `docs/FINAL_REPORT.md`
- Create: `docs/evidence/`

**Step 1: Write the final handoff documents**

`README.md` includes setup, fixed local URL, verification commands, content/media caveats and repository state. `docs/FINAL_REPORT.md` lists source access status, skill use, test/browser evidence, exact reference deviations with reasons, unresolved owner confirmations and commit/push evidence.

**Step 2: Perform verification-before-completion**

Run fresh commands, not cached claims:

```powershell
npm.cmd ci
npm.cmd run verify
npx.cmd playwright test
node scripts/check-media-manifest.mjs
git diff --check
git status --short --branch
git log -1 --oneline
git remote -v
```

Keep `npm.cmd run dev -- --host 127.0.0.1 --port 4173 --strictPort` running and confirm `http://127.0.0.1:4173/` in the embedded browser.

**Step 3: Request final code review and use the branch-finishing skill**

Run the required requesting-code-review workflow. Resolve material findings, rerun the affected checks, then use finishing-a-development-branch to choose the user-authorised integration path. The target repository is the private `NNFall/comod`; do not make it public or enable public Pages while owner media rights remain unconfirmed.

**Step 4: Push and verify the remote**

Push the reviewed branch/commit to `origin` as authorised by the user. Verify with `git ls-remote origin` and `gh repo view NNFall/comod --json url,visibility,defaultBranchRef`. Do not claim a public hosted URL unless a deployment was actually enabled and opened successfully.

**Step 5: Final evidence**

The final report gives the working local URL, branch and commit SHA, remote URL, exact successful verification counts, screenshot paths, direct-source access statement, rights gate, deviations and any still-unverified business facts.
