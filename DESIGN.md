---
name: Komod Landing
description: A warm orange, documentary-led landing for the Samara coffee shop.
colors:
  komod-orange: "#F78B00"
  komod-coral: "#F5433D"
  espresso-ink: "#24140E"
  roasted-brown: "#5A2A18"
  paper-cream: "#FFF3DF"
  paper-light: "#FFF9EF"
  latte-panel: "#F8DFC0"
  line-warm: "#E8CDAA"
typography:
  display:
    fontFamily: "Onest, Arial, sans-serif"
    fontSize: "clamp(3.4rem, 6vw, 6.4rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Onest, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 4.2vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.045em"
  body:
    fontFamily: "Onest, Arial, sans-serif"
    fontSize: "clamp(1rem, 1.15vw, 1.2rem)"
    fontWeight: 430
    lineHeight: 1.45
  label:
    fontFamily: "Onest, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  control: "22px"
  card: "24px"
  panel: "36px"
spacing:
  micro: "8px"
  control: "16px"
  card: "24px"
  section: "clamp(72px, 8vw, 132px)"
components:
  button-primary:
    backgroundColor: "{colors.espresso-ink}"
    textColor: "{colors.paper-light}"
    rounded: "{rounded.control}"
    padding: "16px 24px"
  button-accent:
    backgroundColor: "{colors.komod-orange}"
    textColor: "{colors.espresso-ink}"
    rounded: "{rounded.control}"
    padding: "16px 24px"
  card-paper:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.espresso-ink}"
    rounded: "{rounded.card}"
    padding: "24px"
---

# Design System: Komod Landing

## Overview

**Creative North Star: "The Sunny City Cabinet"**

The page should feel like opening a colourful cabinet in a warm Samara coffee shop: geometric compartments, useful objects, bright orange surfaces and real food photographs. The six supplied screens are the primary visual lane. The implementation preserves their asymmetric editorial energy while replacing AI artefacts with verified content and accessible behaviour.

The palette uses a committed orange strategy. Cream is paper, dark brown is ink, coral is a small secondary spark. Motion is choreographed but tactile: sections reveal in short cascades, sliders glide, buttons compress slightly. Nothing floats without purpose.

**Key Characteristics:**

- asymmetrical split scenes with one dominant photographic idea;
- geometric grotesk Cyrillic typography with tight display tracking;
- cream paper surfaces, warm orange fields and espresso controls;
- circular and clipped coffee motifs used as punctuation, never filler;
- documentary photographs remain visibly distinct from generated derivatives.

## Colors

The orange surface carries the brand; cream and espresso keep it legible and adult.

### Primary

- **Komod Orange:** hero fields, selected chips, slider markers and section accents.
- **Espresso Ink:** display type, primary controls and high-contrast bands.

### Secondary

- **Komod Coral:** sparse decorative beans, status labels and emphasis words.
- **Roasted Brown:** deep tonal sections and secondary ink.

### Neutral

- **Paper Cream:** dominant page background.
- **Paper Light:** readable cards and form surfaces.
- **Latte Panel:** low-contrast information strips.
- **Warm Line:** separators and outlined controls.

**The Orange Commitment Rule.** At least one major scene may be orange-drenched, but coral remains below roughly ten percent of a viewport.

## Typography

**Display Font:** Onest (with Arial fallback)
**Body Font:** Onest (with Arial fallback)

**Character:** One deliberate Cyrillic family makes the reference's geometric headlines and friendly body copy feel related. Weight, tracking and scale create hierarchy without importing an unrelated display serif.

### Hierarchy

- **Display** (800, fluid 3.4–6.4rem, 0.94): hero and large scene statements.
- **Headline** (700, fluid 2.5–4.75rem, 1): section headings.
- **Title** (680, 1.25–1.55rem, 1.1): card titles and key facts.
- **Body** (430, fluid 1–1.2rem, 1.45): descriptions limited to 70ch.
- **Label** (650, 0.875rem, 0.16em): short kickers and tags only.

**The Cyrillic Shape Rule.** Never substitute a Latin-only display face or use faux lettering that breaks Russian text.

## Elevation

Surfaces are flat by default. Depth comes from overlap, warm tonal shifts and photography. Interactive cards receive one ambient, background-tinted lift only on hover; controls use a small inset highlight and no outer glow.

### Shadow Vocabulary

- **Ambient card:** `0 18px 50px rgba(89, 41, 13, 0.11)`, hover and overlapping hero objects only.
- **Control lift:** `0 8px 24px rgba(67, 29, 12, 0.16)`, primary CTA only.

**The Paper-First Rule.** If a box needs a shadow to be understood, its spacing or tonal hierarchy is wrong.

## Components

### Buttons

- **Shape:** compact capsule with controlled curvature (22px), not a generic full pill.
- **Primary:** espresso background, paper text, minimum height 52px.
- **Hover / Focus:** 2px upward transform on hover; 3px orange focus ring with 3px offset; 1px active compression.
- **Accent:** orange background and espresso text for scene-specific actions.

### Chips

- **Style:** light latte surface, dark text, 48px minimum height.
- **State:** selected chip becomes orange; no gradients or glow.

### Cards / Containers

- **Corner Style:** 20–28px depending on scale; hero image masks may use asymmetric 30–60% curves.
- **Background:** paper-light or photography, never nested generic cards.
- **Shadow Strategy:** flat at rest; ambient hover only.
- **Border:** one warm 1px line when needed.
- **Internal Padding:** fluid 20–32px.

### Inputs / Fields

- **Style:** paper-light surface, 1px warm border, 16px radius, label above.
- **Focus:** espresso border plus orange outline.
- **Error / Disabled:** coral text is paired with a sentence; colour is never the only signal.

### Navigation

Desktop navigation is a slim paper header with logo, anchors, location, telephone and booking CTA. Mobile becomes a compact sticky header plus a disclosed menu; the main CTA remains reachable without covering content.

### Scene Frame

Each scene owns a dominant composition at 1672×941, but uses normal document flow. Sections may approach one viewport at desktop, never force content into a clipped fixed height.

## Do's and Don'ts

### Do:

- **Do** compare all six scenes at 1672×941 before treating the visual pass as complete.
- **Do** crop real photographs intentionally and record their exact source URL and media class.
- **Do** keep every motion on transform and opacity and provide a reduced-motion path.
- **Do** recompose cards into a single readable column below 768px.

### Don't:

- **Don't** ship a "Generic AI coffee-shop landing": no beige template, identical icon cards, neon, decorative glass or abstract gradients.
- **Don't** present synthetic interiors or dishes as documentary photographs of «Комод».
- **Don't** copy invented dates, hours, dishes, contacts or inconsistent logos from the AI references.
- **Don't** use gradient text, pure black, side-stripe accents or uncontrolled horizontal overflow.
