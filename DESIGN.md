# Design Brief

## Brand Essence
Clean, minimal NFT creation tool. Premium modern with deep indigo primary (trust, Web3). No distractions, maximum clarity.

## Color Palette
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary | `0.52 0.25 280` (indigo) | `0.68 0.28 280` | Mint button, wallet connect, active states |
| Success | `0.58 0.22 142` (green) | `0.68 0.26 142` | Confirmation, success states |
| Destructive | `0.55 0.22 25` (red) | `0.65 0.19 22` | Error, warnings |
| Background | `0.99 0.01 0` (off-white) | `0.12 0 0` (charcoal) | Main surface |
| Card | `0.98 0.02 0` (warm white) | `0.16 0 0` (elevated dark) | Lifted surfaces |
| Foreground | `0.2 0 0` (dark) | `0.92 0 0` (light) | Text |
| Muted | `0.92 0.01 0` (grey) | `0.25 0 0` (soft grey) | Secondary UI |
| Border | `0.92 0.01 0` (subtle) | `0.25 0 0` (subtle) | Dividers, edges |

## Typography
| Role | Font | Scale | Weight | Usage |
|------|------|-------|--------|-------|
| Display | Space Grotesk | 28–36px | 600–700 | Headers, NFT names, wallet display |
| Body | DM Sans | 14–16px | 400–600 | Form labels, descriptions, UI text |
| Mono | JetBrains Mono | 12–14px | 400–600 | Token IDs, addresses, code snippets |

## Structural Zones
| Zone | Light Background | Dark Background | Treatment |
|------|---|---|---|
| Header | `bg-card border-b border-border` | `bg-card border-b border-border` | Minimal header with wallet connect button as focal point |
| Form Section | `bg-background` | `bg-background` | Input fields on card background with `card-shadow` |
| Gallery | `bg-background` | `bg-background` | CSS Grid (auto-fit, minmax 200px), card shadows on hover |
| Success Modal | `bg-card` | `bg-card` | Centered, elevated card with `card-shadow-elevated`, mint confirmation |

## Spacing & Rhythm
- **Grid base**: 8px (all spacing in multiples of 8)
- **Card padding**: 24px
- **Gap (grid)**: 16px
- **Input height**: 40px
- **Button height**: 44px
- **Radius**: 8px (consistent, refined)

## Component Patterns
- **Buttons**: Primary (indigo bg, white text), Secondary (muted bg, dark text), Success (green for confirmation)
- **Inputs**: 40px height, subtle border, focus ring on primary color
- **Cards**: 8px radius, `card-shadow`, hover state lifts with `card-shadow-elevated`
- **Gallery items**: Image grid, name underneath, subtle overlay on hover

## Motion
- **Transition smooth**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- **Card hover**: Lift shadow (shadow-sm → shadow-md)
- **Button press**: 0.15s scale(0.98)
- **Form validation**: 0.2s color change

## Dark Mode
Enabled via `.dark` class. Surfaces invert carefully: light warm white → dark charcoal. Primary accent becomes brighter (0.68 lightness) for contrast. Borders soften but remain distinct.

## Signature Detail
Wallet connection treated as premium hero element — centered alignment, clear visual priority. NFT preview on success screen shows full image with metadata grid. Gallery grid scales responsively: 2 cols mobile, 3 cols tablet, 4 cols desktop.

## Constraints
- No gradients (refined surfaces only)
- No decorative elements (clarity first)
- Maximum 3 interactive states per component
- Mobile-first responsive: sm(640px), md(768px), lg(1024px)
