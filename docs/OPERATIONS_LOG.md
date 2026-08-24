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
- Started Antigravity read-only audits twice; both terminated before the first model token while the wrapper doctor reported executable, settings and storage healthy. A later diagnostic retry remains scheduled.
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
