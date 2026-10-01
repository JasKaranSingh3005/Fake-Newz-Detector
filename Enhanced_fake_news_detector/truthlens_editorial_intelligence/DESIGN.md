---
name: TruthLens Editorial Intelligence
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f6'
  surface-container: '#f1edf0'
  surface-container-high: '#ebe7ea'
  surface-container-highest: '#e5e1e5'
  on-surface: '#1c1b1e'
  on-surface-variant: '#46464d'
  inverse-surface: '#313033'
  inverse-on-surface: '#f3eff3'
  outline: '#76767e'
  outline-variant: '#c6c6ce'
  surface-tint: '#565d79'
  primary: '#545b77'
  on-primary: '#ffffff'
  primary-container: '#6c7390'
  on-primary-container: '#fffbff'
  inverse-primary: '#bec5e5'
  secondary: '#5c5e6a'
  on-secondary: '#ffffff'
  secondary-container: '#e0e1f0'
  on-secondary-container: '#626470'
  tertiary: '#6b546f'
  on-tertiary: '#ffffff'
  tertiary-container: '#856c89'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#bec5e5'
  on-primary-fixed: '#131a33'
  on-primary-fixed-variant: '#3f4660'
  secondary-fixed: '#e0e1f0'
  secondary-fixed-dim: '#c4c5d4'
  on-secondary-fixed: '#181b26'
  on-secondary-fixed-variant: '#444652'
  tertiary-fixed: '#f7d9fa'
  tertiary-fixed-dim: '#dabddd'
  on-tertiary-fixed: '#27142c'
  on-tertiary-fixed-variant: '#553f59'
  background: '#fcf8fb'
  on-background: '#1c1b1e'
  surface-variant: '#e5e1e5'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  headline-sm:
    fontFamily: Newsreader
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system establishes an authoritative investigative intelligence environment tailored for rigorous newsroom verification, fact-checkers, and data journalists. Merging the restrained elegance of classic broadsheet investigative journalism (ProPublica, Financial Times) with the analytical telemetry of digital forensic labs, the aesthetic prioritizes unshakeable veracity, deliberate pacing, and cognitive clarity.

The interface communicates institutional trust through deep editorial contrast, tactile paper-white document surfaces, meticulous hairline borders, and monospaced diagnostic readouts. Surfaces evoke an archival dossier desk: calm, structured, and free of superficial decoration. Visual cues, color highlights, and micro-interactions serve exclusively to direct attention toward evidence, source chains, confidence metrics, and algorithmic consensus.

## Colors
The palette balances muted content slate tones with warm document whites and specialized forensic indicators:

- **Primary (`#6F7693`) & Secondary (`#747683`)**: Balanced archival slate tones reserved for primary brand anchors, top-level navigation masts, critical button states, and deep framing elements.
- **Paper Canvas & Surfaces**: Crisp archival background (`#F8FAFC`) paired with elevated document cards (`#FFFFFF`) and contextual drawer sheets (`#F1F5F9`).
- **Dividers & Structural Borders**: Subtle warm slate rules (`#E2E8F0` and `#CBD5E1`) creating calibrated separation reminiscent of ruled newspaper columns and dossier cards.
- **Verification Green (`#059669`)**: Indicates verified claims, high source reliability, and model consensus exceeding 85%.
- **Warning Amber (`#D97706`)**: Applied to unverifiable contexts, biased phrasing, missing attribution, or divergent model signals.
- **High-Alert Crimson (`#DC2626`)**: Dictates confirmed falsehoods, fabricated quotes, synthetic media signatures, and flagged provenance chains.
- **Textual Telemetry Slate (`#475569`, `#64748B`)**: Secondary metadata, timestamps, model identifiers, and algorithmic confidence percentages.

## Typography
The typographic hierarchy implements a high-contrast editorial pairing:

1. **Editorial Headlines (`Newsreader`)**: Conveys classical journalistic tradition, intellectual weight, and documentary gravitas. Used for investigative titles, claim headers, and major section partitions.
2. **Analysis Body (`Inter`)**: A neutral, highly readable grotesque engine for ingested source copy, long-form editorial summaries, and contextual fact-checking breakdowns.
3. **Data Telemetry & Metrics (`JetBrains Mono`)**: Provides strict structural cadence for confidence scores, probability indexes, algorithmic flags, timestamps, and model agreement matrices.

## Layout & Spacing
The layout follows an asymmetric 12-column editorial grid structured around investigative reading habits:
- **Canvas Shell**: A fixed top telemetry bar (48px) anchor with a continuous master column and a primary inspection zone.
- **Main Viewport Distribution**: An 8-column primary workbench (for textual annotation, ingested URL feeds, and side-by-side linguistic breakdown) paired with a 4-column forensic telemetry rail (credibility scorecards, source lineage, model breakdown).
- **Responsive Adaptations**:
  - **Desktop (>= 1280px)**: 12 columns, 24px gutters, dual-pane simultaneous analysis (Document Stream + Model Telemetry).
  - **Tablet (768px - 1279px)**: 8 columns, 16px gutters; telemetry collapses into a tabbed secondary drawer or bottom dock.
  - **Mobile (< 768px)**: 4 columns, 16px margins; dynamic toggling between "Article Inspection" and "Confidence Dossier".

## Elevation & Depth
Elevation eschews dramatic dropshadows and bright glows in favor of quiet, printed tactile layers:

- **Border-First Architecture**: Surfaces rely on crisp 1px borders (`#E2E8F0` on light, `#334155` on dark segments) creating clean partition planes akin to structured newsprint boxes.
- **Tonal Stepping**: 
  - Canvas: Base tone `#F8FAFC`.
  - Level 1 (Dossier Panes & Panels): Pure `#FFFFFF` with hairline outline.
  - Level 2 (Inspection Drawers & Popovers): `#FFFFFF` accompanied by an ultra-subtle diffuse ambient shadow (`0 4px 20px -2px rgba(11, 19, 43, 0.06)`).
  - Level 3 (Modal Verdicts & Telemetry Overlays): `#FFFFFF` with a distinct hairline border and a weighted archival drop (`0 12px 32px -4px rgba(11, 19, 43, 0.12)`).
- **Surface Inset**: Data matrices and code telemetry blocks utilize a -1 step recessed surface (`#F1F5F9`) with inset hairline borders for data grounding.

## Shapes
Shapes remain disciplined, sharp, and utilitarian (`roundedness: 1`). 

- Default elements (buttons, inputs, status tags, panels) utilize a 4px (`0.25rem`) corner radius to maintain an architectural, editorial print aesthetic.
- Forensic chips and small data pills utilize 2px or 4px micro-radii to emulate printed indexing tabs.
- Large structural cards and drawer overlays cap at 8px (`0.5rem`), ensuring elements never appear toy-like or consumer-casual.

## Components

### Dual-Mode Ingestion Bar
- Houses the toggle between **URL Wire Fetch** and **Raw Copy Ingestion**.
- Contained in an enclosed hairline pill housing; active state features a solid `#6F7693` background with crisp white typography.
- Input elements feature monospaced prompt markers (`$ fetch://`) with inline parsing spinners and instantaneous scrape telemetry badges.

### Textual Claim Highlight Annotations
- Highlight layers directly rendered into ingested source copy:
  - **Fabrication / Falsehood**: `#FEE2E2` background with `#DC2626` bottom border (1.5px solid) and inline indicator pill (`[FALSE #1]`).
  - **Unverified / Disputed**: `#FEF3C7` background with `#D97706` dotted under-rule.
  - **Corroborated Fact**: `#ECFDF5` background with `#059669` hairline bounding highlight.
- Hovering or focusing an annotation triggers an editorial inspection flyout displaying specific counter-evidence citations and sentiment anomalies.

### Multi-Model Agreement Matrix
- Structured 3-tier comparative grid displaying inference results from:
  1. **Logistic Regression** (Baseline Linguistic Weight)
  2. **Random Forest** (Stylometric & Feature Trees)
  3. **Passive Aggressive Classifier** (Real-Time News Stream Sentiment Drift)
- Each row renders: Model Label (`label-md`), Confidence Bar (segmented tick markers), Latency Metric (`ms`), and Discrete Binary Verdict badge.

### Credibility Gauge & Scorecards
- Radial or horizontal calibrated telemetry bar ranging from 0 to 100 Index Points:
  - 0–39: Critical Alert (Crimson)
  - 40–69: Contested / Low Integrity (Amber)
  - 70–100: Verified Corroboration (Emerald)
- Accompanied by sub-metric breakdowns: Domain Authority, Bias Vector, and Source Depth.

### Buttons & Inputs
- **Primary Action**: Primary Slate (`#6F7693`) fill, white text, 4px corner radius, hover state shifts to `#747683` with a precise 1px inset hairline highlight.
- **Secondary / Forensic Action**: White background, 1px border (`#CBD5E1`), `#6F7693` text, hover shifts to `#F1F5F9`.
- **Text Inputs**: Crisp `#FFFFFF` canvas, 1px `#CBD5E1` border, transitioning to 1px `#6F7693` with zero fuzzy focus rings (utilizing an offset 1px crisp outline).

### Status Badges & Chips
- Constructed with `label-sm` monospaced type, 2px corner radius, uppercase tracking.
- Bordered presentation: 1px border tinted to match the specific status hue (e.g., Red Border `#FCA5A5`, Background `#FEF2F2`, Text `#991B1B`).