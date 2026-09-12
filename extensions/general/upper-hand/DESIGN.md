# Upper Hand design tokens

Visual system for every Upper Hand surface (panel, readiness view, case list, demo). Follows Accounted's stack (Tailwind 4 + shadcn/ui, strings in both `messages/sv.json` and `messages/en.json`). When a rule here conflicts with a shadcn default, this file wins inside the extension; never restyle Accounted core.

## 1. Colour

Source of truth is HSL. Hex is derived, use it only where HSL is unavailable.

### Light theme

| Token | HSL | Hex | Use |
|---|---|---|---|
| ink | 0 0% 4% | #0A0A0A | text, every structural line |
| paper | 60 33% 97% | #FAFAF5 | page background, never pure white |
| white | 0 0% 100% | #FFFFFF | cards and panels lifted from paper |
| accent | 73 100% 65% | #D8FF4D | lime, functional only (see rule 2) |
| mute-ink | 0 0% 33% | #545454 | secondary text, labels, table cells |
| border | 60 10% 85% | #DDDDD5 | dividers outside tables |
| surface-2 | 60 20% 93% | #F1F1EA | table header, sidebar, rail |
| surface-3 | 60 15% 90% | #E9E9E2 | total row, log area |

### Semantic

| Token | HSL | Hex | Meaning in Upper Hand |
|---|---|---|---|
| ok | 152 55% 34% | #27865A | case closed, readiness good, evidence verified |
| warn | 38 92% 45% | #DC8F09 | severity `attention`, case open, provenance degraded |
| err | 0 72% 51% | #DC2828 | severity `blocking`, document unverified |

### Dark theme

| Token | HSL | Hex |
|---|---|---|
| background | 0 0% 4% | #0A0A0A |
| foreground | 60 33% 97% | #FAFAF5 |
| card | 0 0% 6% | #0F0F0F |
| muted | 0 0% 12% | #1F1F1F |
| muted-foreground | 0 0% 50% | #808080 |
| border | 0 0% 16% | #292929 |
| accent | 73 100% 65% | #D8FF4D |

In dark theme ink and paper swap together, never only the background.

## 2. The five hard rules

1. Zero border radius, zero shadows, zero gradients. Exceptions: status dots and graph nodes.
2. Lime is functional only: active state, live, focus, approve, new finding. Test: if the lime surface can be removed without losing function, it is decoration and must go. Never as background fill for a section, never as brand colour.
3. Poppins for text (400 to 800). A monospace stack with `font-variant-numeric: tabular-nums` for every number, amount, date, voucher id, case id. Numbers are right aligned.
4. Tables: 2 px ink frame, 2 px under the header row, 1 px hairlines (ink at 14 %) between rows, header on surface-2 in letter-spaced uppercase, first column semibold ink, other cells mute-ink, total row with 2 px above on surface-3. Never zebra striping.
5. No logos, wordmarks or icons as brand. Upper Hand is identified by its name set in Poppins 700 and nothing else.

## 3. Typography scale (screen)

| Role | Size | Weight | Letter spacing |
|---|---|---|---|
| Page title | 28 px | 700 | -0.045 em |
| Section title | 18 px | 600 | -0.035 em |
| Body | 14 px | 400 | 0 |
| Label / table header | 11 px uppercase | 500 | 0.12 em |
| Data (mono) | 13 px | 400 / 700 | 0 |

Body never below 14 px. Percent with a space (40 %), dates YYYY-MM-DD, no superlatives, no emoji.

## 4. Structure

Structural lines 2 px ink. Hairlines 1 px ink at 14 %. Grids use `gap: 1px` with ink as the grid background so the lines are the gaps. Spacing on an 8 px base. Content max width 1280 px.

## 5. Upper Hand specifics

- **Readiness number** (audit-ready, covenant-ready, sale-ready): mono, large, ink. Colour only on the delta or the status dot, never on the number itself.
- **Case severity**: `info` mute-ink text, `attention` warn dot, `blocking` err dot. The dot is the only round element.
- **Provenance grade** shown as a label in uppercase mono: `NATIVE FULL HISTORY`, `MIGRATED DOCS AND HISTORY`, `MIGRATED DOCS`, `NUMBERS ONLY`. Degraded grades get a warn dot, never a coloured background.
- **Evidence chain**: a table per case, one row per voucher, event or document, ids in mono, timestamps YYYY-MM-DD HH:MM.
- **Tone in UI copy**: an experienced CFO, Swedish, no alarm language, no exclamation marks. Never the words fraud, embezzlement or misconduct.

## 6. Tailwind 4 theme (drop into the extension's CSS)

```css
@theme {
  --color-ink: hsl(0 0% 4%);
  --color-paper: hsl(60 33% 97%);
  --color-white: hsl(0 0% 100%);
  --color-accent: hsl(73 100% 65%);
  --color-mute-ink: hsl(0 0% 33%);
  --color-border: hsl(60 10% 85%);
  --color-surface-2: hsl(60 20% 93%);
  --color-surface-3: hsl(60 15% 90%);
  --color-ok: hsl(152 55% 34%);
  --color-warn: hsl(38 92% 45%);
  --color-err: hsl(0 72% 51%);
  --font-sans: "Poppins", system-ui, sans-serif;
  --font-mono: "DejaVu Sans Mono", "SF Mono", Menlo, Consolas, monospace;
  --radius: 0px;
}

.dark {
  --color-ink: hsl(60 33% 97%);
  --color-paper: hsl(0 0% 4%);
  --color-white: hsl(0 0% 6%);
  --color-mute-ink: hsl(0 0% 50%);
  --color-border: hsl(0 0% 16%);
  --color-surface-2: hsl(0 0% 12%);
  --color-surface-3: hsl(0 0% 10%);
}

.tabular { font-variant-numeric: tabular-nums; }
.uh-table { border: 2px solid var(--color-ink); border-collapse: collapse; }
.uh-table thead th { background: var(--color-surface-2); border-bottom: 2px solid var(--color-ink);
  font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; text-align: left; }
.uh-table tbody td { border-top: 1px solid color-mix(in srgb, var(--color-ink) 14%, transparent); color: var(--color-mute-ink); }
.uh-table tbody td:first-child { color: var(--color-ink); font-weight: 600; }
.uh-table td.num, .uh-table th.num { text-align: right; font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
.uh-table tfoot td { border-top: 2px solid var(--color-ink); background: var(--color-surface-3); }
```

shadcn components used inside the extension get `rounded-none shadow-none` and the tokens above; do not change `components.json` or the global theme.
