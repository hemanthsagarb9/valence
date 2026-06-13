# Periodic Table Learning App — PRD v2
## Evidence-Based Interactive Chemistry Learning Tool

> **Research-informed design** — Every major feature maps to at least one published study with measured learning outcomes.

---

## 1. Vision

A web-based interactive periodic table that teaches chemistry through **prediction, exploration, and play** — not memorization. The app treats the periodic table as a *thinking tool* (Mhlongo 2025, d=0.83) rather than a reference chart, and uses gamification (Snakeleev, d=1.23–2.67) and progressive disclosure (Periodic Universe model) to build genuine conceptual understanding.

**Target users:** Students aged 13–22 (middle school → university intro chem), self-learners, teachers as a classroom aid.

---

## 2. Research Foundation

### 2.1 Key Studies Informing This Design

| Study | Key Finding | Effect Size | Feature it informs |
|-------|------------|-------------|-------------------|
| **Mhlongo (2025)** — Mixed-methods, Grade 11 | Teachers who use the periodic table as a *predictive tool* (not lookup) produce significantly better outcomes | d = 0.83 | Prediction-first interactions, bonding mode |
| **Snakeleev (2025)** — Gamified Snake game, n=51 | Thematic "diets" (e.g., "elements in a smartphone") drove huge learning gains, especially for classification | d = 1.23–2.67 | Thematic Collections, Element Hunt game |
| **Bierenstiel & Snow (2019)** — Periodic Universe, J. Chem. Ed. | Progressive simulated worlds → students conceptualize rather than memorize periodicity | Qualitative + quantitative gains | Progressive Discovery mode |
| **Schwarz et al. (2020)** — J. Chem. Ed. | Students overgeneralize trends from light elements; confuse free-atom vs bonded-atom configurations | — | Misconception alerts, nuanced trend displays |
| **Systematic Review: Game-Based Learning (2022)** — PMC | Games enhance conceptual understanding AND motivation; non-digital = digital in learning outcomes | Varies | Multiple game modes, accessibility focus |
| **Garg et al. (2022)** — Interactive tools, 228K+ users | Real-world connections + interactivity + free access = global scale | — | Real-world connections, free/open design |
| **POGIL approach** — Process Oriented Guided Inquiry | Peer discussion + guided facilitation addresses misconceptions effectively | — | Guided inquiry prompts, step-by-step explanations |

### 2.2 Evidence-Based Design Principles

1. **Prediction before revelation** — Always ask the student to predict before showing the answer (Mhlongo)
2. **Real-world anchoring** — Every element connects to tangible, everyday applications (Snakeleev, Garg)
3. **Progressive complexity** — Start simple, add layers (Periodic Universe's 6 worlds)
4. **Active classification** — Learning through sorting/categorizing, not reading (Snakeleev diets)
5. **Misconception-aware** — Surface common errors at the point of learning (Schwarz, POGIL)
6. **Rapid feedback loops** — Immediate visual/textual feedback on every interaction (Game-based learning review)
7. **Multiple representations** — Same concept shown as text, visual, 3D model, and interaction (Garg)

---

## 3. Core Architecture

### 3.1 Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS (light mode, warm palette)
- **3D:** React Three Fiber + Drei (electron shell visualizations)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Data:** Static TypeScript/JSON (no backend for MVP)
- **State:** React state + URL params (shareable states)
- **Storage:** localStorage for progress, streaks, quiz history

### 3.2 Data Model

```typescript
interface Element {
  // Identity
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number | null;

  // Position
  group: number | null;
  period: number;
  block: "s" | "p" | "d" | "f";
  category: ElementCategory;
  row: number;  // grid position
  col: number;

  // Physical properties
  phaseAtRoomTemp: "solid" | "liquid" | "gas" | "unknown";
  meltingPoint: number | null;
  boilingPoint: number | null;

  // Electronic structure
  electronConfiguration: string;
  shells: number[];
  valenceElectrons: number | null;
  commonIons: string[];
  commonOxidationStates: number[];

  // Trends
  electronegativity: number | null;
  atomicRadius: number | null;
  ionizationEnergy: number | null;

  // Pedagogical content
  summary: string;              // Level-appropriate explanation
  realWorld: string;            // Everyday applications
  abundance: string;            // Where found on Earth/universe
  funFact: string;              // Memorable hook
  discoveryStory: string;       // Brief history
  commonMisconception?: string; // What students get wrong about this element
}

interface ThematicCollection {
  id: string;
  name: string;                 // "Elements in Your Smartphone"
  description: string;
  elements: number[];           // atomic numbers
  category: "technology" | "biology" | "history" | "environment" | "space" | "everyday";
  difficulty: LearningLevel;
  source?: string;              // attribution
}

interface UserProgress {
  elementsExplored: Set<number>;
  quizHistory: QuizAttempt[];
  streakDays: number;
  lastVisit: string;
  level: LearningLevel;
  collectionsCompleted: string[];
  predictionsCorrect: number;
  predictionsTotal: number;
  misconceptionsSurfaced: string[];
  weakAreas: TrendType[];       // from quiz analysis
}
```

---

## 4. Modes & Features

### 4.1 Explore Mode (Default)

**Research basis:** Garg (real-world connections), Mhlongo (table as tool)

The periodic table as an interactive exploration surface.

**Element cells show:**
- Symbol, atomic number
- Color-coded by category
- Hover: name, atomic mass, phase icon
- Click: opens Element Detail panel

**Element Detail Panel:**
- 3D Bohr model electron shell (React Three Fiber)
- Core data grid (mass, valence electrons, shells, common ions)
- Level-appropriate explanation (beginner → school → advanced)
- "In the Real World" — what it's used for
- "Where Is It Found?" — Earth abundance, universe context
- "Fun Fact" — memorable hook for retention
- Family info with memory hooks
- Actions: Compare, Bond, Add to Collection

**Level toggle** (beginner / school / advanced):
- Beginner: Plain language, focus on shells and stability
- School: Period, group, oxidation states, ion formation
- Advanced: Electron configuration, electronegativity, ionization energy, melting/boiling points

---

### 4.2 Trends Mode

**Research basis:** Schwarz (overgeneralization of trends), POGIL (guided inquiry)

Interactive visualization of periodic trends with **prediction prompts**.

**Flow:**
1. User selects a trend (atomic radius, ionization energy, electronegativity, metallic character)
2. **Prediction prompt:** "Before we show you — which direction do you think [trend] increases across a period? ↗ ↘ →"
3. User makes prediction
4. Table animates to show the trend as a color gradient
5. Comparison to prediction: "You predicted ↗ — that's correct! Here's why..."
6. Explanation panel shows the *mechanism* (nuclear charge, shielding, etc.)

**Misconception alerts:** When displaying trends, show callout boxes for common errors:
- "Common mistake: Students often think atomic radius increases across a period because more electrons = bigger. Actually, more protons pull electrons closer."
- "Watch out: This trend breaks down for heavier elements (Period 6+) due to relativistic effects."

**Trend comparison:** Select two trends to overlay and see correlations.

---

### 4.3 Bonding Lab

**Research basis:** Mhlongo (predictive tool), POGIL (guided inquiry)

A "what happens when these two elements meet?" interactive lab.

**Flow:**
1. Select Element A
2. **Prediction prompt:** "Before picking Element B — what type of bond do you think [Element A] typically forms? Why?"
3. Select Element B
4. **Prediction prompt:** "What do you predict will happen? Ionic / Covalent / Metallic / No reaction?"
5. User predicts → reveal with step-by-step explanation
6. Show: bond type, compound formula, compound name, ion formation, charge balancing
7. 3D visualization of electron transfer (ionic) or sharing (covalent)

**Compound library:** Known compounds with names (NaCl → Sodium chloride, H₂O → Water, etc.)

**Guided challenges:**
- "Can you find a combination that makes table salt?"
- "What happens when two metals meet?"
- "Find a noble gas that CAN form a compound" (XeF₂ — advanced)

---

### 4.4 Thematic Collections ⭐ (New — from Snakeleev)

**Research basis:** Snakeleev (d=2.67 for classification tasks), Garg (real-world connections)

This is the highest-impact new feature based on the research. Thematic groupings that connect elements to real life.

**Collections (41 inspired by Snakeleev + originals):**

**Technology:**
- Elements in Your Smartphone (Si, Li, Co, In, Sn, Ta, Au, Cu, Ag, Nd, Pr, Dy, Ga, Ge...)
- Elements in a Computer Chip
- Elements in an Electric Car Battery
- Elements in LED Lights

**Biology & Health:**
- Elements in the Human Body (O, C, H, N, Ca, P, K, S, Na, Cl, Mg, Fe...)
- Elements in DNA (C, H, O, N, P)
- Elements Used in Medicine (Tc, I, Gd, Pt, Li, Ba...)
- Essential Trace Elements (Fe, Zn, Cu, Mn, I, Se, Mo, Cr, Co)

**Environment & Space:**
- Most Abundant in Earth's Crust (O, Si, Al, Fe, Ca...)
- Most Abundant in the Universe (H, He, O, C, Ne, Fe...)
- Elements in Seawater
- Radioactive Elements
- Critical Raw Materials (EU list)

**History & Culture:**
- Elements Known Since Antiquity (Au, Ag, Cu, Fe, Sn, Pb, Hg, S, C)
- Elements Named After Scientists
- Elements Named After Places
- Elements with Greek/Latin Names

**Everyday Life:**
- Elements in Your Kitchen
- Elements in Fireworks (Sr=red, Ba=green, Cu=blue, Na=yellow)
- Elements in Paint Pigments
- Elements in Cleaning Products

**Interaction:**
- Browse collections → highlighted on periodic table
- Click highlighted elements → see WHY they're in this collection
- "Did you know?" facts per element-collection pair
- Collection completion tracking

---

### 4.5 Element Hunt Game ⭐ (New — from Snakeleev)

**Research basis:** Snakeleev (d=1.23–2.67), Game-based learning review

A timed challenge game inspired by Snakeleev's mechanics but adapted for a periodic table interface.

**Game modes:**

**Mode A — "Find It!" (Symbol ↔ Name)**
- Flash an element name → tap the correct cell on the periodic table
- Or flash a symbol → type the full name
- Timer + streak counter
- Difficulty scales: first 20 → first 40 → all 118

**Mode B — "Sort It!" (Classification)**
- Given a thematic collection (e.g., "Elements in a smartphone")
- Tap all elements that belong — green flash for correct, red for wrong
- Score: precision % (correct / total tapped)
- Leaderboard (local, per collection)

**Mode C — "Predict It!" (Trends)**
- Show two elements → "Which has higher electronegativity?"
- Or: "Arrange these 4 elements by atomic radius"
- Builds intuition for periodic trends through repeated low-stakes practice

**Mode D — "Build It!" (Compounds)**
- Given a compound name → select the right elements and predict the formula
- "Build table salt" → select Na + Cl → NaCl ✓
- "Build rust" → select Fe + O → Fe₂O₃ ✓

**Game mechanics (from Snakeleev research):**
- Speed customization (5 difficulty levels)
- Immediate visual feedback (green/red)
- "Stay Hungry! Stay Periodic!" style motivational end screens
- Random fun facts on game-over screen
- Session stats: accuracy %, elements learned, time played
- First 10 minutes = biggest gains (design sessions around this)

---

### 4.6 Progressive Discovery Mode ⭐ (New — from Periodic Universe)

**Research basis:** Bierenstiel & Snow (2019) — Periodic Universe model

Students *rebuild* the periodic table from scratch, discovering WHY it's organized the way it is.

**Worlds (progressive levels):**

**World 1 — "The First 8"**
- Given: H, He, Li, Be, B, C, N, O with their electron shells and basic properties
- Task: "Arrange these elements in a way that groups similar ones together"
- Discovery: Students find that elements with similar valence electrons behave similarly
- Reveal: "You just discovered the concept of GROUPS!"

**World 2 — "Adding Rows"**
- Add Na, Mg, Al, Si, P, S, Cl, Ar
- Task: "These new elements are similar to ones you already placed. Where do they go?"
- Discovery: Periodicity — properties repeat in cycles
- Reveal: "You just discovered PERIODS!"

**World 3 — "The Transition Challenge"**
- Add first-row transition metals
- Task: "These don't fit the simple pattern. Can you find where they belong?"
- Discovery: d-block elements, expanded table
- Hint system if stuck

**World 4 — "Predict the Unknown"**
- Show gaps in the table → "What properties would an element HERE have?"
- Students predict valence electrons, metallic character, likely charge
- Reveal: the actual element and its properties
- This mirrors how Mendeleev predicted undiscovered elements

**World 5 — "Full Table"**
- Complete periodic table construction
- Lanthanide/actinide placement challenge
- Celebrate completion

**Scoring:** Based on number of hints used, prediction accuracy, time taken.

---

### 4.7 Quiz Mode (Enhanced)

**Research basis:** Spaced repetition research, formative assessment, POGIL

**Question types:**
- Multiple choice (properties, identification)
- True/false (misconception repair — frame common errors as statements)
- Comparison ("Which element has higher electronegativity: F or Cl?")
- Formula builder ("What compound do Na and Cl form?")
- Prediction ("Element X has 2 valence electrons. It's likely a ___")
- Classification ("Which of these elements are in your smartphone?")

**Spaced repetition:**
- Track which questions were answered incorrectly
- Resurface missed questions with increasing intervals (1, 3, 7, 14 days)
- localStorage-based — no account needed
- "Review Queue" shows due items

**Misconception-targeted questions:**
- "Atoms with more electrons are always larger. True or false?" (False — nuclear charge)
- "Noble gases can NEVER form compounds. True or false?" (False — XeF₂)
- "Atomic number = number of protons = number of neutrons. True or false?" (False — neutrons differ)

**Adaptive difficulty:**
- Start at user's selected level
- If accuracy > 80% for 10 questions, suggest moving up
- If accuracy < 50%, offer hint mode or suggest level down

---

### 4.8 Compare Mode

**Research basis:** Pattern recognition, comparative reasoning

Side-by-side comparison of any two elements.

**Shows:**
- Visual diff of properties (which is bigger, which is more electronegative)
- Electron shell comparison (3D side by side)
- "Similarities" — what they have in common
- "Differences" — key distinguishing properties
- "Key Insight" — the most important takeaway
- "What would happen if they bonded?" → link to Bonding Lab

---

### 4.9 Family Explorer

**Research basis:** Classification and pattern recognition

Highlight element families with shared behavior.

**Per family:**
- Which elements belong and where they sit on the table
- Valence electron pattern
- Common behavior (e.g., "Alkali metals react violently with water")
- Memory hook ("Halogens = 'salt formers'")
- Real-world examples
- Interactive: "Tap any family member to see its details"

---

## 5. Misconception Repair System

**Research basis:** Schwarz (2020), POGIL, Mhlongo (2025)

A cross-cutting feature that surfaces common misconceptions contextually.

**Implementation:**
- Each misconception is tagged to specific elements, trends, or interactions
- When a student views relevant content, a subtle "⚠️ Common Mistake" callout appears
- Clicking expands to show: the misconception, why it's wrong, and the correct understanding

**Top 15 Misconceptions to Address:**

1. "Bigger atomic number = bigger atom" (No — atomic radius decreases across a period)
2. "Atoms want 8 electrons" (Anthropomorphism — atoms don't "want" anything; octets are stable configurations)
3. "Atomic number = mass number" (No — mass includes neutrons)
4. "Noble gases never react" (XeF₂, XeF₄ exist)
5. "Metals are always solid" (Mercury is liquid, Cesium melts at 28°C)
6. "Electron shells fill in order 1, 2, 3, 4..." (Aufbau: 4s fills before 3d)
7. "Electronegativity and electron affinity are the same" (Different concepts)
8. "Isotopes are different elements" (Same element, different neutrons)
9. "Ionic bonds are stronger than covalent" (Depends on context)
10. "Electrons orbit like planets" (Useful model but quantum reality is different)
11. "All metals are shiny and hard" (Sodium is soft, potassium too)
12. "Hydrogen is a metal because it's in Group 1" (It's a nonmetal with unique properties)
13. "Oxidation always involves oxygen" (Historical name; it means electron loss)
14. "Double bonds are twice as strong as single bonds" (Not exactly — about 1.5–1.8x)
15. "The periodic table was always organized this way" (Many versions exist; current form evolved)

---

## 6. Gamification & Retention

**Research basis:** Snakeleev (engagement metrics), spaced repetition research

### 6.1 Progress Tracking
- Elements explored counter (X/118)
- Collections completed
- Quiz accuracy by topic
- Prediction accuracy (bonding, trends)
- Daily streak (encourages return visits)

### 6.2 Achievements
- "First Contact" — Explore your first element
- "Full House" — Explore all 118 elements
- "Trend Spotter" — Correctly predict 10 trends in a row
- "Bond Builder" — Successfully predict 20 bond types
- "Speed Demon" — Complete Element Hunt in under 60 seconds
- "Collector" — Complete 5 thematic collections
- "Mendeleev" — Complete Progressive Discovery mode
- "Myth Buster" — Encounter all 15 misconception alerts
- "Smartphone Scientist" — Complete the "Elements in Your Smartphone" collection

### 6.3 Session Design
- Optimize for **10-minute sessions** (Snakeleev: biggest gains in first 10 min)
- Game modes auto-suggest stopping after 10–15 minutes
- "Quick Review" mode: 5 questions from spaced repetition queue
- End-of-session summary: "Today you learned about 7 new elements and got 85% on trend predictions"

---

## 7. UI/UX Design — "The Innovative Part"

> **Design philosophy:** The periodic table IS the interface. Not a chart you look at — a world you explore. Every pixel teaches. Every interaction reveals.

### 7.1 Design Language: "Elemental"

**Core concept:** Inspired by Brilliant.org's "learn by doing" and Apple's spatial design, but unique — a **glassmorphic science lab** aesthetic. The UI should feel like a high-end research instrument: precise, beautiful, and alive with data.

**Color System:**
```
Background:     #FAFAF8 (warm ivory) → #F0F0EC (section backgrounds)
Surface:        white with subtle warm shadow (0 2px 12px rgba(0,0,0,0.06))
Glass panels:   white/80% opacity + backdrop-blur-xl (element details, modals)
Category base:  10 distinct hues, used at 3 intensities:
                - Cell fill (10% opacity)
                - Cell border on hover (40% opacity)
                - Active/selected state (full saturation)
Accent:         Emerald (#10B981) for primary actions, progress
Success:        Green (#22C55E) for correct answers
Error:          Rose (#F43F5E) for incorrect, gentle not alarming
Trend gradient: Blue → White → Red (cool → neutral → hot)
```

**Typography:**
```
Display:        Inter Display (or Instrument Serif for the "wow" moments)
                — element symbols at 28px bold, element names at 13px medium
Body:           Inter — clean, readable, optimized for data-dense UI
Mono:           JetBrains Mono — electron configurations, formulas
Subscripts:     Real Unicode subscripts (₁₂₃) not CSS tricks
```

**Elevation system (3 layers):**
```
Layer 0:  Periodic table grid (flat, on the background)
Layer 1:  Floating panels (glass effect, subtle shadow, slide in from edges)
Layer 2:  Modals, game overlays (darker scrim + centered glass card)
```

---

### 7.2 The Periodic Table — A Living Grid

**Not just colored squares.** Each element cell is a micro-universe:

```
┌─────────────┐
│  7      14.01│  ← atomic number (top-left, 10px, muted)
│              │     atomic mass (top-right, 10px, muted)
│      N       │  ← symbol (center, 24px bold, high contrast)
│   Nitrogen   │  ← name (center-bottom, 11px)
│  ● ● ● ● ●  │  ← valence dots (bottom, tiny circles = valence electrons)
└─────────────┘
```

**Valence electron dots** — The signature innovation. Below each element name, tiny dots represent valence electrons. At a glance, you can see patterns across the entire table:
- Group 1: one dot
- Group 2: two dots
- Group 17: seven dots
- Group 18: eight dots (full ring)
- Transition metals: dots show most common oxidation state

**Hover state — "The Bloom":**
- Cell gently scales up (1.05x) with spring animation
- Background intensifies to full category color
- A soft radial glow appears behind the cell
- Neighboring elements dim slightly (focus effect)
- Tooltip shows: phase icon (🧊💧💨), electronegativity bar, electron config preview

**Selected state — "The Expand":**
- Cell border pulses once (like a heartbeat)
- Category color ring appears
- Connected elements highlight (same group, same period, same family)

**Bonding mode selection:**
- First element selected: pulsing amber glow
- Compatible elements get a subtle shimmer animation
- Incompatible (noble gases) get a "shield" icon overlay
- Second element selected: a "lightning bolt" particle effect connects the two cells briefly before the bonding panel opens

---

### 7.3 Layout Architecture — Bento-Inspired

**Desktop layout (≥1280px):**
```
┌──────────────────────────────────────────────────────────────────────┐
│  🔬 Periodic Table Lab    [Explore▾] [⚡Beginner▾] [🔍 Search...]  │  ← Top bar
├──────────────────────────────────────────────────────────┬───────────┤
│                                                          │           │
│                                                          │  Element  │
│              18-column periodic table grid                │  Detail   │
│              (centered, with period labels               │  Panel    │
│               on left, group numbers on top)             │           │
│                                                          │  (glass   │
│              Lanthanides row                              │   panel,  │
│              Actinides row                                │   slides  │
│                                                          │   in)     │
│                                                          │           │
├──────────────────────────────────────────────────────────┴───────────┤
│  [Collection pills: 📱Smartphone | 🧬DNA | 🌍Earth's Crust | ...]  │  ← Bottom bar
└──────────────────────────────────────────────────────────────────────┘
```

**The right panel is a "drawer" — glassmorphic, slides in from right:**
- Element detail: 380px wide
- Bonding panel: 420px wide
- Compare: 500px wide (two columns)
- Stacks if multiple panels open (like macOS sheets)
- Swipe to dismiss on touch devices

**The bottom collection bar** — horizontal scroll of "pill" buttons:
- Each pill has an emoji + label
- Active collection highlights matching elements on the grid
- Smooth fade animation for non-matching elements (they don't disappear, they dim to 30% opacity)
- A counter shows "12/18 explored" for each collection

**Tablet (768–1279px):**
- Full grid visible
- Panels overlay from bottom (sheet style, 60% height)
- Drag handle to expand to full screen

**Mobile (< 768px):**
- Grid is horizontally scrollable with momentum
- "Mini-map" indicator shows which section is visible
- Tap element → full-screen detail card (swipe left/right to navigate elements)
- Bottom tab bar: Explore | Trends | Bond | Play | Quiz

---

### 7.4 Panel Design — "Glass Cards"

All information panels use a consistent glassmorphic card system:

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
}
```

**Element Detail Card layout:**
```
┌──────────────────────────────┐
│ ┌──────┐                  ✕  │
│ │  Na   │  Sodium             │  ← Header: symbol box + name + category tag
│ │  11   │  Alkali Metal       │     Symbol box uses category bg color
│ └──────┘  Group 1 · Period 3  │
├──────────────────────────────┤
│                              │
│    ╭─── 3D Electron Shell ──╮│  ← Three.js canvas, Bohr model
│    │    ⚛️  (2, 8, 1)       ││     Valence shell glows amber
│    ╰────────────────────────╯│     Touch to rotate, pinch to zoom
│                              │
├───────┬───────┬──────────────┤
│ Mass  │ Phase │ Valence e⁻   │  ← Bento mini-grid of key stats
│ 22.99 │ Solid │ 1            │     Each cell is a tiny rounded card
├───────┴───────┤ Common Ion   │
│ Shells        │ Na⁺          │
│ 2, 8, 1       │              │
├───────────────┴──────────────┤
│ 💡 Core Idea                 │  ← Blue info card
│ Sodium has 1 electron in its │     Level-aware content
│ outer shell. It becomes      │     (beginner/school/advanced)
│ stable by losing it.         │
├──────────────────────────────┤
│ 🌍 In the Real World        │  ← Green info card
│ Table salt (NaCl), street    │
│ lights, baking soda...       │
├──────────────────────────────┤
│ 🏔️ Where Is It Found?      │  ← Violet info card
│ 6th most abundant element    │
│ in Earth's crust...          │
├──────────────────────────────┤
│ 🧠 Memory Hook              │  ← Amber info card (from family)
│ "Alkali metals are the       │
│ drama queens of chemistry"   │
├──────────────────────────────┤
│ [⇄ Compare]    [⚗️ Bond]    │  ← Action buttons
└──────────────────────────────┘
```

---

### 7.5 Micro-Interactions & Animation System

**Philosophy:** Every animation teaches something or provides feedback. No decorative motion.

**Framer Motion spring presets:**
```typescript
const springs = {
  gentle:  { type: "spring", stiffness: 120, damping: 20 },   // panels, cards
  snappy:  { type: "spring", stiffness: 300, damping: 25 },   // hover, selection
  bouncy:  { type: "spring", stiffness: 400, damping: 10 },   // success celebrations
  smooth:  { type: "tween", duration: 0.3, ease: "easeOut" }, // fades, opacity
};
```

**Key animations:**

| Interaction | Animation | Purpose |
|-------------|-----------|---------|
| Element hover | Scale 1.05 + glow bloom | Focus attention, feel alive |
| Element select | Border pulse + connected highlights | Show relationships |
| Panel open | Slide in from right + fade | Spatial consistency |
| Trend reveal | Color wave across grid (left→right, top→bottom) | Show the DIRECTION of the trend |
| Bond prediction reveal | "Explosion" of particles between two elements | Emotional payoff, memorable |
| Correct answer (quiz) | Confetti burst from answer button | Celebration, dopamine |
| Wrong answer (quiz) | Gentle shake + element briefly highlights the correct one | Learn from error |
| Collection activate | Matching elements "rise" (translateY -2px), others fade | Pattern recognition |
| Achievement unlock | Gold ring expands from center + badge appears | Reward milestone |
| Streak counter | Flame icon grows with each day | Continuity motivation |
| 3D shell rotate | Continuous slow spin, speed up on hover | Always alive, inviting interaction |
| Electron transfer (ionic bond) | Electron dot animates from metal → nonmetal | TEACHES the concept visually |

**Trend color wave** — the standout animation:
When switching to a trend (e.g., electronegativity), instead of instant color change:
1. A wave ripples across the grid from the direction of increase
2. Each cell transitions its background color with a staggered delay
3. The wave takes ~800ms total
4. This animation *teaches the direction of the trend* — students see it moving

---

### 7.6 Game Mode UI — "The Arena"

When entering a game mode (Element Hunt, Quiz), the UI transforms:

**Transition:** The periodic table smoothly pushes back (scale 0.9, blur slight) and a game overlay fades in on top. The table remains visible as context.

**Game HUD:**
```
┌──────────────────────────────────────────────┐
│  🎯 Element Hunt: Smartphone Elements        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 72%           │  ← Progress bar with %
│  ⏱ 1:42    🎯 13/18    ⚡ 5 streak          │  ← Timer, score, streak
├──────────────────────────────────────────────┤
│                                              │
│     [ Periodic table with interactive cells  │
│       — tap to select, green/red flash ]     │
│                                              │
├──────────────────────────────────────────────┤
│  Find: "Used in phone batteries"    [Skip →] │  ← Current challenge
└──────────────────────────────────────────────┘
```

**Game-over screen:**
```
┌──────────────────────────────────────────────┐
│                                              │
│           🧪 Stay Hungry!                    │
│           Stay Periodic!                     │
│                                              │
│     ┌─────────┬─────────┬─────────┐          │
│     │ Score   │ Accuracy│ Streak  │          │
│     │  156    │  89%    │  7 🔥   │          │
│     └─────────┴─────────┴─────────┘          │
│                                              │
│  💡 Did you know?                            │
│  Tantalum (Ta) in your phone comes from      │
│  coltan ore, mostly mined in Congo.          │
│                                              │
│  [🔄 Play Again]  [📊 See Details]           │
└──────────────────────────────────────────────┘
```

---

### 7.7 Progressive Discovery UI — "World Builder"

The most innovative UI mode. The periodic table starts **empty**.

```
┌──────────────────────────────────────────────┐
│  🌍 World 1: The First 8                     │
│  "Arrange these elements by their behavior"  │
├──────────────────────────────────────────────┤
│                                              │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                    │
│  │ H │ │ He│ │ Li│ │ Be│  ← Draggable cards │
│  └───┘ └───┘ └───┘ └───┘    with element    │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐    data shown      │
│  │ B │ │ C │ │ N │ │ O │                     │
│  └───┘ └───┘ └───┘ └───┘                     │
│                                              │
│  ╔═══╤═══╤═══╤═══╤═══╤═══╤═══╤═══╗          │
│  ║   │   │   │   │   │   │   │   ║          │
│  ╟───┼───┼───┼───┼───┼───┼───┼───╢ ← Empty  │
│  ║   │   │   │   │   │   │   │   ║   grid   │
│  ╚═══╧═══╧═══╧═══╧═══╧═══╧═══╧═══╝   slots │
│                                              │
│  Hint: Look at the valence electrons...  [💡]│
├──────────────────────────────────────────────┤
│  Progress: ████████░░░░░░░░ World 1 of 5    │
└──────────────────────────────────────────────┘
```

**Drag & drop with physics:**
- Cards have subtle inertia when dragged
- Snap to grid slots with a satisfying "click" haptic
- Wrong placement → card bounces back with a gentle wobble
- Correct region → slot glows green briefly
- When a row is complete → "discovery moment": text animates in explaining what they just found

---

### 7.8 Prediction Prompts — "Think First" Cards

Before revealing information, a prediction card appears:

```
┌──────────────────────────────────────────┐
│  🤔 What do you think?                   │
│                                          │
│  Which has higher electronegativity?     │
│                                          │
│  ┌─────────┐    or    ┌─────────┐       │
│  │   Na    │          │   Cl    │       │
│  │  Sodium │          │Chlorine │       │
│  └─────────┘          └─────────┘       │
│                                          │
│  [ Na is higher ]    [ Cl is higher ]    │
│                                          │
│  ─── or ───                              │
│  [ I'm not sure — show me ]             │
└──────────────────────────────────────────┘
```

After answering:
- Correct: Card flips to green, confetti, explanation
- Wrong: Card flips to amber, gentle explanation, "Here's why..."
- "Not sure": Card fades to explanation (no penalty, learning moment)

---

### 7.9 The "Wow" Moments

**1. Element connection lines:**
In families mode, when hovering over any element, faint SVG lines draw to all elements in the same family — like a constellation map. The lines animate in with a staggered delay, creating a "web of connections" effect.

**2. Trend heat map mode:**
Toggle a trend overlay and the entire table becomes a heat map. But instead of static colors, each cell's intensity gently pulses — like the table is breathing. Higher values pulse slightly faster, creating an organic feel.

**3. Electron transfer animation (Bonding Lab):**
When an ionic bond is predicted, the 3D view shows:
- Metal atom's valence electron(s) glow brighter
- They detach and float across to the nonmetal
- Both atoms resize (metal shrinks = cation, nonmetal grows = anion)
- They snap together with a satisfying "click"
- The compound formula builds letter by letter below

**4. The "Mendeleev moment" (Progressive Discovery):**
When a student correctly predicts the properties of an element in a gap:
- The empty cell fills in with a typewriter animation
- A brief historical note appears: "Mendeleev made this exact prediction in 1871!"
- Gold sparkle effect

**5. Collection "reveal" animation:**
When activating a thematic collection (e.g., "Elements in Your Smartphone"):
- Non-matching elements gracefully sink down and desaturate
- Matching elements rise up, glow, and a thin line connects them
- A phone illustration briefly appears in the center of the table, then dissolves
- Each matching element gets a tiny icon (📱) that fades in

---

### 7.10 Accessibility & Performance

**Accessibility (WCAG 2.1 AA):**
- All category colors pass 4.5:1 contrast ratio on their backgrounds
- Keyboard navigation: arrow keys between cells, Tab for panels, Enter to select
- Screen reader: each cell announces "Sodium, element 11, alkali metal, solid, 1 valence electron"
- Reduce motion: `prefers-reduced-motion` disables all spring animations, uses instant transitions
- Color-blind modes: patterns (stripes, dots, crosshatch) supplement colors for categories
- Focus rings: visible, consistent, high-contrast

**Performance targets:**
- First paint: < 1.5s
- Interactive: < 3s
- 3D shell render: < 500ms per element
- Animation frame rate: 60fps (drop to 30fps on low-power devices)
- Total JS bundle: < 200KB gzipped (code-split Three.js, load on first element click)
- Lazy load: 3D shells, game modes, quiz data
- Service worker for offline support (all element data cached)

**Responsive breakpoints:**
```
Mobile:   < 640px   (scrollable grid, bottom sheets, tab bar)
Tablet:   640–1023px (full grid, overlay panels)
Desktop:  1024–1279px (grid + narrow sidebar)
Wide:     ≥ 1280px  (grid + full sidebar, comfortable spacing)
```

---

## 8. Design Inspiration & References

| Reference | What to take from it |
|-----------|---------------------|
| **Brilliant.org** | Learn-by-doing philosophy, no passive content, every screen is interactive. XP + streaks + leagues motivation system. Tangram loading animations (thematic, not generic). Dark-on-light clean aesthetic. |
| **Duolingo** | Micro-celebrations (confetti, sounds), streak psychology, bite-sized sessions, playful illustrations, the "one more lesson" hook |
| **Apple Weather app** | Data-dense but beautiful, gradient backgrounds that encode information, smooth transitions between detail levels |
| **Cuberto periodic table concept** | Element cell animations, fluid transitions between grid and detail views |
| **Zperiod.app** | 3D atom models in context, swipeable info cards |
| **CapWords (Apple Design Award 2025)** | Real-world-object → learning-card pipeline, sensory feedback (sound + visual), everyday context for abstract concepts |
| **Bento grid trend (2025-26)** | Modular card layouts for dense data, varying card sizes for visual hierarchy, hover-to-reveal secondary data |
| **Glassmorphism (2025-26)** | Used sparingly for floating panels — creates depth without heaviness. Not the whole UI, just overlays. |

---

## 9. Information Architecture

```
/                           → Explore mode (default)
  ├── ?mode=explore         → Standard periodic table
  ├── ?mode=trends          → Trend visualization
  ├── ?mode=bonding         → Bonding lab
  ├── ?mode=families        → Family explorer
  ├── ?mode=collections     → Thematic collections
  ├── ?mode=discover        → Progressive discovery
  ├── ?mode=hunt            → Element hunt game
  ├── ?mode=quiz            → Quiz mode
  └── ?mode=compare         → Compare mode

  ?element=Na               → Auto-open element detail
  ?compare=Na,Cl            → Auto-open comparison
  ?bond=Na,Cl               → Auto-open bonding
  ?collection=smartphone    → Auto-highlight collection
  ?level=beginner|school|advanced
```

---

## 10. MVP Scope (Phase 1)

**Ship first, iterate fast.**

### Must Have (Week 1–2)
- [x] Interactive periodic table with all 118 elements
- [x] Element detail panel with 3D electron shells
- [x] Three learning levels
- [x] Category color coding
- [x] Search
- [x] Trends mode with gradient visualization
- [x] Bonding lab with formula + compound naming
- [x] Compare mode
- [x] Family explorer
- [x] Real-world applications per element
- [x] Quiz mode

### Phase 2 (Week 3–4) — Research-Driven Features
- [ ] Thematic Collections (Snakeleev-inspired)
- [ ] Element Hunt game (Find It! + Sort It! modes)
- [ ] Prediction prompts in Trends and Bonding modes
- [ ] Misconception alerts (top 15)
- [ ] Spaced repetition in quiz mode
- [ ] Progress tracking (localStorage)

### Phase 3 (Week 5–6) — Deep Learning
- [ ] Progressive Discovery mode (Periodic Universe-inspired)
- [ ] Predict It! and Build It! game modes
- [ ] Adaptive quiz difficulty
- [ ] Achievement system
- [ ] Session summaries
- [ ] Shareable URLs for specific states

### Phase 4 (Future)
- [ ] Electron transfer/sharing 3D animations in bonding mode
- [ ] Multiplayer Element Hunt (classroom mode)
- [ ] Teacher dashboard (assign collections, view progress)
- [ ] PWA / offline support
- [ ] Additional languages
- [ ] AR mode (camera-based element identification)

---

## 11. Success Metrics

Based on the research, we should measure:

| Metric | Target | Research Basis |
|--------|--------|---------------|
| Symbol-name recall improvement | +30% after 10 min (Snakeleev: +30%) | Snakeleev A-test |
| Classification accuracy | +50% after 20 min (Snakeleev: d=2.67) | Snakeleev C-test |
| Trend prediction accuracy | >70% after 3 sessions | POGIL outcomes |
| Bond type prediction | >80% accuracy after practice | Mhlongo |
| Session length | 8–12 minutes average | Snakeleev optimal window |
| Return rate | >40% return within 7 days | Spaced repetition research |
| Collections completed | >3 per active user | Engagement proxy |
| Student satisfaction | >85% positive | Snakeleev: 90%+ |

---

## 12. Research Sources

1. **Mhlongo, M. (2025).** Enhancing Chemistry Learning Through Effective Utilization of The Periodic Table. Research Square. [Link](https://www.researchsquare.com/article/rs-6042556/v1)

2. **Snakeleev (2025).** A Gamified Serious Game for Learning the Periodic Table. PMC. [Link](https://pmc.ncbi.nlm.nih.gov/articles/PMC12080125/)

3. **Bierenstiel, M. & Snow, K. (2019).** Periodic Universe: A Teaching Model for Understanding the Periodic Table. *J. Chem. Ed.*, 96(7), 1367–1376. [Link](https://pubs.acs.org/doi/10.1021/acs.jchemed.8b00740)

4. **Schwarz, W.H.E. et al. (2020).** Understanding Periodic and Non-periodic Chemistry in Periodic Tables. *J. Chem. Ed.* [Link](https://pmc.ncbi.nlm.nih.gov/articles/PMC7818537/)

5. **Tawfik et al. (2022).** Game-based learning approach on students' motivation and understanding of chemistry concepts: A systematic review. PMC. [Link](https://pmc.ncbi.nlm.nih.gov/articles/PMC9160041/)

6. **Garg et al. (2022).** Advancing global chemical education through interactive teaching tools. PMC. [Link](https://pmc.ncbi.nlm.nih.gov/articles/PMC9132018/)

7. **Nsabayezu, E. (2023).** Online periodic table of elements to support students' learning of trends. ResearchGate. [Link](https://www.researchgate.net/publication/368842783)

8. **RSISINTERNATIONAL (2026).** Exploring Conceptual Difficulties in the Periodic Table. *IJRISS*, 9(12). [Link](https://rsisinternational.org/journals/ijriss/uploads/vol9-iss12-pg3339-3346-202601_pdf.pdf)

---

*PRD v2 — Generated 2026-06-12. Evidence-based, research-informed design for a periodic table learning app.*
