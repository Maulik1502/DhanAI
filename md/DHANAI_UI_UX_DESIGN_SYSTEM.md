# DhanAI — Modern UI/UX Design System

> Production-ready design language for an AI-powered fintech app

---

## Design Philosophy

**"Clarity through simplicity. Trust through transparency."**

DhanAI is NOT a trading app (chaotic, fast). It's a financial ADVISOR (calm, thoughtful, educational). The UI should feel like talking to a trusted advisor who explains everything clearly.

---

## Color System

### Primary Palette
```
Primary Blue    : #1F2937 (Deep slate — serious, trustworthy)
Accent Blue     : #3B82F6 (Bright blue — actionable, attention)
Success Green   : #10B981 (Emerald — positive money flows)
Alert Red       : #EF4444 (Clear warning — no ambiguity)
Gold            : #F59E0B (Wealth/savings milestones)
Neutral Gray    : #6B7280 (Supporting text, disabled states)
```

### Semantic Usage
```
✅ Income          → Green (#10B981)
❌ Expenses        → Red (#EF4444)
💰 Surplus/Gains   → Green (#10B981)
⚠️ At Risk/Alert   → Amber (#F59E0B)
🎯 Goals           → Blue (#3B82F6)
🏦 Banks/Safe      → Slate (#1F2937)
```

### Dark Mode
Auto-enable at system preference. Backgrounds: #111827 (charcoal), Cards: #1F2937 (slate).

---

## Typography

### Font Stack
```
Heading  : Inter 600-700 (sans-serif, system font fallback)
Body     : Inter 400-500
Mono     : JetBrains Mono (numbers, amounts, codes)
Fallback : -apple-system, BlinkMacSystemFont, "Segoe UI"
```

### Scale
```
h1  → 32px / 1.2 line-height (Page titles)
h2  → 24px / 1.3 line-height (Section headers)
h3  → 20px / 1.4 line-height (Card titles)
Body→ 16px / 1.5 line-height (Default reading)
Small→ 14px / 1.4 line-height (Secondary info)
Tiny → 12px / 1.3 line-height (Captions, badges)
```

---

## Components Style

### Cards
```
Light   : bg-white, border-1 border-gray-200, rounded-lg
Dark    : bg-gray-800, border-1 border-gray-700, rounded-lg
Hover   : shadow-md, translate-y-(-2px), 200ms ease-out
Active  : border-blue-500, shadow-blue-100
Loading : opacity-50, pointer-events-none, animate-pulse
```

### Buttons
```
Primary     : bg-blue-600, text-white, px-4 py-2.5, rounded-lg
Secondary   : bg-gray-100, text-gray-900, px-4 py-2.5, rounded-lg
Outline     : border-2 border-gray-200, bg-transparent
Destructive : bg-red-600, text-white
Disabled    : opacity-50, cursor-not-allowed
Size        : sm (px-2 py-1), md (px-4 py-2.5), lg (px-6 py-3)
```

### Forms
```
Input       : border-1 border-gray-300, rounded-lg, px-3 py-2
Focus       : border-blue-500, ring-2 ring-blue-100, outline-none
Error       : border-red-500, ring-2 ring-red-100
Helper Text : text-gray-500, mt-1
```

### Progress Bars
```
Linear  : height 8px, rounded-full, bg-gray-200, overflow-hidden
          inner bar: bg-green-500, smooth animation
Circular: SVG-based, 120px diameter, stroke-width 8
Label   : center text, bold percentage
Milestone: checkmark icons at 25%, 50%, 75%, 100%
```

### Modals/Dialogs
```
Backdrop: bg-black/50, blur-sm, z-40
Container: bg-white, rounded-xl, shadow-2xl, max-w-md, p-6
Title   : h2 class, mb-4
Content : prose, clean spacing
Actions : flex gap-3, justify-end
```

### Notifications/Toast
```
Position: bottom-right, margin 16px
Duration: 4s auto-dismiss
Types   :
  Success : bg-green-50, border-green-200, text-green-900
  Error   : bg-red-50, border-red-200, text-red-900
  Warning : bg-amber-50, border-amber-200, text-amber-900
  Info    : bg-blue-50, border-blue-200, text-blue-900
Icon + Message + optional Close button
```

### Badges
```
Base        : inline-flex, items-center, gap-1, px-2 py-1, rounded-full
Variant     : bg-blue-100 text-blue-900 (primary), bg-green-100 text-green-900 (success), etc.
Sizes       : sm (text-xs), md (text-sm), lg (text-base)
Removable   : + close button
```

### Skeleton Loaders
```
Pulse effect: opacity 0.5 → 1.0 → 0.5, 2s infinite
Shape       : match content shape (round for avatars, rect for cards)
Multiple    : 3-4 lines for text, grid cells for tables
Duration    : 2s per cycle
```

---

## Layout Patterns

### Dashboard Grid
```
Desktop (1200px+) : 3-column grid
Tablet (768px)    : 2-column grid
Mobile (375px)    : 1-column stack
Gap               : 1.5rem
Sidebar           : 256px fixed (collapsible on mobile)
```

### Navigation
```
Top Navbar  : fixed top, height 64px, shadow-sm, z-40
Breadcrumb  : text-sm, gray-500, path shown only if depth > 1
Sidebar     : collapsible, icon + label on hover
Mobile Nav  : bottom tab bar OR slide-out menu
```

### Spacing System
```
xs  : 0.25rem (4px)
sm  : 0.5rem (8px)
md  : 1rem (16px)
lg  : 1.5rem (24px)
xl  : 2rem (32px)
2xl : 3rem (48px)
```

---

## Micro-interactions

### Hover States
```
Cards    : +4px shadow, -2px translate Y, 200ms ease-out
Buttons  : 95% opacity, -1px translate Y
Links    : underline appears, color brightens
Icons    : +10% scale, 150ms ease-out
```

### Loading
```
Spinner     : rotating SVG, 24px, blue-500
Skeleton    : pulsing gray rectangles, match content height
Progress    : animated bar fill + percentage number
Polling     : subtle fade-in/out on data refresh
```

### Transitions
```
Page Navigate  : fade-in 300ms (new) + fade-out 150ms (old)
Modal Open     : slide-up + backdrop fade, 250ms ease-out
Form Submit    : button → spinner, disable input, disable scroll
Toast Appear   : slide-in from bottom-right, 250ms ease-out
```

---

## Financial Data Visualization

### Amount Display
```
₹1,00,000           → formatINR() → "Rs.1.00 L"
₹5,00,00,000        → "Rs.5.00 Cr"
+12.5% gain         → <span class="amount-positive">+12.5%</span>
-5.2% loss          → <span class="amount-negative">-5.2%</span>
n/a or loading      → "—" (em dash)
```

### Charts
```
Library     : Recharts (bar, line, area, pie)
Colors      : Use semantic palette (green for gains, red for losses)
Tooltips    : Dark background, white text, rounded
Legend      : Bottom or right, clickable to toggle series
Responsive  : Re-render on window resize, mobile stack bars to 50% width
```

### Tables
```
Header      : bg-gray-50, font-600, text-gray-700, sortable (click header)
Row Hover   : bg-gray-50, slight lift
Alternating : no stripe (too busy), use spacing instead
Actions     : ellipsis menu (right side), edit/delete/view options
Empty State : centered message + CTA icon, gray-400
```

---

## Page Templates

### Dashboard Page
```
Header      : Title + subtitle + user info (top right)
Hero Card   : Large surplus/health score card with gradient
Summary Grid: 3-4 key metrics (income, expenses, goals, corpus)
Section 1   : Active goals (compact cards)
Section 2   : Recent transactions (mini table)
Section 3   : AI tip card (gradient background, quote style)
Sidebar     : Quick links, alerts bell, settings
```

### Goals Page
```
Filter Bar  : Status (active/completed), Sort (deadline, priority)
Grid Layout : 3 columns on desktop, 1 on mobile
Goal Card   : 
  - Emoji + name
  - Progress ring (circular, centered)
  - ₹target / ₹current
  - Deadline countdown
  - Monthly SIP badge
  - "View" button
Empty State : "No goals yet. Let's create one!" + big "+ Create Goal" button
```

### Chat Page
```
Messages    : User (right, blue bubble) vs AI (left, gray bubble)
Markdown    : Bold, italic, lists, code blocks rendered in AI message
Typing      : "AI is thinking..." + animated dots
Input       : Sticky bottom, text area expands as you type (max 400px height)
Chips       : Suggested prompts above input (swipe on mobile)
Sidebar     : Previous conversations list (future feature)
```

### Finances Page
```
Left Column : Income section (add, list, total)
Right Column: Expenses section (add by category, list, total)
Sticky Bar  : Income | Expenses | = Surplus (updates live)
Income Card :
  - Type badge
  - Amount (green)
  - Frequency
  - Edit / Delete
Expense Card:
  - Category icon
  - Amount (red)
  - Frequency
  - EMI tag if applicable (shows "X months left")
  - Edit / Delete
```

### Tax Page
```
Comparison Card: Old vs New regime (side by side)
  - Tax liability
  - Effective rate
  - Winner badge
80C Tracker: Progress bar to 1.5L
  - Breakdown list (EPF, ELSS, PPF, etc.)
  - Remaining amount + percentage
Deductions   : Editable inputs for 80D, NPS, HRA, etc.
AI Tax Plan  : Button → calls /api/ai/suggest → shows card with suggestions
```

---

## Mobile-First Breakpoints

```
xs  : 320px (old phones)
sm  : 640px (small phones)
md  : 768px (tablets)
lg  : 1024px (desktops)
xl  : 1280px (large desktops)
2xl : 1536px (ultra-wide)
```

Rules:
- Touch targets: minimum 48px × 48px
- Sidebars: collapse to hamburger < 768px
- Grids: 1 column < 640px, 2 columns 640-1024px, 3+ columns > 1024px
- Font sizes: no smaller than 16px on mobile (prevents auto-zoom)
- Modal width: min(90vw, 500px)

---

## Accessibility

- WCAG 2.1 AA compliant
- Alt text on all images
- Color not sole indicator (use icons + labels)
- Focus visible: blue ring around interactive elements
- Keyboard navigation: Tab through all controls, Enter to submit
- Screen reader: Semantic HTML, aria-labels where needed
- Motion: Respect prefers-reduced-motion, disable animations if set

---

## Dark Mode Implementation

```css
@media (prefers-color-scheme: dark) {
  body {
    @apply bg-gray-900 text-gray-100;
  }
  .card {
    @apply bg-gray-800 border-gray-700;
  }
  .btn-secondary {
    @apply bg-gray-700 text-gray-100;
  }
}
```

Use Tailwind's `dark:` prefix on component classes.

---

## Animation Library

- Framer Motion for complex animations (chart transitions, modal stagger)
- Tailwind animations for simple effects (spin, pulse, bounce)
- CSS transitions for hover/focus states (duration 200ms-300ms)
- No animation > 1s (feels slow)
- Prefer `ease-out` for appear, `ease-in-out` for transform

---

## Icon Usage

- **lucide-react** (18px default, 24px for hero sections)
- Single color (inherit parent text-color)
- Consistent stroke-width (2)
- Pair icons with text labels (never icon-only except obvious hamburger menu)

Common icons:
```
Income    : TrendingUp
Expense   : TrendingDown
Goals     : Target
Corpus    : PiggyBank
Insurance : Shield
Tax       : FileText
Chat      : MessageCircle
Settings  : Settings
Alert     : AlertCircle
Success   : CheckCircle
Error     : XCircle
```

---

## Typography in Context

### Headings
```
Page Title      : h1, text-gray-900, mb-2
Subtitle        : text-gray-500, text-sm, mb-6
Section Header  : h2, text-gray-900, mt-8 mb-4
Card Title      : h3, text-gray-900, mb-3
```

### Copy
```
Primary Text    : text-gray-900, text-base, line-height 1.5
Secondary Text  : text-gray-500, text-sm
Disabled Text   : text-gray-400
Success Copy    : text-green-700
Error Copy      : text-red-700
```

---

## State Indicators

```
Success     : Green checkmark badge + toast
Error       : Red X badge + error message inline
Loading     : Skeleton or spinner, disable interaction
Disabled    : Gray out, cursor-not-allowed
Empty       : Centered icon + message + CTA
Offline     : Top banner "You're offline. Changes will sync when online."
```

---

## Best Practices Summary

1. **Every interaction has feedback** — button click, form submit, data load
2. **Progress is transparent** — show loading states, countdown timers, percentage bars
3. **Errors are helpful** — explain what went wrong + how to fix
4. **Empty states are opportunities** — not dead ends, suggest next action
5. **Consistency is king** — use same button style, colors, spacing everywhere
6. **Mobile comes first** — then enhance for tablet/desktop
7. **Less is more** — every pixel should have purpose
8. **Numbers tell stories** — format currencies, show trends with icons

