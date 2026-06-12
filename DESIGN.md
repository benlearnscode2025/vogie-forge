# Design System & Pattern Language: Vogie Forge

This document captures the visual identity, token system, typographic hierarchy, and custom component patterns of Vogie Forge.

---

## 1. Visual Identity & Brand Voice

*   **Vibe**: Ancient hearth, raw fire, quenched steel, and historic Celtic craftsmanship. It balances the rough texture of a working blacksmith forge with the premium pedigree of a royal sword maker.
*   **Voice**: Honest, tactile, weight-carrying, and scarce (batch drops, never restocked).
*   **Anti-References**: Generic tech SaaS landing pages (no purple-to-blue gradients, no modern corporate icons, no nested grid cards, no clean sans-serif bodies for historical copy).

---

## 2. Design Tokens (CSS Variables)

Defined in [`index.css`](file:///c:/Users/benim/Documents/idea/src/index.css):

### 2.1 Color Palette

| Token | Value | Visual Description | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-dark` | `#0a0908` | Soot Black | Site-wide body background |
| `--bg-slate` | `#151311` | Quenched Steel | Cards and panels |
| `--bg-hearth` | `#1d1a17` | Blacksmith Charcoal | Hover/interactive panels |
| `--bg-parchment` | `#f4edd8` | Aged Scroll Paper | Light certificate/VIP containers |
| `--gold-solid` | `#c5a059` | Burnished Gold Leaf | Buttons, active accents, key borders |
| `--molten-core` | `#db5a19` | Crucible Orange | Particles, embers, fire highlights |
| `--text-bone` | `#f5f2eb` | Bleached Vellum | Primary text |
| `--text-tarnish`| `#e3dfd5` | Aged Silver/Brass | Secondary text |

### 2.2 Typography

*   **Heading Font** (`--font-heading`): `'Cinzel'`, Georgia, serif (elegant, capital-dominant, historic).
*   **Body Serif Font** (`--font-serif`): `'Cardo'`, Georgia, serif (classic book typesetting for narratives).
*   **Body Sans Font** (`--font-sans` / `--font-accent`): `'Outfit'`, sans-serif (clean, high-legibility geometric sans-serif for UI labels and values).

---

## 3. UI Patterns & Custom Elements

### 3.1 Iron Forge Panels (`.iron-panel`)
A premium container styled like a cold-rolled iron plate, with a subtle border and inner relief shadow:
```css
.iron-panel {
  background: var(--bg-slate);
  border: 1px solid var(--border-iron);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}
```

### 3.2 Double Borders (`.border-double-line`)
Used for certificates and high-value items, mimicking double-strike metal stamps:
```css
.border-double-line {
  border: 4px double var(--gold-solid);
}
```

### 3.3 Embers Particle Overlay
Site-wide animation creating floating ash embers:
```css
.ember-particle {
  background-color: var(--molten-core);
  box-shadow: 0 0 10px var(--molten-core);
  animation: float-embers-slow 24s infinite linear;
}
```
