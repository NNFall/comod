# Image generation and image-editing log

This log separates generated decoration, rejected AI reconstructions and locally derived documentary cutouts. A generated or AI-reconstructed frame is never presented as unchanged evidence of the cafe.

## Accepted generated decoration

### `paper-texture-v1.png`

- Input: text-only generation; no reference image.
- Prompt intent: a seamless warm cream recycled-paper texture with subtle fibres and speckles, no objects, text, logo, border or vignette.
- Output: 1254×1254 RGB PNG.
- SHA-256: `BC39ED6CEB80F9674EF403F9F2C8BD64494A2F0CCB70A18D34A4292C87014779`.
- Decision: accepted as `generated-decorative`; it does not depict the venue.

### `motif-sheet-v1.png`

- Input: text-only generation; no reference image.
- Prompt intent: six isolated hand-drawn cafe motifs in espresso, orange, coral, honey and cream, transparent background, no words, people, scene or fake logo.
- Output: 1254×1254 RGBA PNG.
- SHA-256: `EEF3D35A10D857FDDC306ADF83A8B61813A4BC6665F3FC1772C448BA2D36E450`.
- Decision: accepted as `generated-decorative`; individual motifs may be cropped mechanically without changing their pixels.

## Rejected documentary image-to-image passes

The following files remain in the Codex generated-image archive and are deliberately not copied into `public/`.

### Exterior colour grade / extension

- Input: `public/media/documentary/originals/exterior-wide.webp`.
- Prompt constraints: preserve exact building geometry, storefront, Cyrillic sign, adjacent signs, windows, doors, trees, bicycles, terrace, flags and people; only warm colour grade and safe extension of empty texture.
- Output: 1586×992 PNG, SHA-256 `DD4FF24C57B4C3DD50E8DB241079CDF5CBB8B54FB7C0CCB5909F43654FBA7E71`.
- Decision: rejected. The model reconstructed fine facade, person and signage detail despite the constraints.

### Interior colour grade / crop recovery

- Input: `public/media/documentary/originals/interior-wide.webp`.
- Prompt constraints: preserve room perspective, exact furniture, lamp count, ducts, floor, counter, boards, employee and lettering; only restrained highlight/shadow and colour treatment.
- Output: 1672×941 PNG, SHA-256 `35E5F07DEC12DCD144B66CC593E646D619649FFD4B6BFFA8AD909B7865D6BF41`.
- Decision: rejected for documentary use. It is visually strong, but menu-board, lamp, employee and small furnishing pixels were reconstructed.

### Breakfast colour grade / breathing room

- Input: `public/media/documentary/originals/big-breakfast.webp`.
- Prompt constraints: preserve the exact plate, sausages, waffles, eggs, bacon, avocado mixture, sauce cup, drink, tray, portions and arrangement; no invented garnish or rearrangement.
- Output: 1450×1085 PNG, SHA-256 `DE8090F78870F30B398CBDF74BAFBDB7E9E4043F1C04E0BA822336D045A9B308`.
- Decision: rejected. Bacon, sausage and other food geometry changed enough to make the output an unreliable depiction of the photographed serving.

## Remove Background Local comparison

### Breakfast plate

- Input: unchanged `big-breakfast.webp`.
- `soft`: accepted candidate; plate and food were preserved with a natural soft edge.
- `0.30`: rejected; visible holes/over-cutting appeared around the bowl and food edge.
- Planned class if used: `documentary-derived`, with background-removal-only disclosure.

### Coffee cup

- Input: unchanged `coffee-cup.webp`.
- `soft`: acceptable but slightly hazier edge.
- `0.30`: selected candidate; cup, latte art, saucer, handle and spoon remained intact with the cleaner edge.
- Planned class if used: `documentary-derived`, with background-removal-only disclosure.

## Acceptance rule

An edit is accepted only when side-by-side inspection shows no invented or removed documentary subject matter. If AI changes the photographed venue, person, wording, food or portion, the result is rejected or used only as clearly labelled non-documentary illustration. Colour-only and background-removal transforms retain the immutable original and receive a new ID, hash and transformation note.
