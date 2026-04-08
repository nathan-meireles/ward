# NOTREGLR Design System Reference
## Based on AIOX Squad Brandbook v2.0 — Gold Edition (Dark Cockpit)

> **NOTREGLR uses the Gold Edition theme.** Wherever AIOX uses lime `#D1FF00`, NOTREGLR substitutes gold `#DDD1BB`.
> Every section below notes both the original AIOX Lime value and the NOTREGLR Gold equivalent.

---

## Source URLs

All specifications extracted from:

1. https://brand.aioxsquad.ai/brandbook/navigation
2. https://brand.aioxsquad.ai/brandbook/effects
3. https://brand.aioxsquad.ai/brandbook/patterns
4. https://brand.aioxsquad.ai/brandbook/templates
5. https://brand.aioxsquad.ai/brandbook/buttons
6. https://brand.aioxsquad.ai/brandbook/forms
7. https://brand.aioxsquad.ai/brandbook/feedback
8. https://brand.aioxsquad.ai/brandbook/lp-sections
9. https://brand.aioxsquad.ai/brandbook/states
10. https://brand.aioxsquad.ai/brandbook/tables
11. https://brand.aioxsquad.ai/brandbook/lists
12. https://brand.aioxsquad.ai/brandbook/charts
13. https://brand.aioxsquad.ai/brandbook/cards
14. https://brand.aioxsquad.ai/brandbook/components
15. https://brand.aioxsquad.ai/brandbook/sections
16. https://brand.aioxsquad.ai/brandbook/flow-diagram
17. https://brand.aioxsquad.ai/brandbook/advanced
18. https://brand.aioxsquad.ai/brandbook/surfaces
19. https://brand.aioxsquad.ai/brandbook/token-export
20. https://brand.aioxsquad.ai/brandbook/vfx
21. https://brand.aioxsquad.ai/brandbook/seo
22. https://brand.aioxsquad.ai/brandbook/foundations
23. https://brand.aioxsquad.ai/brandbook/color-tokens
24. https://brand.aioxsquad.ai/brandbook/typography
25. https://brand.aioxsquad.ai/brandbook/spacing-layout
26. https://brand.aioxsquad.ai/brandbook/motion
27. https://brand.aioxsquad.ai/brandbook/semantic-tokens
28. https://brand.aioxsquad.ai/brandbook/moodboard
29. https://brand.aioxsquad.ai/brandbook/guidelines
30. https://brand.aioxsquad.ai/brandbook/icons

---

## 1. COMPLETE TOKEN SYSTEM (CSS Variables)

### 1.1 Theme: Gold Edition (NOTREGLR)
*Source: https://brand.aioxsquad.ai/brandbook/token-export + https://brand.aioxsquad.ai/brandbook/color-tokens*

```css
:root {
  /* ── ACCENT ── */
  --bb-lime:                #DDD1BB;          /* Gold accent — NOTREGLR primary */
  --bb-flare:               #C4B7A2;          /* Warm support accent */
  --bb-blue:                oklch(0.669 0.1837 248.81);  /* Info accent #0099FF */
  --bb-error:               #EF4444;          /* Destructive state */
  --warning:                #F59E0B;

  /* ── SURFACE STACK ── */
  --bb-canvas:              #09090A;          /* Document canvas / page bg */
  --bb-dark:                #121213;          /* Dark shell */
  --bb-surface:             #151517;          /* Primary elevated surface (cards, panels) */
  --bb-surface-alt:         #1D1D20;          /* Secondary/nested surface */
  --bb-surface-panel:       #18181B;          /* Sidebar panels, nav drawers */
  --bb-surface-console:     #222225;          /* Terminal/console backgrounds */
  --bb-surface-overlay:     rgba(15,15,17,0.92); /* Transparent modal overlays */
  --bb-surface-hover-strong: #28282C;         /* Strong hover / selection */

  /* ── TEXT & READING ── */
  --bb-cream:               #F4F4F4;          /* Primary text */
  --bb-cream-alt:           #E8E8E8;          /* Soft alternate */
  --bb-warm-white:          #FFFFFF;          /* Maximum contrast */
  --bb-dim:                 rgba(244,244,244,0.52);  /* Muted/secondary text */
  --bb-muted:               #DDDDDD;          /* Soft neutral */
  --bb-meta:                #AFAFAF;          /* Metadata color */

  /* ── NEUTRAL SCALE ── */
  --bb-gray-charcoal:       #313131;
  --bb-gray-dim:            #484848;
  --bb-gray-muted:          #6E6E6E;
  --bb-gray-silver:         #919191;
  --bb-muted-legacy:        #919191;

  /* ── BORDER SYSTEM ── */
  --bb-border:              rgba(255,255,255,0.09);   /* Default subtle borders */
  --bb-border-soft:         rgba(255,255,255,0.05);   /* Softest border */
  --bb-border-strong:       rgba(255,255,255,0.15);   /* High-contrast borders */
  --bb-border-hover:        rgba(255,255,255,0.18);   /* Interactive hover border */
  --bb-border-input:        rgba(255,255,255,0.12);   /* Form input borders */

  /* ── GLASS & BLUR ── */
  --glass-blur:             blur(10px);       /* Standard glass (nav, modals) */
  --glass-blur-soft:        blur(5px);        /* Subtle glass (tooltips, popovers) */

  /* ── BORDER RADIUS SCALE ── */
  --radius:                 0.5rem;           /* 8px — base */
  --radius-sm:              4px;
  --radius-md:              8px;
  --radius-lg:              12px;
  --radius-xl:              16px;
  --radius-2xl:             24px;
  --radius-full:            9999px;           /* Pill / circular */

  /* ── FONT FAMILIES ── */
  --font-sans:              "Geist", "Inter", system-ui, sans-serif;
  --font-mono:              "Geist Mono", "Roboto Mono", monospace;
  --font-bb-display:        "TASA Orbiter Black", "Tasa Orbiter Display", serif;
  --font-bb-sans:           "Geist", system-ui, sans-serif;
  --font-bb-mono:           "Roboto Mono", monospace;

  /* ── FONT WEIGHTS ── */
  --font-weight-thin:       300;
  --font-weight-regular:    400;
  --font-weight-medium:     500;
  --font-weight-semibold:   600;
  --font-weight-bold:       700;
  --font-weight-extrabold:  800;
  --font-weight-black:      900;

  /* ── SPACING: SEMANTIC ── */
  --spacing-xs:             0.5rem;   /* 8px */
  --spacing-sm:             1rem;     /* 16px */
  --spacing-md:             2rem;     /* 32px */
  --spacing-lg:             3rem;     /* 48px */
  --spacing-xl:             4rem;     /* 64px */
  --bb-gutter:              clamp(1rem, 3vw, 2rem);  /* Responsive page gutter */

  /* ── SPACING: NUMERIC SCALE ── */
  --space-0:   0px;
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   15px;
  --space-5:   20px;
  --space-6:   30px;
  --space-7:   40px;
  --space-8:   60px;
  --space-9:   80px;
  --space-10:  90px;
  --space-11:  120px;
  --space-12:  150px;
  --space-13:  180px;

  /* ── Z-INDEX STACK ── */
  --layer-nav:        100;
  --layer-dropdown:   200;
  --layer-overlay:    300;
  --layer-modal:      400;
  --layer-toast:      500;

  /* ── BREAKPOINTS ── */
  --bp-mobile:    767px;
  --bp-tablet:    768px;
  --bp-desktop:   1200px;

  /* ── MOTION/EASING ── */
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth:  cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-decel:   cubic-bezier(0, 0, 0.2, 1);
}
```

### 1.2 shadcn/ui Component Library Mapping (Gold Theme)
*Source: https://brand.aioxsquad.ai/brandbook/token-export + https://brand.aioxsquad.ai/brandbook/semantic-tokens*

```css
:root {
  /* shadcn/ui token → NOTREGLR Gold resolved value */
  --background:         #09090A;                     /* --bb-canvas */
  --foreground:         #F4F4F4;                     /* --bb-cream */
  --card:               #151517;                     /* --bb-surface */
  --card-foreground:    #F4F4F4;                     /* --bb-cream */
  --popover:            #151517;                     /* --bb-surface */
  --popover-foreground: #F4F4F4;                     /* --bb-cream */
  --primary:            #DDD1BB;                     /* Gold accent */
  --primary-foreground: #121213;                     /* --bb-dark */
  --secondary:          #1D1D20;                     /* --bb-surface-alt */
  --muted:              #18181B;                     /* --bb-surface-panel */
  --muted-foreground:   rgba(244,244,244,0.52);      /* --bb-dim */
  --accent:             rgba(221,209,187,0.1);       /* Gold at 10% */
  --accent-foreground:  #DDD1BB;                     /* Gold accent */
  --destructive:        #EF4444;                     /* --bb-error */
  --border:             rgba(255,255,255,0.09);      /* --bb-border */
  --input:              rgba(255,255,255,0.12);      /* --bb-border-input */
  --ring:               rgba(221,209,187,0.4);       /* Gold at 40% focus ring */
  --radius:             0.5rem;
}
```

### 1.3 Semantic Color Tokens
*Source: https://brand.aioxsquad.ai/brandbook/semantic-tokens*

```css
:root {
  /* ── SEMANTIC BACKGROUNDS ── */
  --color-bg-void:         #000000;                  /* Absolute black overlays */
  --color-bg-base:         #09090A;                  /* Page background */
  --color-bg-surface:      #151517;                  /* Cards, panels */
  --color-bg-surface-alt:  #1D1D20;                  /* Nested cards */
  --color-bg-elevated:     #1D1D20;                  /* Alias for surface-alt */
  --color-bg-overlay:      rgba(61,61,61,0.5);       /* Modal backdrop */

  /* ── SEMANTIC TEXT ── */
  --color-text-base:       rgb(244,244,244);         /* Primary text */
  --color-text-secondary:  rgba(244,244,244,0.7);    /* Descriptions */
  --color-text-tertiary:   rgba(244,244,244,0.55);   /* Metadata */
  --color-text-muted:      rgba(244,244,244,0.4);    /* Dim labels */

  /* ── GLOW / NEON (Gold edition) ── */
  --neon:                  #DDD1BB;                  /* Brand accent = --bb-lime Gold */
  --neon-dim:              rgba(221,209,187,0.15);   /* Subtle tint for backgrounds */
  --neon-glow:             rgba(221,209,187,0.4);    /* Strong glow, active focus */
  --lime-glow:             rgba(221,209,187,0.25);   /* Box-shadow glow on CTAs */
  --lime-glow-soft:        rgba(221,209,187,0.1);    /* Soft glow on hover */

  /* ── INTERACTIVE STATES ── */
  --focus-brand:           #DDD1BB;                  /* Focus ring on brand elements */
  --focus-neutral:         #BDBDBD;                  /* Focus ring on neutral */
  --selection-bg:          #09090A;                  /* Text selection background */
  --selection-fg:          #DDD1BB;                  /* Text selection foreground */
  --warning-bg:            rgba(245,158,11,0.05);    /* Warning state bg */
  --warning-border:        rgba(245,158,11,0.2);     /* Warning state border */
}
```

### 1.4 Gold Accent Opacity Ladder
*Source: https://brand.aioxsquad.ai/brandbook/color-tokens*

```css
/* rgba(221, 209, 187, X) — use these for tints/overlays */
--bb-accent-02:  rgba(221,209,187,0.02);
--bb-accent-04:  rgba(221,209,187,0.04);
--bb-accent-05:  rgba(221,209,187,0.05);
--bb-accent-06:  rgba(221,209,187,0.06);
--bb-accent-08:  rgba(221,209,187,0.08);
--bb-accent-10:  rgba(221,209,187,0.1);   /* accent CSS token */
--bb-accent-12:  rgba(221,209,187,0.12);
--bb-accent-15:  rgba(221,209,187,0.15);
--bb-accent-20:  rgba(221,209,187,0.2);
--bb-accent-25:  rgba(221,209,187,0.25);
--bb-accent-40:  rgba(221,209,187,0.4);   /* ring CSS token */
--bb-accent-50:  rgba(221,209,187,0.5);
--bb-accent-75:  rgba(221,209,187,0.75);
--bb-accent-90:  rgba(221,209,187,0.9);
```

### 1.5 Original AIOX Lime Theme (Reference Only)
*Source: https://brand.aioxsquad.ai/brandbook/token-export — DO NOT use for NOTREGLR*

```
Lime accent:  #D1FF00
Background:   #050505
Surface:      #0F0F11
Secondary:    #1C1E19
Border:       rgba(156,156,156,0.15)
Ring:         rgba(209,255,0,0.4)
```

---

## 2. TYPOGRAPHY
*Source: https://brand.aioxsquad.ai/brandbook/typography + https://brand.aioxsquad.ai/brandbook/guidelines*

### 2.1 Font Families

| Role | Family | Weight | CSS Variable |
|------|--------|--------|-------------|
| Display/Headlines | TASA Orbiter Black | 800–900 | `--font-bb-display` |
| Body/UI | Geist | 400–700 | `--font-bb-sans` |
| Technical/Labels | Roboto Mono | 400–500 | `--font-bb-mono` |

**Loading (Tasa Orbiter Display):**
```html
<link rel="preconnect" href="https://fonts.cdnfonts.com" />
<link href="https://fonts.cdnfonts.com/css/tasa-orbiter-display" rel="stylesheet" />
```

### 2.2 Type Scale

| Token | Size | Weight | Letter-spacing | Line-height | Transform | Use |
|-------|------|--------|----------------|-------------|-----------|-----|
| Display | `clamp(4rem, 10vw, 8rem)` | 800 | `-0.03em` | 1 | uppercase | Impact / hero |
| H1 | `2.5rem` | 800 | `-0.03em` | 1 | uppercase | Page titles |
| H2 | `1.5rem` | 800 | standard | 1 | uppercase | Section titles |
| Body | `1rem` | 400–700 | standard | relaxed | — | Primary text |
| Small | `0.8rem` | 400–500 | standard | relaxed | — | Descriptions |
| Label | `0.65rem` | 500 | `0.1em–0.12em` | 1 | uppercase | HUD, nav |
| Micro | `0.6rem` | 500 | `0.08em` | 1 | uppercase | Footer metadata |

**Responsive Display Scaling:**
```css
font-size: clamp(1.5rem, 4vw, 2.5rem);  /* fluid heading */
font-size: clamp(4rem, 10vw, 8rem);     /* display/hero */
font-size: clamp(2.2rem, 7vw, 6.5rem);  /* LP headline */
```

### 2.3 Typography Rules

```css
/* Display / H1 pattern */
.display-text {
  font-family: var(--font-bb-display);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  text-transform: uppercase;
  color: var(--bb-cream);
}

/* Mono label pattern */
.label-mono {
  font-family: var(--font-bb-mono);
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--bb-meta);
}

/* LP mono label */
.lp-label {
  font-size: 10px;   /* or 11px */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;  /* to 0.2em */
}
```

---

## 3. SPACING & LAYOUT
*Source: https://brand.aioxsquad.ai/brandbook/spacing-layout + https://brand.aioxsquad.ai/brandbook/templates*

### 3.1 Spacing Scale (Quick Reference)

```
Micro UI (space-0 to space-3):   0 / 4px / 8px / 12px
Components (space-4 to space-6): 15px / 20px / 30px
Sections (space-7 to space-11):  40px / 60px / 80px / 90px / 120px
Editorial (space-12 to space-13): 150px / 180px
```

### 3.2 Grid Patterns

```css
/* Dashboard Bento Grid (4-column) */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;         /* hairline border reveal */
  background-color: var(--bb-border);  /* fills the 1px gaps */
}
.bento-grid > * { background: var(--bb-surface); }

/* Responsive auto-fit grid */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1px;
}

/* LP content grid */
.lp-grid-2 { grid-template-columns: repeat(2, 1fr); }
.lp-grid-3 { grid-template-columns: repeat(3, 1fr); }
.lp-grid-4 { grid-template-columns: repeat(4, 1fr); }
/* + minmax(280px-320px, 1fr) for responsive versions */
```

### 3.3 Container

```css
.container {
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: var(--bb-gutter, 2rem);
}

/* Section padding */
.section { padding-block: 6rem 8rem; }      /* py-24 md:py-32 */
.section--sm { padding-block: 3rem; }
```

### 3.4 Breakpoints

```css
/* Mobile-first */
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1200px) { /* desktop */ }

/* Tailwind equivalents: sm: md: xl: */
```

---

## 4. COLOR PALETTE (FULL)
*Source: https://brand.aioxsquad.ai/brandbook/color-tokens*

### 4.1 NOTREGLR Gold Theme — Complete Color Table

| Token | Gold Value | Lime Original | Purpose |
|-------|-----------|---------------|---------|
| `--bb-lime` (accent) | `#DDD1BB` | `#D1FF00` | Primary brand accent |
| `--bb-flare` | `#C4B7A2` | `#ED4609` | Warm support |
| `--bb-blue` | `#0099FF` | `#0099FF` | Info / links |
| `--bb-error` | `#EF4444` | `#EF4444` | Destructive |
| `--warning` | `#F59E0B` | `#F59E0B` | Warning |
| `--bb-canvas` | `#09090A` | `#050505` | Page background |
| `--bb-dark` | `#121213` | `#050505` | Dark shell |
| `--bb-surface` | `#151517` | `#0F0F11` | Cards, panels |
| `--bb-surface-alt` | `#1D1D20` | `#1C1E19` | Nested cards |
| `--bb-surface-panel` | `#18181B` | `oklch(0.1785...)` | Sidebar |
| `--bb-surface-console` | `#222225` | `oklch(0.184...)` | Terminal |
| `--bb-surface-hover-strong` | `#28282C` | `oklch(0.1971...)` | Hover state |
| `--bb-cream` | `#F4F4F4` | `oklch(0.9639 0.0158 106.69)` | Primary text |
| `--bb-cream-alt` | `#E8E8E8` | `oklch(0.9644 0.0172 103.15)` | Soft alternate |
| `--bb-warm-white` | `#FFFFFF` | `oklch(0.9952...)` | Max contrast |
| `--bb-dim` | `rgba(244,244,244,0.52)` | `rgba(245,244,231,0.4)` | Muted text |
| `--bb-muted` | `#DDDDDD` | `oklch(0.7952 0 0)` | Neutral soft |
| `--bb-meta` | `#AFAFAF` | `oklch(0.6927 0 0)` | Metadata |
| `--bb-gray-charcoal` | `#313131` | `oklch(0.36 0 0)` | Heavy neutral |
| `--bb-gray-dim` | `#484848` | `oklch(0.5208 0 0)` | Mid dark |
| `--bb-gray-muted` | `#6E6E6E` | `oklch(0.683 0 0)` | Muted support |
| `--bb-gray-silver` | `#919191` | `oklch(0.7984 0 0)` | Light neutral |

---

## 5. SURFACES & BORDERS
*Source: https://brand.aioxsquad.ai/brandbook/surfaces*

### Elevation System

```
Level 0: --bb-canvas     (#09090A)  — page background
Level 1: --bb-dark       (#121213)  — dark shell
Level 2: --bb-surface    (#151517)  — cards, panels (primary elevation)
Level 3: --bb-surface-alt (#1D1D20) — nested/secondary elevation
Level 4: --bb-surface-panel (#18181B) — sidebars, drawers
Level 5: --bb-surface-console (#222225) — terminal/code blocks
Level 6: --bb-surface-hover-strong (#28282C) — interactive hover highlight
```

### Border Usage

```css
/* Default divider */
border: 1px solid var(--bb-border);          /* rgba(255,255,255,0.09) */

/* Form inputs */
border: 1px solid var(--bb-border-input);    /* rgba(255,255,255,0.12) */

/* Hover state */
border-color: var(--bb-border-hover);        /* rgba(255,255,255,0.18) */

/* High-contrast section */
border: 1px solid var(--bb-border-strong);   /* rgba(255,255,255,0.15) */

/* Hairline grid (gap trick) */
.grid-gap-trick {
  gap: 1px;
  background-color: var(--bb-border);        /* gap shows border color */
}
.grid-gap-trick > * { background: var(--bb-surface); }
```

### Glass Effects

```css
/* Standard glass (nav, modals) */
backdrop-filter: blur(10px);
background: var(--bb-surface-overlay);  /* rgba(15,15,17,0.92) */

/* Soft glass (tooltips) */
backdrop-filter: blur(5px);
```

---

## 6. COMPONENTS

### 6.1 Buttons
*Source: https://brand.aioxsquad.ai/brandbook/buttons*

Four component types:
- **SiteCta** — Primary page/form action for marketing surfaces
- **Button** — Generic product and app-shell action primitive
- **PrimaryLink** — Inline editorial/navigation action, low visual weight
- **CtaButton** — Legacy marketing primitive (migrate away from)

**Variants:** Primary | Secondary | Ghost | Delete (destructive)
**Sizes:** Small | Medium | Large
**States:** Default | Loading | Disabled

```css
/* Primary button */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;           /* accessibility standard */
  padding: 0.65rem 1.5rem;
  background: var(--bb-lime); /* #DDD1BB Gold */
  color: var(--primary-foreground);  /* #121213 */
  font-family: var(--font-bb-mono);
  font-size: 0.6rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

/* Secondary button */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--bb-border-strong);
  color: var(--bb-cream);
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  border: none;
  color: var(--bb-dim);
}

/* Destructive */
.btn-delete {
  background: var(--bb-error);
  color: #fff;
}

/* LP AccentButton — arrow glyph variant */
.btn-accent {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 0.875rem 1.25rem;  /* px-5 py-3.5 */
  min-width: 200px;
}
.btn-accent::after { content: " ↗"; }
```

### 6.2 Forms
*Source: https://brand.aioxsquad.ai/brandbook/forms*

**15 components:**

1. **BbDateRangePicker** — date range + country dropdown
2. **BbPhoneInput** — phone number input
3. **BbFileInput** — drag & drop (`accept="image/*"`)
4. **BbInlineEdit** — inline text editing
5. **BbMultiLanguageInput** — PT/EN toggle, item counter
6. **BbArrayInput** — multi-item list with add button
7. **Rich Text Editor** — minimal / full toolbar / read-only modes
8. **SegmentedControl** — pill selector (canonical for marketing forms)
9. **Textarea** — with character limit
10. **Select** — dropdown (Admin / Editor / Viewer)
11. **Toggles** — checkbox-style with disabled state

```css
/* Input base */
.form-input {
  background: transparent;
  border: 1px solid var(--bb-border-input);   /* rgba(255,255,255,0.12) */
  border-radius: var(--radius-md);
  color: var(--bb-cream);
  font-family: var(--font-bb-sans);
  font-size: 0.875rem;
  padding: 0.625rem 0.875rem;
  transition: border-color 150ms var(--ease-smooth);
}

.form-input:focus {
  outline: none;
  border-color: var(--bb-lime);              /* Gold */
  box-shadow: 0 0 0 2px var(--ring);        /* rgba(221,209,187,0.4) */
}

/* Field label */
.form-label {
  font-family: var(--font-bb-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--bb-meta);
  display: block;
  margin-bottom: 0.5rem;
}

/* SegmentedControl */
.segmented-control {
  display: inline-flex;
  background: var(--bb-surface);
  border: 1px solid var(--bb-border);
  border-radius: var(--radius-full);
  padding: 3px;
  gap: 2px;
}
.segmented-control__option {
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 150ms;
}
.segmented-control__option[data-active="true"] {
  background: var(--bb-lime);
  color: var(--primary-foreground);
}
```

**Composed form example:**
```
Project Name* | Description | Priority [Low/Med/High segmented]
Mark as urgent [toggle]
[Create Project] [Cancel]
```

**Deprecated:** `BbFormField` → replaced by canonical `Field + FieldLabel`

### 6.3 Cards
*Source: https://brand.aioxsquad.ai/brandbook/cards*

**Variants:**
- **Default** — standard surface with background and border
- **Elevated** — with shadow for emphasis
- **Outlined** — transparent background with border only

```css
/* Card base */
.card {
  background: var(--bb-surface);       /* #151517 */
  border: 1px solid var(--bb-border);
  border-radius: var(--radius-lg);     /* 12px */
  overflow: hidden;
}

/* Elevated card */
.card--elevated {
  background: var(--bb-surface);
  box-shadow:
    0 1px 2px rgba(0,0,0,0.3),
    0 4px 16px rgba(0,0,0,0.4);
}

/* Outlined card */
.card--outlined {
  background: transparent;
  border: 1px solid var(--bb-border);
}

/* Card with hover */
.card--interactive {
  transition: background 200ms var(--ease-smooth),
              border-color 200ms var(--ease-smooth);
}
.card--interactive:hover {
  background: var(--bb-surface-hover-strong);  /* #28282C */
  border-color: var(--bb-border-hover);        /* rgba(255,255,255,0.18) */
}
```

**StatCard sizes:**
```css
.stat-card--sm { font-size: 1.25rem; }           /* text-xl */
.stat-card--md { font-size: 1.875rem; }          /* text-3xl */
.stat-card--lg { font-size: clamp(2.5rem, 5vw, 3.5rem); }  /* text-4xl → text-[3.5rem] */
```

### 6.4 Tables
*Source: https://brand.aioxsquad.ai/brandbook/tables*

**7 variants:** Standard table | With search/filter | With export | Compact metrics | Empty state | Dashboard shell with user dropdown | Pagination.

```css
/* Table shell */
.table-wrap {
  background: var(--bb-surface);
  border: 1px solid var(--bb-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  font-family: var(--font-bb-mono);
  font-size: 0.6rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--bb-meta);
  padding: 0.65rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--bb-border);
}

tbody td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--bb-cream);
  border-bottom: 1px solid var(--bb-border-soft);
}

tbody tr:hover td {
  background: var(--bb-surface-hover-strong);
}

/* Trend indicators */
.trend-up   { color: #22C55E; }
.trend-down { color: var(--bb-error); }
```

Columns: ID | Name | Role | Status | Score (with badges + percentage trends).
Pagination pattern: `‹ 1 2 3 ›`

### 6.5 Alerts / Feedback
*Source: https://brand.aioxsquad.ai/brandbook/feedback*

**Alert variants:** Information | Success | Warning | Error

```css
.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  border-left: 3px solid;
  font-size: 0.875rem;
}

.alert--info {
  background: rgba(0,153,255,0.08);
  border-color: var(--bb-blue);
  color: var(--bb-cream);
}
.alert--success {
  background: rgba(34,197,94,0.08);
  border-color: #22C55E;
}
.alert--warning {
  background: var(--warning-bg);
  border-color: var(--warning);
}
.alert--error {
  background: rgba(239,68,68,0.08);
  border-color: var(--bb-error);
}
```

**Toast pattern:** Message + ✕ dismiss icon. 4 variants: Success / Error / Warning / Info.

**Modal:** Dialog overlay with `backdrop-filter: blur(8px)` + `background: var(--color-bg-overlay)`.

**Empty States (4 variants):** No items | Search no results | Error | Permission restricted.
Each: heading + description text + action button.

**Loading Overlay:**
```css
/* Spinner sizes */
.spinner--sm { width: 16px; height: 16px; }
.spinner--md { width: 24px; height: 24px; }
.spinner--lg { width: 40px; height: 40px; }
```

**Confirm Sheet:** Default | Destructive | Loading states.

### 6.6 Lists
*Source: https://brand.aioxsquad.ai/brandbook/lists*

**Section 01 — List Items with Status Badges:**
```
Workflow Automation       [Active]
Customer Support AI       [In Progress]
Data Pipeline             [Planned]
Legacy Migration          [Blocked]
```

**Section 02 — KPI Cards:**
```
50+     Deployments
83%     Time Saved
245K    Hours Automated
0.3%    Error Rate
```

### 6.7 Charts
*Source: https://brand.aioxsquad.ai/brandbook/charts*

**12 chart types:**
1. Bar Chart (SVG)
2. Donut Chart (SVG)
3. Line Chart — single, multi-line, gridless
4. Area Chart — monotone, multi-area, linear curve
5. Pie Chart — standard, donut with innerRadius, labeled
6. Radar Chart — single/multi-series
7. Rings Chart — concentric (3-ring)
8. Animated Number — integer, %, currency, compact
9. Radial Bar Chart — multi-bar, gauge
10. Composed Chart — Bar+Line, Bar+Line+Area
11. World Map — markers, zoomable EqualEarth
12. KPI Grid (DnD) — 3–6 draggable cards

```css
/* Chart color tokens */
--bb-chart-1: var(--bb-lime);      /* Gold #DDD1BB */
--bb-chart-2: var(--bb-blue);      /* #0099FF */
--bb-chart-3: var(--bb-flare);     /* #C4B7A2 */
--bb-chart-4: var(--bb-gray-silver); /* #919191 */

/* Recharts/shadcn data attributes */
[data-chart] { --color-revenue: var(--bb-lime); }
[data-chart] { --color-costs:   var(--bb-flare); }
```

KPI sample data: Revenue (R$ 1.2M), Active Users (8,432), Churn (3.1%), NPS (72).

### 6.8 Badges
*Source: https://brand.aioxsquad.ai/brandbook/effects + https://brand.aioxsquad.ai/brandbook/components*

**5 variants:** Lime (Gold) | Blue | Error | Surface | Solid

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  font-family: var(--font-bb-mono);
  font-size: 0.55rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.badge--gold    { background: var(--bb-accent-15); color: var(--bb-lime); }
.badge--blue    { background: rgba(0,153,255,0.15); color: var(--bb-blue); }
.badge--error   { background: rgba(239,68,68,0.15); color: var(--bb-error); }
.badge--surface { background: var(--bb-surface-alt); color: var(--bb-meta); border: 1px solid var(--bb-border); }
.badge--solid   { background: var(--bb-lime); color: var(--primary-foreground); }

/* Status badge variants (tables/lists) */
.badge--active      { background: rgba(34,197,94,0.15); color: #22C55E; }
.badge--in-progress { background: rgba(0,153,255,0.15); color: var(--bb-blue); }
.badge--planned     { background: var(--bb-surface-alt); color: var(--bb-meta); }
.badge--blocked     { background: rgba(239,68,68,0.15); color: var(--bb-error); }
```

### 6.9 Navigation
*Source: https://brand.aioxsquad.ai/brandbook/navigation + https://brand.aioxsquad.ai/brandbook/lp-sections*

#### Fixed Navbar
```css
.nav {
  position: fixed;
  top: 0;
  z-index: var(--layer-nav);           /* 100 */
  width: 100%;
  background: rgba(18,18,19,0.95);    /* --bb-dark at 95% */
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--bb-border);
  padding: 1rem 1.5rem;              /* px-6 py-4 */
}
```

#### Sidebar (Desktop)
```css
.sidebar { width: 240px; }           /* expanded */
.sidebar--collapsed { width: 56px; } /* icon-only */
/* Navigation items use symbolic markers: ◆ ⊞ ⊟ ◈ ⊕ ◉ ▢ ⊜ ⊙ */
/* Badge support: "Leads 12" */
```

#### Tabs
```css
/* variant="default" — backward compatible */
/* variant="smooth" — animated underline indicator sliding */
.tabs--smooth [data-active="true"] {
  /* underline slides with transition */
}
```

#### Pagination
```
‹ 1 2 3 4 5 ›    (few pages)
‹ 1 2 … 18 19 ›  (many pages, ellipsis)
Hidden when totalPages ≤ 1
```

#### Breadcrumb
```
Home / Section / Page   (3-item default, "/" separator)
Supports 5+ deep with maxLabelLength=20 + tooltip overflow
```

#### Search Modal
```
Trigger: Cmd+K
Props: open, onOpenChange, items[], placeholder, emptyMessage
```

#### Bottom Bar (Mobile)
```
Icons: ⌂ Home | ♡ Likes | ☰ Menu | ⚑ Saved | ⚙ Config
```

#### Fullscreen Overlay Menu
```css
.nav-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--bb-canvas);
  display: grid;
  grid-template-columns: 400px 1fr;
}
.nav-overlay__link {
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}
/* On open: document.body.style.overflow = "hidden" */
```

---

## 7. PATTERNS (Decorative & Structural)
*Source: https://brand.aioxsquad.ai/brandbook/patterns*

### 7.1 Grid Patterns

```css
/* Dot Grid */
.pattern-dot-grid {
  background-image: radial-gradient(var(--bb-lime) 1px, transparent 1px);
  background-size: 16px 16px;  /* default */
}
.pattern-dot-grid--dense  { background-size: 8px 8px; }
.pattern-dot-grid--sparse { background-size: 32px 32px; }

/* Crosshair Grid */
.pattern-crosshair-grid {
  background-size: 80px 80px;  /* grid lines + centered crosshair dots */
}
.pattern-crosshair-grid--tight { background-size: 40px 40px; }

/* Wireframe Perspective */
.pattern-wireframe-perspective {
  background-size: 60px 60px;
  /* + radial glow at center */
}

/* Symbol tiles (SVG background-image) */
.pattern-symbol-grid { background-size: 32px 32px; }  /* X-marks */
.pattern-plus-grid   { background-size: 32px 32px; }  /* plus-signs */
```

### 7.2 HUD Frames

```css
/* Corner Brackets */
.frame-bracket::before,
.frame-bracket::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: var(--bb-lime);
  border-style: solid;
}
.frame-bracket::before { top: 0; left: 0; border-width: 2px 0 0 2px; }
.frame-bracket::after  { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

/* Tech Frame (clip-path corner cuts) */
.frame-tech {
  clip-path: polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px);
  border: 1px solid var(--bb-lime);
}
.frame-tech--sm  { clip-path: polygon(8px 0%, ...); }
.frame-tech--lg  { clip-path: polygon(20px 0%, ...); }

/* Notch Frames */
.frame-notch-tr   { clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%); }
.frame-notch-bl   { clip-path: polygon(0 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px)); }
.frame-notch-both { /* TR + BL diag symmetry */ }
```

### 7.3 Alert Patterns

```css
/* Hazard Stripes */
.pattern-hazard {
  background: repeating-linear-gradient(
    -45deg,
    var(--bb-lime),
    var(--bb-lime) 5px,
    #000 5px,
    #000 10px    /* 10px bold stripes */
  );
}
.pattern-hazard--thin   { /* 5px variant */ }
.pattern-hazard--subtle { opacity: 0.15; }

/* Warning Bar */
.bar-warning {
  background: var(--bb-lime);
  color: #000;
  /* diagonal stripe accent on right edge */
}
```

### 7.4 Textures

```css
/* Scanlines (CRT effect) */
.pattern-scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px
  );
  pointer-events: none;
}
.pattern-scanlines--heavy::after { /* 1px lines at 25% opacity */ }

/* Noise overlay */
.pattern-noise::after {
  content: '';
  position: absolute;
  inset: 0;
  /* SVG fractal noise */
  opacity: 0.04;
  mix-blend-mode: overlay;
}
```

### 7.5 Dividers

```css
.divider-tech {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--bb-lime), transparent);
}

.divider-arrow {
  /* line extending left + right-facing triangle */
}

.divider-dashed {
  border: none;
  border-top: 1px dashed rgba(221,209,187,0.5);
  background-image: repeating-linear-gradient(90deg, var(--bb-lime) 0, var(--bb-lime) 8px, transparent 8px, transparent 16px);
}

.divider-double {
  /* two parallel gradient lines 5px apart */
}
```

### 7.6 Circuit Traces

```css
/* Horizontal circuit */
.pattern-circuit-h {
  height: 20px;
  background: url("data:image/svg+xml,...") repeat-x;
}

/* Full board */
.pattern-circuit-board {
  background: url("data:image/svg+xml,...") repeat;
  background-size: 80px 80px;
  /* SVG has vertical/horizontal PCB traces + junction nodes */
}
```

---

## 8. MOTION & ANIMATION
*Source: https://brand.aioxsquad.ai/brandbook/motion + https://brand.aioxsquad.ai/brandbook/lp-sections*

### 8.1 Easing Functions

```css
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);   /* bouncy spring */
--ease-smooth:  cubic-bezier(0.25, 0.1, 0.25, 1);    /* smooth default */
--ease-decel:   cubic-bezier(0, 0, 0.2, 1);           /* decelerate in */
```

### 8.2 CSS Keyframes

```css
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes ticker-reverse {
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Durations */
.ticker         { animation: ticker 30s linear infinite; }
.ticker-reverse { animation: ticker-reverse 35s linear infinite; }
.marquee        { animation: marquee 20s linear infinite; }
```

### 8.3 Framer Motion Patterns

```javascript
// Standard fade-up (section reveal)
const fadeUp = {
  initial:   { opacity: 0, y: 30 },
  animate:   { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

// inView variant
const inView = {
  initial:    { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.6 }
}

// Scale in (video/image preview)
const scaleIn = {
  initial:   { opacity: 0, scale: 0.97 },
  animate:   { opacity: 1, scale: 1 },
  transition: { duration: 0.8, delay: 0.3 }
}

// Staggered children
const stagger = (i) => ({
  transition: { delay: i * 0.04 }   // or i * 0.1 for slower stagger
})
```

### 8.4 Named Animations (VFX Library)

| # | Name | Duration | Type | Key Technique |
|---|------|----------|------|---------------|
| 01 | Orchestration Pulse | 3.5s | Hero/splash reveal | Seed dot + letter stagger + speed lines + glow ring |
| 02 | Speed Lines | 2s | Emphasis | Logo slides while neon lines draw with stagger |
| 03 | Particle Orbit | loop | Loop (agents) | X center spring + 4 orbital particles floating |
| 04 | Logo Dissolve | 3s | Exit/transition | Per-letter flicker then dissolve to nothing |
| 05 | Morphing Square | 3.5s cycle | Loop shape-shift | Square → rounded → circle → back |
| 06 | Glitch Reveal | 2s | Dramatic/hacker | Scanlines + noise + skew + hue-rotate + smooth settle |
| 07 | Stagger Letters | 1.5s | Elegant nav/footer | Per-letter spring + rotateX 3D + neon underline close |
| 08 | Brand Reveal | 3s | Premium LP hero | Black blinds slide open from center → AIOX scale + glow + lines |

All use Framer Motion, GPU-accelerated.

### 8.5 Progress Bar Pattern

```javascript
// Animated progress bar with tick marks
<div style={{ width: `${((hovered + 1) / steps.length) * 100}%` }} />
// Tick marks:
Array.from({ length: 48 }).map(() => (
  <div className="flex-1 border-l" style={{ borderColor: 'rgba(0,0,0,0.15)' }} />
))
```

### 8.6 VFX System
*Source: https://brand.aioxsquad.ai/brandbook/vfx*

#### Film Grain (Texture Overlay)
```css
.grain--subtle  { opacity: 0.05; }
.grain--light   { opacity: 0.10; }
.grain--medium  { opacity: 0.15; }
.grain--heavy   { opacity: 0.25; }
```

#### Glow Effects
```css
/* Neon Glow (Gold edition) */
.glow-neon {
  box-shadow:
    0 0 8px  rgba(221,209,187,0.4),
    0 0 24px rgba(221,209,187,0.2),
    0 0 48px rgba(221,209,187,0.1);
}

/* Soft Glow */
.glow-soft {
  box-shadow: 0 0 16px rgba(221,209,187,0.15);
}

/* Ring Glow */
.glow-ring {
  box-shadow:
    0 0 0 2px rgba(221,209,187,0.3),
    0 0 16px rgba(221,209,187,0.2);
}
```

#### Blur Levels
```css
backdrop-filter: blur(0px);    /* no blur */
backdrop-filter: blur(4px);    /* subtle */
backdrop-filter: blur(8px);    /* medium */
backdrop-filter: blur(16px);   /* heavy */
```

#### Blend Modes
Available: `multiply | screen | overlay | soft-light | color-dodge | difference`

#### Overlay Composites
- Scanlines
- CRT Effect
- Vignette
- Edge Fade

---

## 9. LAYOUT PATTERNS (LP Sections)
*Source: https://brand.aioxsquad.ai/brandbook/lp-sections + https://brand.aioxsquad.ai/brandbook/sections*

### 9.1 Section Shell

```css
.section-shell {
  padding-block: 6rem 8rem;          /* py-24 md:py-32 */
}
.section-shell--light {
  background: #F5F4E7;               /* aiox-cream / off-white */
  color: #050505;
}
.section-shell--dark {
  background: var(--bb-canvas);
  color: var(--bb-cream);
}
```

### 9.2 Section Header

```css
/* Pattern: "[number] label_" */
.section-header {
  margin-bottom: 3.5rem;            /* mb-14 */
}
.section-header__number {
  color: var(--bb-lime);            /* Gold */
}
.section-header__label {
  color: rgba(255,255,255,0.4);     /* white/40 */
}
```

### 9.3 Hero Section

```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 3rem;             /* pb-12 md:pb-20 */
}

/* AI Watermark (background text) */
.hero__watermark {
  font-size: 45vw;
  opacity: 0.04;
  letter-spacing: -0.05em;
  transform: translateY(30%);
  pointer-events: none;
  user-select: none;
}

/* Hero grid */
.hero__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* md:grid-cols-[1fr_1fr] */
}
```

### 9.4 Section Flow (Dark/Light Alternation)

| Section | Background |
|---------|-----------|
| Navbar | dark/95 (fixed) |
| Hero | dark |
| WhoWeAre | light |
| PainPoints | dark → light |
| ROICalculator | cream |
| Services | dark |
| HowItWorks | light |
| Testimonials | light |
| TechStack | dark |
| Pricing | dark |
| FAQ | cream |
| Contact | light |
| Footer | dark |

### 9.5 Layout Compositions

```css
/* Staircase vertical offset */
.staircase-v { margin-top: calc(var(--i, 0) * 50px + 24px); }

/* Staircase horizontal offset */
.staircase-h { padding-left: calc(var(--i, 0) * 6%); }

/* Articles grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.06);
}
.articles-grid article { background: var(--bb-surface); }
.articles-grid article:hover { border-color: rgba(255,255,255,0.15); }
```

### 9.6 Pricing Component

```typescript
interface Tier {
  name: string;
  monthly: number;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}
```

Tiers: Quick Win (Starter) | Scale (Growth) | Full Stack (Enterprise)

Monthly/Annual toggle:
```css
.toggle-track { width: 2.5rem; height: 1.25rem; border: 1px solid rgba(255,255,255,0.25); }
.toggle-thumb { width: 1rem; background: #fff; }
/* Annual: price * 0.8 */
```

### 9.7 FAQ Accordion

```css
.faq {
  background: #F5F4E7;              /* cream */
}
.faq__item {
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
.faq__item[data-open="true"] {
  background: rgba(0,0,0,0.03);
}
.faq__number {
  width: 1.5rem;
  height: 1.5rem;
  background: var(--bb-lime);
  color: var(--primary-foreground);
  border-radius: var(--radius-full);
  font-size: 0.65rem;
}
/* Toggle icon: Plus, rotates 45deg on open */
```

### 9.8 Quote Block

```css
.quote__mark {
  font-size: 3rem;        /* text-5xl */
  font-weight: 900;
  opacity: 0.15;
}
.quote__text {
  font-size: clamp(1.125rem, 2vw, 1.25rem);  /* text-lg md:text-xl */
}
.quote__avatar {
  border-radius: var(--radius-full);
}
```

### 9.9 Avatar Stack

```css
.avatar-stack {
  display: flex;
  margin-inline: -0.5rem;           /* -space-x-2 */
}
.avatar-stack__item {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  border: 2px solid var(--bb-surface);
}
/* Max 5 displayed */
.avatar-stack__label {
  font-size: 10px;
  font-family: var(--font-bb-mono);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}
```

---

## 10. FLOW DIAGRAMS
*Source: https://brand.aioxsquad.ai/brandbook/flow-diagram*

**6 components (v2.0 Canvas Collection):**

| Component | Purpose | Canvas Default | Technology |
|-----------|---------|----------------|------------|
| FlowDiagram | Interactive data-driven canvas | 560×340px | SVG (no libs) |
| FlowMap | Grouped mindmap canvas | 800×500px | SVG |
| IconFlowDiagram | Architecture icon canvas | 700×420px | SVG |
| FlowPlaybook | Orchestration playbook canvas | 560×400px | SVG |
| PipelineDiagram | Service pipeline canvas | 800×500px | SVG |
| ProcessFlowDiagram | Development process (vertical) | 560×500px | SVG |

**FlowDiagram Props:**
```typescript
interface FlowNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'default' | 'start' | 'end' | 'decision' | 'action';
  active?: boolean;
}
interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}
// Defaults: nodeWidth=110, nodeHeight=36
```

**Node visual types:**
- `start` / `end` → pill-shaped
- `default` / `action` → rectangle
- `decision` → diamond

**FlowPlaybook node category colors:**
```
start     → lime/gold accent
action    → blue accent
condition → purple accent
wait      → amber accent
end       → red accent
```

**PipelineDiagram node types:**
```
input   → blue badge
ai      → green badge
output  → orange badge
service → gray badge
```

**Universal canvas controls:**
- Scroll/wheel → zoom
- Drag → pan
- Click → toggle active state
- Active state → highlighted with gold (`--bb-lime`)

---

## 11. ADVANCED COMPONENTS
*Source: https://brand.aioxsquad.ai/brandbook/advanced*

**3 sections:**

### Tabs
```css
/* Smooth variant — animated underline */
.tabs__indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: var(--bb-lime);
  transition: left 300ms var(--ease-spring), width 300ms var(--ease-spring);
}
```

### Accordion
```css
.accordion__trigger { /* FAQ-style with ▼ icon */ }
.accordion__content {
  overflow: hidden;
  transition: height 300ms var(--ease-smooth);
}
```

### Steppers
- Horizontal and vertical variants
- Completed steps: ✓ checkmark
- Active: gold color
- Inactive: `--bb-meta`

---

## 12. ICONS
*Source: https://brand.aioxsquad.ai/brandbook/icons*

### Grid Sizes
| Size | Use Case |
|------|----------|
| 16px | Inline, tight spaces |
| 24px | Default/UI (canonical) |
| 32px | Cards, emphasis |
| 48px | Hero, feature |

### Stroke Specifications
```css
.icon {
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;             /* outline-only, no fills */
  color: currentColor;    /* inherits from parent text */
}
```

### Color Variants
```css
.icon--cream   { color: var(--bb-cream); }
.icon--gold    { color: var(--bb-lime); }
.icon--muted   { color: var(--bb-dim); }
.icon--error   { color: var(--bb-error); }
.icon--info    { color: var(--bb-blue); }
.icon--warning { color: var(--bb-flare); }
```

### Accessibility
- Minimum touch target: 44×44px
- Icons smaller than 24px need padding wrapper
- ViewBox: always 24×24 (canonical base, scale from there)

### Included Icon Set
Check | Close | Plus | Minus | Chevron R/L/D | Arrow R | Search | Sun | Grid | Moon

---

## 13. EFFECTS (Glow, Pulse, Spin)
*Source: https://brand.aioxsquad.ai/brandbook/effects*

```css
/* Ticker strip (tech stack logos) */
.ticker-strip {
  display: flex;
  animation: ticker 30s linear infinite;
  /* 3x array duplication for seamless loop */
  /* Images: Python, ChatGPT, AWS, Zapier, Docker, Claude, NodeJS, Vercel, Stripe */
}

/* Neon glow on element */
.glow-neon-element {
  box-shadow: 0 0 8px rgba(221,209,187,0.4), 0 0 24px rgba(221,209,187,0.15);
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.6; transform: scale(0.98); }
}
.pulse { animation: pulse 2s ease-in-out infinite; }

/* Spin animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.spin { animation: spin 1s linear infinite; }

/* Hover effect (tech badge states) */
/* States: Automation | Intelligence | Orchestration | Integration */
```

---

## 14. SEO / META STANDARDS
*Source: https://brand.aioxsquad.ai/brandbook/seo*

```html
<!-- Page title: max 60 chars -->
<title>NOTREGLR — Not regular. Not for everyone.</title>

<!-- Meta description: max 155 chars -->
<meta name="description" content="Statement bags nobody in Europe has seen yet. Sculptural shapes, aggressive colors — designed to make heads turn." />

<!-- Robots -->
<meta name="robots" content="index, follow" />

<!-- Open Graph -->
<meta property="og:type"        content="website" />
<meta property="og:title"       content="NOTREGLR — Not for everyone." />
<meta property="og:description" content="Statement bags nobody in Europe has seen yet." />
<meta property="og:image"       content="/og-image.jpg" />  <!-- 1200×630px -->
<meta property="og:url"         content="https://notreglr.com" />

<!-- Twitter/X Card -->
<meta name="twitter:card"  content="summary_large_image" />  <!-- 1200×600px image -->
<meta name="twitter:title" content="NOTREGLR — Not for everyone." />

<!-- JSON-LD Organization -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "NOTREGLR",
  "url": "https://notreglr.com",
  "logo": "/logo/notreglr-white.svg"
}
</script>
```

---

## 15. DESIGN LANGUAGE & BRAND GUIDELINES
*Source: https://brand.aioxsquad.ai/brandbook/guidelines + https://brand.aioxsquad.ai/brandbook/moodboard*

### Visual Design Philosophy

**Dark-First:** Background `#09090A` as base. Surfaces `#151517`. Information emerges from darkness.

**Structural elements:**
- Grid systems with 1px gap + border reveal
- HUD-style cockpit readouts with section dividers
- Corner brackets + notch clips as decorative language
- Geometric micro-patterns (X, O, diamond, square)
- Crosshair grid backgrounds
- Circuit line motifs

**Typography voice:** Monospace → angular → bold → compressed.

**Data density:** Optimized for displaying dense information — KPIs, rankings, metrics. Stats cards, rank systems, skill meters, progress bars.

### Color: Named Palette

| Name | Value | Notes |
|------|-------|-------|
| Kinetic Limon (AIOX) | `#D1FF00` | RGB 209,255,0; CMYK 20,0,100,0 |
| NOTREGLR Gold | `#DDD1BB` | Replaces Lime in all contexts |
| Void Dark | `#09090A` | CSS `--bb-canvas` |
| Surface | `#151517` | CSS `--bb-surface` |
| Warm White | `#F4F4F4` | CSS `--bb-cream` |

### Typography: Geist (Primary Workhorse)
- Terminal interfaces → massive billboard statements
- Full character set: a-z A-Z 0-9 !@#$%^&*()_+
- Weights: Thin (300) | Regular | Bold | Black (800)

### Prohibited Language (Ban List)
Never use: "Mágico", "Revolucionário", "Fácil", "Hack"

### Approved Brand Vocabulary (AIOX reference)
O X, A Seta, O Terminal, A Clareza, Transformador, Revelador, Direto, Jornada

---

## 16. COMPLETE COMPONENT CATALOG SUMMARY

| Category | Components |
|----------|-----------|
| **Buttons** | SiteCta, Button, PrimaryLink, CtaButton — 4 variants × 3 sizes × 3 states |
| **Forms** | 15 components (date picker, phone, file, inline edit, multi-lang, array, rich text, segmented, textarea, select, toggles) |
| **Navigation** | Search modal, pagination, breadcrumb, tabs, sidebar, bottom bar, fullscreen overlay |
| **Feedback** | Alert (4), toast (4), modal, notification center, empty state (4), loading overlay, confirm sheet |
| **Cards** | Default, elevated, outlined — plus StatCard (sm/md/lg), QuoteBlock, AvatarStack |
| **Tables** | 7 variants with search/filter/export/pagination |
| **Lists** | Status list, KPI cards |
| **Charts** | 12 types including bar, donut, line, area, pie, radar, rings, animated number, radial, composed, world map, KPI grid |
| **Flow Diagrams** | FlowDiagram, FlowMap, IconFlowDiagram, FlowPlaybook, PipelineDiagram, ProcessFlowDiagram |
| **Advanced** | Tabs (smooth), accordion, steppers (h/v) |
| **Patterns** | 5 grid types, 3 frame types, hazard stripes, circuit traces, 2 scanline variants, noise, 4 divider types |
| **VFX** | 8 named animations, 4 blur levels, 3 glow types, 6 blend modes, 4 overlay composites |
| **Icons** | 12 icons, 4 sizes, 6 color variants |
| **Badges** | 5 variants (Gold, Blue, Error, Surface, Solid) + 4 status variants |
| **States** | Spinners (sm/md/lg), progress bars (4 levels), skeleton (text/card/image) |
| **Surfaces** | 6 elevation levels, 5 border variants, glass blur system, radius scale |

---

## 17. QUICK REFERENCE: NOTREGLR GOLD vs AIOX LIME

| Context | AIOX Lime | NOTREGLR Gold |
|---------|-----------|--------------|
| Primary accent | `#D1FF00` | `#DDD1BB` |
| Accent 10% | `rgba(209,255,0,0.1)` | `rgba(221,209,187,0.1)` |
| Accent 40% / ring | `rgba(209,255,0,0.4)` | `rgba(221,209,187,0.4)` |
| Neon glow | `rgba(209,255,0,0.4)` | `rgba(221,209,187,0.4)` |
| Flare (warm support) | `#ED4609` | `#C4B7A2` |
| Selection foreground | `#D1FF00` | `#DDD1BB` |
| Focus ring | `#D1FF00` | `#DDD1BB` |
| Canvas | `#050505` | `#09090A` |
| Surface | `#0F0F11` | `#151517` |
| Text | `oklch(0.9639...)` | `#F4F4F4` |

---

*Document compiled 2026-04-08 from AIOX Squad Brandbook v2.0 — Dark Cockpit Edition.*
*All AIOX lime (`#D1FF00`) values substituted with NOTREGLR gold (`#DDD1BB`) throughout.*
