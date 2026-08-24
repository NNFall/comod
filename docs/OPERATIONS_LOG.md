# Komod implementation operations log

This is a concise decision/evidence history. It records material actions, not credentials, private tokens or raw browser session data.

## 2026-08-24 — goal and source lock

- Created the explicit goal requiring «ОДИН В ОДИН ДО ПИКСЕЛЕЙ И ВСЕХ МЕЛОЧЕЙ» visual fidelity, responsive QA, independent review and final GitHub push.
- Cloned the private empty `NNFall/comod` origin into the separate `D:\papka for all\work\sites\comod` checkout; the dirty White Cup workspace was not modified.
- Directly inspected all six supplied 1672×941 reference PNGs and locked copies plus SHA-256 hashes under `tests/references/`.
- Directly opened the Yandex organisation card and visually inspected selected exterior, interior and food gallery photographs. Stored an immutable research pack with asset-level URLs and hashes under `source-assets/yandex-2026-08-24/`.
- Direct VK opening was blocked by a non-retryable managed-source error. Search-indexed apparent VK snippets are research leads only, not direct-source confirmation.

## 2026-08-24 — specification and independent review

- Wrote `PRODUCT.md`, `DESIGN.md`, the design specification and the TDD implementation plan.
- Ran independent agents for reference decomposition, architecture/test planning and source/provenance review.
- Started Antigravity read-only audits twice; both terminated before the first model token while the wrapper doctor reported executable, settings and storage healthy. Two bounded diagnostic retries were attempted later and are recorded below.
- Applied review findings: explicit source pack, no-JS fallback, two-step booking without unverified WhatsApp, per-scene visual TDD, CI/default-branch preflight and final evidence commit.

## 2026-08-24 — ImageGen pass 1

- Re-read the Image Generation skill after the user's clarification that source-image edits are expected.
- Generated `public/media/generated-decorative/paper-texture-v1.png` in built-in mode. Prompt intent: seamless warm cream recycled-paper texture; no text, logo, objects, border or vignette. Output: 1254×1254 RGB PNG, SHA-256 `BC39ED6CEB80F9674EF403F9F2C8BD64494A2F0CCB70A18D34A4292C87014779`.
- Generated `public/media/generated-decorative/motif-sheet-v1.png` in built-in mode. Prompt intent: six isolated hand-drawn café motifs in espresso/orange/coral/honey; no words, people, scene or fake logo. Output: 1254×1254 RGBA PNG, SHA-256 `EEF3D35A10D857FDDC306ADF83A8B61813A4BC6665F3FC1772C448BA2D36E450`.
- Both generated originals remain versioned; production use requires visual tile/alpha inspection and manifest classification.

## 2026-08-24 — repository baseline and Task 1

- Pushed root commit `5a7aa5e` to private `origin/main` and verified `main` as the default branch. Implementation remains on `codex/komod-landing`.
- Task 1 followed RED→GREEN: the focused App test first failed on the missing application, then passed after the truthful six-region shell was implemented.
- Fresh local verification: typecheck, ESLint, 1 unit test and production build passed; Chromium smoke and axe accessibility tests passed 2/2.
- Independent specification and code-quality reviewers found cross-platform CI, smoke coverage, accessibility-script and focus-ring gaps. Fixed all four; both reviewers returned PASS on the re-review.

## 2026-08-24 — VK public-source retry

- Direct `vk.ru/komod_samara` and `vk.com/komod_samara` opens again returned non-retryable errors in managed sources.
- A current search-indexed mirror at `https://komod-samara.orgs.biz/` was reachable read-only and exposes apparent VK-origin post text plus `userapi.com` media URLs. This is useful for selection research, but it is not equivalent to direct VK DOM/permalink verification; its inconsistent legacy address fields are excluded from published facts.

## 2026-08-24 — managed-browser VK-origin extraction

- Reopened the public mirror in the managed in-app browser, read its rendered DOM and followed its individual news pages. The pages expose exact VK source permalinks such as `wall-118960395_3561`, `_3558`, `_3540`, `_3537` and `_3515`; direct VK itself remained inaccessible.
- Parsed the dated 2026 archive: 27 April address/weather video, 24 April Coffee Tea Cacao Expo team post, 5 March chicory post, 26 February Lenten-menu videos and 5 January winter entrance post. These are dated archive evidence, not automatically current promotions.
- Visually inspected the initial 20 mirror/gallery candidates and seven full-resolution 2026 `userapi.com` frames. Rejected low-resolution legacy-gallery images, obvious old-location imagery and people-led expo frames for the production composition. Selected only a high-resolution real cup frame and a high-resolution current-address winter storefront frame for the provenance pack, both still gated by owner approval.
- Rejected the mirror's legacy `Костюкова, 69` metadata and messenger links. The current address remains sourced from Yandex and the dated VK-origin posts that explicitly say `Галактионовская, 130`.

## 2026-08-24 — ImageGen documentary-edit audit

- Ran three separate image-to-image passes on the real exterior, interior and breakfast originals. Every prompt prohibited object, person, signage, geometry, ingredient and portion changes and requested only restrained colour/crop work.
- The outputs improved contrast and composition but reconstructed material details: small facade/people/signage details, lamp/menu-board/employee details and food/portion geometry. All three were rejected from production and remain outside the repository; hashes and reasons are recorded in `docs/IMAGEGEN.md`.
- This is the explicit safety boundary: a pleasant AI reconstruction is not a documentary photograph. The site uses the unchanged originals for venue evidence and labels any later accepted transform separately.

## 2026-08-24 — local background-removal comparison

- Ran `remove-background-local` on the real `big-breakfast.webp` with `soft` and `0.30`, then inspected both checkerboard previews. `soft` preserved the plate/food edge; `0.30` cut holes near the bowl/food and was rejected.
- Ran the same comparison on `coffee-cup.webp`. Both preserved the cup, saucer, handle and spoon; `0.30` produced the cleaner edge and was selected for the later derived-assets pass.
- No cutout was copied into production before provenance registration. The selected outputs stay in the skill output directory until Task 9 adds them as `documentary-derived` assets.

## 2026-08-24 — Antigravity retries

- The third analysis attempt failed before model execution because `gemini-3.7-flash-high` does not accept `low` effort. This was a configuration error with zero model tokens, not a review result.
- The fourth and final bounded analysis retry also failed before model execution: the installed Antigravity profile rejects `medium` effort for `gemini-3.7-flash-high`. It consumed zero model tokens and produced no review result. The four-job skill limit is now exhausted, so no Antigravity conclusion is used as evidence.

## 2026-08-24 — responsive form and navigation hardening

- Independent contacts review found real mobile overflow, fixed-height booking overflow, focus loss between form steps, missing required semantics, low contrast and missing intrinsic media dimensions. The form now grows for validation/summary states, focuses the first invalid field or summary status, exposes live errors, keeps the booking action explicitly local (copy-and-call, no submission endpoint), and has no unsupported guest maximum.
- Browser review is green at 1672, 390 and 320 px: no visible clipped content, `document.documentElement.scrollWidth === clientWidth`, no runtime errors, focus transitions `body → Дата → Имя → status → Имя`, and contrast ratios 6.01:1 / 5.28:1.
- Mobile disclosure scroll-jump was traced to font/layout settling plus `body { overflow: hidden }` and the fixed-header override. The header remains sticky, background locking uses `overflow: clip`, and navigation tests wait for `document.fonts.ready` before measuring scroll preservation.

## 2026-08-24 — final visual QA snapshot

- The locked visual harness was run in Chromium at 1672×941 with reduced motion, decoded local media, provenance/hash checks and exact geometry guides. Required media, swatches, map routes and scene geometry pass; the raw UI mismatch remains intentional because supplied screens contain synthetic/reference-specific copy, decoration and image compositions while the implementation preserves verified venue facts and visible caveats.
- Latest raw pixel ratios: hero 14.98%, events 13.84%, contacts 9.64%, about 15.79%, work 14.22%, breakfasts 15.96%. These are reported rather than hidden by weakening masks. Work/about typography was tuned to the locked composition while retaining truthful copy; contacts matches the locked geometry and accessibility gates.

## 2026-08-24 — scroll reveal and final handoff evidence

- Connected the tested `Reveal` primitive to the key copy blocks in all six production scenes (hero, breakfasts, work, about, events, contacts). Reduced motion remains immediately visible, so locked geometry and accessibility snapshots do not shift; normal motion gets IntersectionObserver-driven reveal alongside hover and carousel transitions.
- Added final handoff artifacts: `README.md`, `docs/QA.md`, `docs/REVIEW.md`, `docs/FINAL_REPORT.md`, and `docs/evidence/README.md`. They record exact commands, viewport evidence paths, source-access boundaries, generated/documentary separation, intentional pixel-contract RED status, and implementation deviations.
- Fresh post-change unit suite remains 16 files / 81 tests green. Browser smoke/navigation/axe remains 5/5 green; no-overflow/runtime probe remains green at 1920, 1672, 390 and 320 px.
- The post-reveal visual rerun retained the same intentional RED contract: hero 14.98%, events 13.83%, contacts 9.62%, about 15.80%, work 14.24%, breakfasts 15.95%; geometry, provenance and map checks still pass.
