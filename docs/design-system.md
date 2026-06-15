# DESIGN SYSTEM
## وعي يمر من كربلاء
### Wa'y min Karbala: Premium Islamic Educational Platform

---

## DESIGN PHILOSOPHY

This platform embodies a **premium dark luxury aesthetic** rooted in Islamic visual and cultural tradition. The visual language is built on:

- **Reverent minimalism**: Generous negative space honors the contemplative, sacred nature of Husseini education
- **Cinematic depth**: Layered atmospheric elements create immersive, dignified experiences
- **Refined ornamentation**: Subtle Islamic geometric flourishes and calligraphic accents without visual clutter
- **Warm luxury**: Gold embodies reverence and cultural richness; deep blacks provide noble restraint
- **Arabic-first identity**: Calligraphic typography and RTL flow are foundational structural choices
- **Noble restraint**: Every element is considered; decoration serves meaning

This design rejects sterile minimalism and generic sans-serif defaults. The color, typography, and spacing choices collectively communicate cultural dignity and spiritual reverence.

---

## COLOR LANGUAGE

### Core Palette

**Deep Black — `#0D0B09`**
- Foundational background color
- Conveys nobility, depth, contemplation
- The "empty space" for gold accents to emerge
- Never pure black (#000000) — warmth matters

**Primary Gold — `#D4B98A`**
- Central identity color
- Headlines, primary text, decorative elements
- Communicates reverence and Islamic tradition
- Warm enough to feel cultured, not cold metallic

**Light Gold — `#E8D5A3`**
- Subheadings and secondary text prominence
- Maintains hierarchy while keeping warmth
- Used sparingly for emphasis

**Dark Gold — `#A8925E`**
- Borders, dividers, subtle accents
- Drops gold back into shadow when needed
- Creates visual breathing room

**Muted Gold — `#6B5A3E`**
- Metadata, timestamps, background ornamentation
- Still gold family but nearly invisible unless studied

**Crimson Red — `#8B1E1E`**
- Karbala crimson: deep, reserved, reverent
- Used for: accent details, subtle callouts, flag elements
- NOT bright red; this is tragic, noble red
- Appears in logo, minimal accent details

**Warm White — `#F0E8D8`**
- Body text, primary readable content
- Slightly warm cream tone
- Avoids harsh pure white (#FFFFFF)

**Secondary Text — `#C5B89A`**
- Supporting text, secondary information
- Warm tan between gold and white

**Muted Gray — `#7A6E5E`**
- Tertiary information: timestamps, metadata, captions
- Still warm, never cool gray

### Border & Shadow System

Borders never use hard gold lines. Instead, use alpha-based borders:
- **Subtle**: `rgba(212, 185, 138, 0.12)` — barely visible, for structure
- **Medium**: `rgba(212, 185, 138, 0.25)` — clear division but refined
- **Strong**: `rgba(212, 185, 138, 0.45)` — emphasis or active states
- **Card**: `rgba(212, 185, 138, 0.15)` — default card border

**Shadow Hierarchy**:
- **Ambient**: `0 4px 24px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(212, 185, 138, 0.08)` — resting cards
- **Elevated**: `0 8px 40px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(212, 185, 138, 0.15)` — hover/focus states
- **Glow**: `0 0 20px rgba(212, 185, 138, 0.2)` — subtle gold luminescence on interactive elements
- **Deep**: `inset 0 0 200px rgba(0, 0, 0, 0.7)` — atmospheric vignette on hero images

---

## TYPOGRAPHY

### Font Selection & Rationale

**Scheherazade New** — Headlines & Display
- Original Arabic calligraphic typeface
- Evokes manuscript tradition while remaining modern
- Weight: 700 (bold only for strongest hierarchy)
- Used for: H1, H2, H3, section titles, key callouts, logo
- Line-height: 1.1–1.3 (tightly spaced for visual impact)

**Noto Kufi Arabic** — Body & Interface Text
- Clear, readable modern Arabic typeface
- Designed for screen legibility without sacrificing culture
- Used for: body text, subheadings, labels, buttons, UI copy
- Neutral enough to support Scheherazade's expressiveness

**Cinzel** — Numerals & Special Display
- Classical proportions for numbers ("01", "03", "13")
- Used sparingly for night numbers and counters
- Creates elegant contrast against Arabic text

### Typographic Scale

**Display (Scheherazade New)**
- H1: `clamp(3rem, 8vw, 7rem)` — Hero titles, primary headlines
- H2: `clamp(2rem, 5vw, 3.5rem)` — Section titles
- H3: `clamp(1.4rem, 3vw, 2rem)` — Card titles, subsections
- H4: `clamp(1.1rem, 2vw, 1.4rem)` — Emphasis text

**Body (Noto Kufi Arabic)**
- Large: 1.125rem / line-height 1.8 — Feature text, introductions
- Medium: 1rem / line-height 1.75 — Standard body text
- Small: 0.875rem / line-height 1.7 — Captions, metadata

**Special (Cinzel)**
- Night numbers: 2.5rem, bold — visual markers for lecture nights

### Typographic Hierarchy Principles

1. **Scheherazade for culture**: Calligraphy immediately signals Islamic heritage
2. **Sizes via hierarchy**: Never arbitrary — each size step serves information priority
3. **Line length restraint**: Max 65–75 characters for body text (readability)
4. **RTL spacing**: Letter-spacing increases slightly (0.02–0.08em) to prevent crowding in RTL
5. **Weight over size**: One size with two weights beats multiple sizes
6. **Gold text strategically**: Headlines in gold (#D4B98A), body in warm white (#F0E8D8)

---

## SPACING & LAYOUT

### Spacing Scale
```
4px  8px  12px  16px  20px  24px  32px  40px  48px  64px  80px  96px  128px
xs   sm   md    base  lg    xl    2xl   3xl   4xl   5xl   6xl   7xl   8xl
```

All spacing follows this scale. No arbitrary values.

### Grid Architecture

**Desktop (1024px+)**
- 12-column grid system
- 32px gutters between columns
- 48px left/right padding
- Max content width: 1280px (centered)
- Allows: full-width hero, multi-column card grids, sidebar layouts

**Tablet (768px – 1023px)**
- 6-column grid (pairs from desktop 12-column)
- 24px gutters
- 32px left/right padding
- Allows: 2-column content, adjusted card grids

**Mobile (< 768px)**
- Single column layout
- 16px gutters
- 16px left/right padding
- Full-width cards stack vertically
- Maintains generous vertical spacing (40px–48px between sections)

### Section Spacing

- Hero: 100% viewport height (full immersion)
- Section top: 48px (mobile), 64px (tablet), 96px (desktop)
- Section bottom: 48px (mobile), 64px (tablet), 96px (desktop)
- Between content blocks: 32px–40px

### Visual White Space

More breathing room than typical. Empty space is active design, not "unused" space.
- Card internal padding: 20–24px
- Section padding: generous, never cramped
- Text block margins: explicit spacing, not reliant on font line-height alone

---

## BORDER RADIUS

- **Small** (`4px`): input fields, minor UI elements
- **Medium** (`8px`): secondary buttons, small containers
- **Large** (`12px`): primary cards, modal-like elements
- **Extra Large** (`16px`): hero sections, full-bleed content
- **Pill** (`9999px`): buttons, badges, pills

Cards use **12px** consistently. Buttons use **pill** shape (9999px) for a refined, friendly feel.

---

## VISUAL IDENTITY

### Logo & Wordmark

The word **"وعي"** (consciousness/awareness) is the visual identity core:

- **Typeface**: Scheherazade New, 700 weight
- **Color**: Primary gold (`#D4B98A`)
- **Accent**: Small triangular red flag (`#8B1E1E`) on thin vertical stem above the alef letter
- **Scale varies by context**:
  - Navigation: 44px height (condensed, compact)
  - Footer: 80px height (prominent, expanded)
  - Hero: Watermark at 10% opacity, background layer (creates depth)

### Decorative Language

**Section Dividers**
- Thin horizontal line: `1px solid rgba(212, 185, 138, 0.2)`
- Centered diamond ornament: `◆` in gold
- Pattern: `── ◆  Section Title  ◆ ──`
- Creates visual rhythm without heaviness

**Corner Ornaments**
- Cards feature subtle brackets in gold at top-left and bottom-right corners
- Conveys precious, framed content
- Drawn as thin lines (`border: 1px solid`)

**Baseline Texture**
- Subtle noise overlay: 3% opacity across all dark sections
- Creates organic, non-digital feel
- Simulates aged paper or textile quality

---

## COMPONENT DESIGN LANGUAGE

### Cards: Universal Principles

All cards follow this design pattern:
- **Background**: `#1C1916` (warm dark)
- **Border**: `1px solid rgba(212, 185, 138, 0.15)` (subtle gold frame)
- **Border-radius**: 12px (consistent roundness)
- **Internal padding**: 20–24px (generous)
- **Shadow**: Ambient depth shadow system
- **Hover elevation**: Lift with enhanced shadow + border brightens to medium gold
- **Transition**: 0.35s cubic-bezier(0.4, 0, 0.2, 1) (easing for sophistication)

### Night Card (Lectures)

**Visual purpose**: Display a single lecture night attractively

- **Dimensions**: 200px wide × 280px tall (desktop), responsive smaller on mobile
- **Night number**: Cinzel, 2.5rem, `#D4B98A`, top-left position
- **Label**: "الليلة" (The Night), Noto Kufi, 0.8rem, `#7A6E5E`
- **Title**: Scheherazade New, 1rem, `#E8D5A3`, 2-line text clamp
- **Lock indicator** (if applicable): Gold lock icon, subtle
- **CTA button**: Small pill, gold border, transparent background
- **Featured state**: Border glow effect, slight scale increase (1.05x), enhanced shadow

**Hover interaction**:
- Background shifts to `#232019`
- Border color → medium gold
- Vertical lift (`translateY(-4px)`)
- Shadow deepens

### Quote Card

**Visual purpose**: Display a meaningful quotation or teaching

- **Background**: `#1C1916`
- **Large opening quotation mark** (`"`): 20% opacity gold, 4rem size, positioned top-left behind text
- **Quote text**: Scheherazade New, 1.1rem, `#E8D5A3`, italic
- **Source/attribution**: Noto Kufi, 0.8rem, `#D4B98A`, right-aligned with em-dash prefix
- **Night reference badge**: Small pill at bottom-left
- **Min-height**: 180px (allows breathing room for shorter quotes)

### Reflection Card

**Visual purpose**: Short thought or concept reflection

- **Left border accent**: 3px solid `#D4B98A` on the right side (RTL context)
- **Title**: Scheherazade New, 1rem, `#D4B98A` (gold title = conceptual importance)
- **Body**: Noto Kufi, 0.9rem, `#C5B89A`
- **Tags/labels**: Small pill badges, gold border, bottom of card
- **Padding**: 20px right, 24px left (RTL consideration)

### Feature Card (4-Up Row)

**Visual purpose**: Communicate platform capabilities or features

- **No border**: Open, breathing design
- **Icon**: Custom SVG, 40×40px, gold (`#D4B98A`)
- **Title**: Scheherazade New, 1.1rem, `#E8D5A3`
- **Description**: Noto Kufi, 0.875rem, `#7A6E5E`, max 40 characters
- **Hover**: Icon glows with `drop-shadow(0 0 8px rgba(212, 185, 138, 0.5))`, title color → gold

### Action/CTA Buttons

**Primary Button**:
- Border: 1px solid `rgba(212, 185, 138, 0.6)`
- Background: `rgba(212, 185, 138, 0.08)` (slight warmth, mostly transparent)
- Color: `#D4B98A`
- Padding: 12px 32px
- Border-radius: 9999px (pill shape)
- Backdrop-filter: blur(4px) (glassmorphism effect)
- Font: Noto Kufi, 1rem

**Hover state**:
- Background → `rgba(212, 185, 138, 0.18)` (more opaque)
- Border → `rgba(212, 185, 138, 0.9)` (brightens)
- Shadow: Glow effect
- Vertical lift: `translateY(-2px)`

---

## HERO SECTION

### Conceptual Direction

The hero is a **cinematic gateway** into the Islamic learning experience. It establishes tone immediately: contemplative, reverent, culturally rooted, premium.

### Background Visual Concept

Imagine: The golden dome of Imam Hussein shrine at dusk, surrounded by masses of pilgrims carrying black and red flags. Dramatic storm clouds backlit by amber sunset. God rays cutting through atmosphere onto the dome's gold. Deep shadows everywhere except the dome. Only gold and crimson tones preserved; all else desaturated. IMAX-scale production value. No text, no watermark—pure visual grandeur.

**Overlay strategy**:
1. Base image layer (powerful, cinematic)
2. Dark gradient overlay: `rgba(13,11,9,0.3)` top → `rgba(13,11,9,0.85)` bottom (preserves image, darkens toward content)
3. Vignette: radial gradient (transparent center → `rgba(0,0,0,0.7)` edges) (draws focus inward)

### Content Placement

Vertically centered, horizontally centered container:

**Logo mark** → **"وعي"** (large, gold) → **"يمر من"** (same gold) → **"كربلاء"** (crimson red, italic) → **Metadata line** → **Subheading** → **CTA button**

All text uses `text-shadow: 0 0 60px rgba(212,185,138,0.4)` for legibility over image.

### Hero Typography Details

- **"وعي"**: `clamp(5rem, 14vw, 11rem)`, Scheherazade New, 700, `#D4B98A`
- **"يمر من"**: Same as above
- **"كربلاء"**: Same size, `#C0392B` (bright crimson), italic
- **Metadata**: 1rem, `#C5B89A`, tracking 0.15em, all-caps
- **Subheading**: 1.1rem, `#E8D5A3`, max-width 500px, centered

### Hero Scroll Indicator

Bottom center of hero: animated chevron pointing downward. Color: gold, subtle opacity, gently pulses (up/down motion, infinite loop).

---

## NAVIGATION DESIGN

### Desktop Navigation

**Fixed at top, full-width**
- Background: `rgba(13,11,9,0.85)` + `backdrop-filter: blur(12px)`
- Border-bottom: 1px solid subtle gold border
- Height: 72px
- Contains: Logo (left), Menu (center-right), CTA button (far right)

**Logo placement**: top-right corner (RTL), 44px height

**Menu links**:
- Color: `#C5B89A` (warm secondary)
- Font: Noto Kufi, 0.95rem
- Hover interaction: Underline emerges from center using `::after` pseudo-element (width: 0→100%, height: 1px, background: gold, transition: 0.3s)
- Active state: color → `#D4B98A`, underline stays

**CTA Button** ("جدول المحاضرات"):
- Border: 1px solid `rgba(139,30,30,0.5)` (subtle red)
- Background: `rgba(139,30,30,0.2)` (dark red tint)
- Color: `#D4B98A`
- Hover: Background → `rgba(139,30,30,0.4)`, border → `#8B1E1E`
- Icon: Optional calendar emoji or custom SVG

### Mobile Navigation

- Hamburger icon (top-right, gold)
- Full-screen overlay menu on tap
- Background: `#0D0B09` at 98% opacity
- Menu items stack vertically, 48px tall each
- Animated slide-in from top, staggered 60ms per item
- Close button (×) at top-right

---

## SECTION LAYOUTS

### Standard Section Container

Every major section follows this pattern:

**Header** (optional):
- Centered decorative divider: `── ◆  عنوان القسم  ◆ ──`
- Font: Scheherazade New for title, Noto Kufi for metadata
- Spacing below: 48px (mobile), 64px (desktop)

**Content Grid**:
- Responsive (1 col mobile, 2–3 col tablet, 4–6 col desktop)
- Cards or feature boxes arranged per component type

**Spacing surrounding**: 48px top/bottom (mobile), 96px (desktop)

### Night Lectures Section

**Carousel/Slider interaction**:
- Horizontal scrolling container
- 5 cards visible on desktop, 3 on tablet, 1.5 on mobile (peek next)
- Previous/Next arrows: circle buttons, 40px diameter, gold border
- Smooth scrolling, no jumping

### Featured Night Card

One card in the carousel is visually elevated:
- Border: 1px solid `rgba(212,185,138,0.4)` (brighter than neighbors)
- Background: `#232019` (lighter than standard)
- Box-shadow: enhanced gold glow
- Scale: 1.05 (slightly larger)

---

## ICONOGRAPHY SYSTEM

All icons are **custom SVG**, never icon fonts or libraries.

### Icon Style Guidelines

- **Aesthetic**: Vintage Islamic design with geometric flourishes
- **Color**: Gold (`#D4B98A`) on dark backgrounds
- **Stroke weight**: 1.5–2px for 40×40px icons
- **Fills vs. outlines**: Prefer outlines for elegance; solid fills for UI elements
- **Decorative base**: Islamic geometric ornaments at bottom of figurative icons

### Icon Inventory

**Microphone icon** — "Deep Lectures"
- Vintage microphone silhouette with ornate stand
- Geometric arabesque decorative base

**Document icon** — "Supporting Materials"
- Parchment scroll with calligraphic line marks
- Ornate corner flourishes

**Film reel icon** — "Visual Library"
- Ornate film frame with arabesque border detail
- Suggests motion and cinema without literal complexity

**Bell/Minaret icon** — "Follow & Notifications"
- Mosque minaret shape with crescent moon on top
- Islamic symbol for spiritual alertness

**Lock icon** — "Locked content indicator"
- Simple padlock, 20×20px
- Gold color

**Calendar icon** — "Schedule/Dates"
- Simple date grid
- Optional: small gold circle on current date

### Icon Usage Principles

- Scale consistently within components (40px for headers, 20px for inline)
- Use gold universally; never invert on light backgrounds (platform is dark-only)
- Add subtle glow on hover: `drop-shadow(0 0 8px rgba(212,185,138,0.5))`
- Never add drop shadows to icons themselves; rely on glow for elevation

---

## MOTION & ANIMATION PRINCIPLES

### Philosophy

Motion serves presence and emotion, not distraction. Animations feel natural, cultural, and deliberate.

### Easing & Timing

**Standard transition**: 0.35s cubic-bezier(0.4, 0, 0.2, 1)
- Feels premium and organic
- Never harsh linear motion
- Used for hover states, card transitions, color changes

**Stagger animations** (page load, carousel reveal):
- Base duration: 0.6s
- Delay increment: 60–120ms per item
- Creates visual rhythm without feeling robotic

**Scroll-triggered reveals**:
- Fade-in from 20px below
- Duration: 0.7s ease-out
- Triggers when element enters viewport (80px margin)
- Occurs only once

### Specific Animations

**Hero page load**:
1. Logo mark appears, 0.3s fade-in
2. "وعي" slides up from below, 0.6s, 0.3s delay
3. "يمر من" follows, 0.6s, 0.6s delay
4. "كربلاء" in red, 0.6s, 0.9s delay
5. Metadata line, 0.5s, 1.2s delay
6. Button, 0.5s, 1.4s delay
7. Scroll indicator, infinite pulse (up 20px, down 20px, 1.5s loop, 2s delay start)

**Card hover**:
- `translateY(-4px)` + shadow deepens + border brightens
- Transition: 0.35s
- Feels like card is floating above surface

**Button hover**:
- Color shift + subtle glow
- No transform (buttons feel grounded)
- Transition: 0.2s

**Carousel scroll**:
- Spring physics: stiffness 300, damping 30 (smooth, responsive feel)
- No strict timing; physics-based

**Gold shimmer on dividers** (optional, premium feel):
- `@keyframes goldShimmer`: background-position shifts 200% over 3s, infinite
- Creates gentle animation without distraction

### Micro-interactions

- **Input focus**: Underline grows from left to right (RTL), gold color
- **Form submission**: Brief loading state with pulsing gold dot
- **Share copy**: Button text flashes ✓ checkmark, reverts after 1.5s
- **Modal entrance**: Fade in + scale-up from 0.95, 0.4s

---

## RESPONSIVE DESIGN PRINCIPLES

### Mobile-First Mindset

The mobile experience is not compressed desktop. It's reconsidered.

**Mobile (`< 768px`)**
- Single column layout
- Large touch targets (44px minimum height for buttons)
- Generous vertical spacing (40px between sections)
- Hero reduced: `clamp(4rem, 18vw, 5rem)` for "وعي"
- Cards full-width with 16px padding
- Carousel: swipeable, 1.5-card peek
- All typography reduced 15–20% via `clamp()`
- No sidebar layouts; all content stacks
- Buttons: wider, easier to tap

**Tablet (`768px – 1024px`)**
- 2–3 column layouts where appropriate
- Hero text larger: `clamp(4rem, 12vw, 6rem)`
- Feature cards: 2×2 grid
- Carousel: 3 cards visible
- Sidebar navigation or drawer (not fixed)
- Balanced use of screen width

**Desktop (`> 1024px`)**
- Full multi-column layouts
- Hero at maximum scale
- Sidebar content regions
- Carousel: 5 cards visible
- Admin panels with complex layouts
- Maximum usable width: 1280px (centered)

### Breakpoint Philosophy

Use CSS fluid scaling (`clamp()`) rather than hard breakpoints where possible. Smooth transitions matter more than snapping to breakpoints.

### Touch-Friendly Design

- All interactive elements: minimum 44×44px
- Spacing between buttons: minimum 16px
- Text size on mobile: minimum 16px (prevents zoom-on-tap)
- Forms have ample padding, clear focus states

---

## VISUAL HIERARCHY SYSTEM

### Priority Levels

**Level 1 — Immediate Attention**
- Hero titles in large Scheherazade, gold
- Prominent section headers with decorative dividers
- Call-to-action buttons

**Level 2 — Primary Content**
- Body text in warm white (`#F0E8D8`)
- Card titles in light gold (`#E8D5A3`)
- Featured visual elements

**Level 3 — Supporting Information**
- Secondary text in warm tan (`#C5B89A`)
- Metadata, timestamps, captions
- Border elements

**Level 4 — Background/Tertiary**
- Muted gold (`#6B5A3E`)
- Decorative ornaments
- Edge elements

### Hierarchy Techniques

1. **Size**: Scheherazade scales aggressively; Noto Kufi sizes more subtly
2. **Color**: Gold draws eye; warm white supports; tan recedes
3. **Weight**: Bold (700) for emphasis; regular (400) for body
4. **Spacing**: Tight lines for importance, loose lines for subordinate
5. **Positioning**: Content above fold gets prominence; scroll content is secondary
6. **Isolation**: Generous white space isolates important elements

---

## PREMIUM ISLAMIC AESTHETIC PRINCIPLES

### Visual DNA

This design is unmistakably Islamic without being literal or heavy-handed.

1. **Gold as reverence**: Not gilding or excess; gold is earned through use
2. **Emptiness as design**: White space respects the sacred
3. **Calligraphy presence**: Scheherazade brings instant cultural identity
4. **Crimson accents**: Karbala's tragedy and honor in one color
5. **Geometric subtlety**: Ornaments hint at tradition without dominating
6. **Darkness as dignity**: Deep black is noble, not ominous
7. **Narrative flow RTL**: Language structure is identity structure

### What This Design Is NOT

- Not ornate or busy (no excessive tilework patterns)
- Not using bright primary colors (no electric blue, neon green)
- Not reliant on Arabic text for decoration (text is content)
- Not imitating Western luxury templates with gold overlays
- Not using generic Islamic stock imagery (imagery is elevated or none)
- Not careless about RTL (flow and spacing are intentional)

### What This Design IS

- Restrained and confident
- Rooted in culture without being culturally limiting
- Premium through craft, not decoration
- Legible and accessible at all scales
- Cohesive in every detail
- Respectful of the content's spiritual significance

---

## ATMOSPHERE & TEXTURE

### Background Treatment

All dark sections receive a subtle noise texture overlay at 3% opacity. This creates:
- Organic, non-digital feeling
- Sense of aged paper or canvas
- Prevents flat, sterile appearance
- Never distracting; purely atmospheric

### Vignetting

Cards and sections use vignette effects:
- Edges fade slightly darker
- Draws focus to center content
- Particularly strong on hero (directs eye to title)
- Subtle elsewhere (not dark, 10–20% opacity max)

### Depth Through Shadow

The shadow system creates three-dimensional space:
- Ambient shadows (cards at rest)
- Elevated shadows (hover/focus states)
- Glow shadows (gold accents catching light)
- Inset shadows (atmosphere on hero)

No harsh, black drop shadows. All shadows use dark brown and gold alpha tints for warmth.

---

## CONTENT VISUAL PRINCIPLES

### Typography in Context

**Quotes**: Always italicized Scheherazade to signal literary content. Opening quotation mark as decorative element.

**Lectures titles**: Scheherazade for the title, Noto Kufi for metadata (date, night number, speaker).

**Body paragraphs**: Noto Kufi with 1.75–1.8 line-height for comfort. Max line-length 720px on desktop.

**Callouts**: Small blocks of gold-bordered text with light background tint (`rgba(212,185,138,0.08)`).

### Image Presentation

- Always full-bleed on hero (no cropping for design)
- Card preview images: 200×140px, 8px border-radius, dark border
- Captions: Noto Kufi 0.8rem, gold color, centered below
- Never bright or saturated; maintain dark mood through color grading

### Audio/Video Elements

Audio players inherit the card aesthetic:
- Background `#1C1916`, gold border
- Play button: gold circular icon
- Progress bar: gold gradient fill, dark track
- Time/duration: gold text, 0.8rem

---

## ACCESSIBILITY & READABILITY

### Color Contrast

- Headline (gold) on black: 6.5:1 contrast (WCAG AAA)
- Body white on black: 8:1 contrast (WCAG AAA)
- Secondary tan on black: 5:1 contrast (WCAG AA)
- All text readable without relying solely on color

### Focus States

- Interactive elements show clear gold border on focus
- Focus ring: 2px solid gold, 2px offset
- Visible at all zoom levels

### Readability Principles

- No text smaller than 14px on mobile
- All text has sufficient line-height (1.7+)
- Line length never exceeds 75 characters
- High contrast between text and background
- Avoid pure black text (#000000); use warm off-white

---

## LAYOUT VARIATIONS

### Single-Column Content (Detail Pages)

- Center content, max-width 720px
- Generous side margins (20% of width)
- Hero section full-width
- Breadcrumb navigation at top
- Sidebar (if present) becomes full-width section below on mobile

### Two-Column Layouts (Desktop Feature Pages)

- Left: 70% content area
- Right: 30% sidebar (sticky, top: 100px)
- Mobile: stacked single column
- Dividing line: subtle gold border

### Grid Layouts (Card Displays)

- Desktop: 4-column (nights), 3-column (cards), responsive
- Tablet: 2-column
- Mobile: 1-column
- Gutters: 24px (desktop), 20px (tablet), 16px (mobile)
- No card stretching; all maintain aspect ratios

### Carousel/Slider Layouts

- Horizontal scroll with visible overflow
- Cards don't snap to grid; smooth scroll
- Previous/Next buttons flanking edges
- Mobile: full-height scroll, prevents zoom-on-tap

---

## FOOTER DESIGN

**Structure**: 4 columns (desktop), 2 columns (tablet), 1 column (mobile)

**Column 1**: Logo, tagline, opening quote, brand values

**Column 2**: Quick links (Noto Kufi, 0.9rem, gold on hover)

**Column 3**: Social icons (40px circles, gold border, hover: background tint + lift)

**Column 4**: Contact or secondary CTA (form, email, messaging)

**Bottom bar**: Copyright, dark text, centered on mobile, 0.8rem

**Background**: Same dark `#0D0B09`, border-top: 1px gold subtle

**Spacing**: 64px top, 32px bottom; generous throughout

---

## FINAL DESIGN PRINCIPLES

1. **Restraint over abundance**: Every element earns its place
2. **Coherence over complexity**: System flows from three core colors
3. **Culture first**: Never generic; always Islamic-rooted
4. **Legibility above all**: Premium requires readability
5. **RTL as identity**: Mirroring isn't afterthought; it's structure
6. **Emotion through craft**: Feelings emerge from intention, not decoration
7. **Luxury through simplicity**: Expensive materials used sparingly
8. **Reverence in every detail**: Design honors the content's significance

This system enables beautiful, culturally rooted, premium digital experiences for Islamic educational content. Apply these principles consistently across all surfaces.