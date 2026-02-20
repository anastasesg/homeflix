# Homeflix TV Design System — Google Stitch Prompt Strategy

## Context

Homeflix needs a distinctive TV design system for its 10-foot Android TV experience. The current web app has a functional dark theme but no TV-specific visual identity. The chosen direction "Midnight Velvet" (deep navy-to-black, electric sapphire accents) hasn't been implemented yet.

**The Concept: "Cinematic Theater"** — Rather than copying Netflix (flat content-forward), Apple TV+ (minimalist grid), or Disney+ (branded tabs), Homeflix's identity centers on the metaphor of being *inside a luxury private screening room*:
- Surfaces are layered frosted glass panels floating over rich cinematic imagery
- Focus states act as "spotlights" illuminating the selected item
- The UI subtly absorbs the mood of whatever content artwork is displayed
- Navy-to-black palette with electric sapphire accent — warmer than pure black

**Execution**: Two phases — design elements first (atomic vocabulary), then full screen compositions. All prompts target **DESKTOP** device type in Stitch, **LANDSCAPE 1920x1080**, using **Gemini 3 Pro** model.

---

## Color Palette Reference

| Token | Hex | Usage |
|-------|-----|-------|
| Background deep | `#070B14` | Primary background |
| Background mid | `#0C1222` | Subtle gradient target |
| Surface glass heavy | `rgba(14,22,42,0.75)` + 24px blur | Content panels |
| Surface glass medium | `rgba(14,22,42,0.55)` + 16px blur | Secondary surfaces |
| Surface glass light | `rgba(14,22,42,0.35)` + 12px blur | Overlays on heroes |
| Accent primary | `#3B82F6` | Electric sapphire — interactive |
| Accent glow | `#60A5FA` | Lighter sapphire — glows/shadows |
| Focus ring | `#3B82F6` + `0 0 20px rgba(59,130,246,0.5)` | All focus states |
| Text primary | `#F1F5F9` | Warm white (never pure white) |
| Text secondary | `#94A3B8` | Metadata, labels |
| Rating | `#FBBF24` | Amber stars |
| Downloaded | `#34D399` | Emerald status |
| Wanted | `#FB923C` | Orange status |
| Destructive | `#EF4444` | Red errors |

---

## PHASE 1: Design Elements (7 Prompts)

### 1.1 — Color & Gradient System

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop color palette and gradient reference sheet for a premium streaming media TV application. The background is near-black with a deep navy undertone (#070B14 to #0C1222). Show the following arranged in a clean grid layout:
>
> TOP ROW - Background gradients: four large rectangles showing (1) the primary background gradient from #070B14 at top to #0C1222 at bottom, (2) a radial gradient with a soft sapphire glow (#1E3A8A at 15% opacity) emanating from center on the dark background, (3) a diagonal gradient from #070B14 through #0F172A to transparent for overlay use, (4) a content-reactive tint showing how a warm movie poster color bleeds subtly into the surrounding dark surface.
>
> MIDDLE ROW - Surface cards: four frosted glass panels of different opacities showing text readability. Each panel has a blurred backdrop effect simulating glass over a movie poster image beneath. Panel 1: rgba(14,22,42,0.7) heavy frost. Panel 2: rgba(14,22,42,0.5) medium frost. Panel 3: rgba(14,22,42,0.35) light frost. Panel 4: rgba(20,30,55,0.5) with a subtle 1px border of rgba(59,130,246,0.15). Each panel contains sample white text (#F1F5F9) and secondary gray text (#94A3B8).
>
> BOTTOM ROW - Accent colors: circular swatches showing Electric Sapphire #3B82F6, Sapphire Glow #60A5FA, Amber Rating #FBBF24, Emerald Downloaded #34D399, Orange Wanted #FB923C, and Destructive Red #EF4444. Below each, show a small "glow" version with a soft colored shadow spreading outward on the dark background.
>
> Use clean sans-serif labels in #94A3B8 beneath each element. No decorative borders. Minimal spacing. The entire sheet should feel like a luxury design system documentation page.

**Refinements:** "Make the frosted glass panels larger and add a movie poster image visible through the blur behind each one to test real-world readability."

---

### 1.2 — Typography & Text Hierarchy

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop typography scale reference sheet for a TV streaming app viewed from 10 feet away. Dark background #070B14. Use a clean geometric sans-serif font throughout (similar to Inter or Geist Sans).
>
> Left column showing the type scale vertically:
> - "Featured Title" at 72px bold weight, white #F1F5F9, letter-spacing -0.02em
> - "Page Heading" at 48px semibold, white #F1F5F9
> - "Section Title" at 36px semibold, white #F1F5F9
> - "Card Title" at 24px medium weight, white #F1F5F9
> - "Body Text" at 20px regular weight, secondary #94A3B8, line-height 1.5
> - "Metadata" at 18px regular weight, secondary #94A3B8
> - "Badge/Label" at 14px semibold, uppercase tracking 0.05em, white #F1F5F9
>
> Right side showing three usage examples in context:
> 1. A movie title lockup: large title "Inception" at 48px bold, below it "2010" in 20px #94A3B8, below that a star rating icon with "8.8" in 22px #FBBF24, and genre pills "Sci-Fi / Thriller" in 16px
> 2. A section header: "Trending Now" at 36px semibold with a small "See All" link at 18px in #3B82F6 aligned right
> 3. A metadata line: "2h 28m • PG-13 • 4K HDR" at 18px #94A3B8 with dot separators
>
> All text should be crisp, high-contrast, and readable at TV viewing distance. No decorative elements. Clean dark background only.

**Refinements:** "Show these same text examples on top of a frosted glass panel (rgba(14,22,42,0.6) with blur) to verify readability against a blurred movie backdrop."

---

### 1.3 — Focus State System

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop reference sheet showing TV remote D-pad focus states for a streaming app. Dark background #070B14.
>
> Show a 3x3 grid of identical movie poster cards (2:3 aspect ratio, ~200px wide, showing a dramatic movie poster image with rounded 16px corners) in three states across columns:
>
> COLUMN 1 - "Unfocused" state: cards at full size but 70% opacity, no border, slight desaturation, title text hidden. Just the poster image fading into the dark background.
>
> COLUMN 2 - "Focused" state: the active card scaled up to 105%, full opacity, with a 3px solid #3B82F6 border and a soft outer glow of 0 0 24px rgba(59,130,246,0.4) around the entire card. Below the card, the movie title appears at 20px white and year at 16px gray. A subtle light reflection appears at the top edge of the card as if a spotlight is hitting it.
>
> COLUMN 3 - "Pressed" state: card at 98% scale (slightly compressed from focused), border brightens to #60A5FA, glow intensifies, a subtle inward shadow appears.
>
> Below the card grid, show three additional rows:
> ROW 2: Navigation button focus states — a pill-shaped nav item showing "Movies" with icon in unfocused (dark, 60% opacity), focused (sapphire background glow, white text, scale 105%), and pressed (compressed, brighter) states.
> ROW 3: Action button focus states — a "Play" button with play icon in unfocused (outline only, gray border), focused (filled sapphire #3B82F6, white text, glow shadow), and pressed (darker sapphire #2563EB, slight compress) states.
> ROW 4: A text input field in unfocused (subtle border, placeholder text in gray) and focused (sapphire border with glow, cursor blinking) states.
>
> Label each state clearly. Clean, documented, like a design system page.

**Refinements:** "Add a demonstration showing how focus transitions look — show 5 cards in a horizontal row with the middle one focused and the others progressively less opaque as distance from focus increases (100%, 85%, 70%, 55%, 40%)."

---

### 1.4 — Media Card Variants

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop reference sheet showing all media card variants for a TV streaming app. Background #070B14.
>
> ROW 1 - "Poster Cards" (2:3 aspect ratio, 200px wide): Show 6 cards side by side with real movie poster images. Card 1 shows a green circle badge with checkmark icon in top-left corner meaning "Downloaded", plus a "4K" text badge in top-right with dark semi-transparent background. Card 2 shows an amber circle badge with download arrow meaning "Downloading" with a thin progress ring around the badge at 65%. Card 3 shows an orange star badge meaning "Wanted". Card 4 shows a red X badge meaning "Missing". Card 5 shows no status badge — just the poster for TMDB-only items. Card 6 shows the focused state with sapphire glow ring. All cards have 16px rounded corners.
>
> ROW 2 - "Landscape Cards" (16:9 aspect ratio, 320px wide): Show 4 cards with movie/show backdrop images. Each has a gradient overlay from bottom (dark) to top (transparent) with title text and year at the bottom. One card shows a "Continue Watching" progress bar — a thin horizontal bar at the very bottom, sapphire filled to 45% with gray track. One card shows an "Episode 4" label in a small pill badge.
>
> ROW 3 - "Featured Card" (a single large 16:9 card spanning 800px wide): Shows a cinematic backdrop with a strong left-to-right gradient overlay (dark left, transparent right). On the left side: large title at 36px bold, metadata line with rating star and year, 2-line synopsis in gray text, and a "View Details" button with sapphire background. The right side shows the movie backdrop image bleeding through the gradient.
>
> ROW 4 - "Compact List Item" (full-width, 80px tall): Show 3 list items stacked. Each has a small square thumbnail on the left (60x80px), title and metadata in the middle, and status badge plus file size on the right. Subtle separator lines between items. One item shows "S03E07 • The One Where..." format for TV episodes.
>
> All elements on #070B14 background with frosted glass card backgrounds where appropriate.

**Refinements:** "Show the poster cards with their focused states side by side — one unfocused and one with the sapphire glow ring and title revealed below."

---

### 1.5 — Navigation Components

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop reference sheet showing TV navigation components for a streaming media app. Background #070B14.
>
> LEFT SECTION - "Collapsed Rail Nav" (80px wide, full height): A vertical navigation rail on the far left showing a stylized "H" logo in sapphire #3B82F6 at top, followed by vertically stacked icon-only navigation items: home icon, film icon, TV icon, search icon, library icon, settings icon. Each icon is 28px, spaced 48px apart vertically. The "home" icon has a sapphire left-edge indicator bar (3px wide, 32px tall) showing it's the active item. Icons use #94A3B8 color, active icon uses #F1F5F9.
>
> CENTER SECTION - "Expanded Rail Nav" (280px wide, full height): Same rail but expanded on focus. Show the labels appearing next to icons: "Home", "Movies", "Shows", "Search", "Library", "Settings". The active item "Home" has a frosted glass highlight background (rgba(59,130,246,0.15)) with the sapphire left bar. One item ("Movies") is shown in focused state with sapphire glow background, scale 105%, white text.
>
> RIGHT SECTION - Show three additional navigation patterns:
> 1. "Tab Bar" — a horizontal row of 5 genre tabs: "All", "Action", "Drama", "Sci-Fi", "Comedy". The active tab has a sapphire underline (3px) and white text. Inactive tabs use #94A3B8. One tab shown focused with full sapphire pill background.
> 2. "Breadcrumb" — "Home > Movies > Inception" with chevron separators, each segment in #94A3B8 except the last in #F1F5F9, links underline on focus in sapphire.
> 3. "Back Button" — a circular button with left-arrow icon, shown in normal (ghost border) and focused (sapphire fill with glow) states.
>
> All components sit on the #070B14 background. The rail nav should have a subtle right border of rgba(255,255,255,0.05).

**Refinements:** "Show the rail nav transitioning from collapsed to expanded — a mid-state at 160px where labels are partially visible, fading in."

---

### 1.6 — Glass & Surface System

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop reference sheet showing the frosted glass surface system for a premium TV streaming app. Use a large cinematic movie backdrop image (dark dramatic scene) as the base layer filling the entire 1920x1080 canvas.
>
> On top of this backdrop image, arrange the following glass panels to demonstrate the surface hierarchy:
>
> TOP LEFT - "Heavy Glass Panel" (600x400px): A frosted glass rectangle with rgba(14,22,42,0.75) background, 24px backdrop blur, 1px border of rgba(255,255,255,0.08), rounded 20px corners. Contains a movie title "Inception" at 36px white, metadata text below, and a description paragraph. This represents content panels where readability is critical.
>
> TOP RIGHT - "Medium Glass Panel" (500x300px): rgba(14,22,42,0.55) background, 16px backdrop blur, same border style, rounded 16px corners. Contains a smaller card layout with thumbnail image and text. The backdrop image is more visible through this panel. This represents secondary surfaces.
>
> BOTTOM LEFT - "Light Glass Overlay" (500x200px): rgba(14,22,42,0.35) background, 12px backdrop blur, no border. Just a subtle veil over the backdrop. Contains large text only — used for gradient overlays on hero images.
>
> BOTTOM CENTER - "Elevated Card" (300x400px): A card that appears to float above the backdrop with a deeper shadow (0 8px 32px rgba(0,0,0,0.6)), rgba(14,22,42,0.65) background, 20px blur, and a subtle sapphire edge glow (0 0 1px rgba(59,130,246,0.2)) on top edge only, as if lit from above. Rounded 16px corners.
>
> BOTTOM RIGHT - "Nested Glass" demonstration: A medium glass panel containing a smaller, slightly different-toned glass panel inside it, showing how surfaces can be layered. The inner panel is slightly lighter (rgba(30,42,65,0.5)) creating visual separation.
>
> Label each panel with its opacity, blur radius, and use case in small #94A3B8 text below.

**Refinements:** "Change the background image to a brighter, more colorful movie scene to stress-test readability of the glass panels."

---

### 1.7 — Loading & Motion States

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop reference sheet showing loading, skeleton, and transition states for a TV streaming app. Background #070B14.
>
> ROW 1 - "Skeleton Screens": Show three skeleton variations side by side:
> 1. Hero skeleton (800x350px): A large rectangle with a shimmer gradient animation (a diagonal light band of rgba(255,255,255,0.04) sweeping left to right across a #0F172A base). At the bottom-left, two smaller skeleton text rectangles (title placeholder 300x40px, metadata placeholder 200x20px) and a button placeholder (120x44px).
> 2. Card row skeleton: 5 poster-sized skeleton rectangles (200x300px each) in a horizontal row with #0F172A fill and the same shimmer effect, each with a slight animation delay creating a wave pattern.
> 3. Detail page skeleton: A layout with large backdrop skeleton on top, smaller poster skeleton on the left, and multiple text line skeletons of varying widths on the right.
>
> ROW 2 - "State Transitions": Show 4 frames of a card appearing:
> Frame 1: Empty space with faint dotted outline. Frame 2: Skeleton with shimmer. Frame 3: Image fading in at 50% opacity with slight upward motion (translate-y from 8px). Frame 4: Final state at full opacity, settled position.
>
> ROW 3 - "Interactive Feedback":
> 1. A button showing a loading spinner (sapphire colored circular spinner, 20px) replacing the button text, with the button slightly dimmed.
> 2. An error card: dark red-tinted glass panel (rgba(239,68,68,0.1) background) with an alert icon, error message "Unable to load movies", and a "Retry" button with sapphire outline.
> 3. An empty state: centered layout with a large ghost icon (film reel at 30% opacity), heading "Your library is empty", subtext "Start adding movies from Discover", and a sapphire "Browse Discover" button.
>
> All skeletons use #0F172A base color (slightly lighter than #070B14 background) with #1E293B shimmer highlight.

**Refinements:** "Show the shimmer animation at three different speeds — slow (3s), normal (2s), and fast (1.5s) — to determine the most premium-feeling cadence."

---

## PHASE 2: Full Screen Designs (7 Prompts)

### 2.1 — Home Screen (Flagship)

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop home screen for a luxury streaming media TV app called Homeflix, designed for D-pad remote navigation on a big screen TV.
>
> LAYOUT: A narrow vertical navigation rail (80px wide) on the far left with a sapphire "H" logo at top and icon-only nav items (home, film, TV, search, library, gear) stacked vertically. The home icon has a sapphire left-edge indicator bar showing it is active. The remaining 1840px is the content area.
>
> HERO SECTION (top 55% of content area): A cinematic full-width backdrop image of a dramatic movie scene, edge-to-edge, with a strong gradient overlay: from solid dark (#070B14) on the left third, through semi-transparent in the middle, to a subtle dark veil on the right. Over the gradient on the left side: a large movie title "Dune: Part Two" at 56px bold white, below it a metadata line with a filled amber star icon and "8.8" in amber, "2024" and "Sci-Fi / Adventure" in #94A3B8 text separated by dots. Below that, a 2-line synopsis in 20px #94A3B8. A large "View Details" button with sapphire #3B82F6 background and white text, with a soft sapphire glow shadow beneath it — this button appears focused with a subtle scale-up effect. Thin dot indicators at the bottom-right of the hero showing 5 dots, the first filled in sapphire.
>
> CONTENT ROWS (bottom 45%): Three horizontal scrolling rows of movie/show poster cards stacked vertically with 32px spacing between rows:
> Row 1: "Continue Watching" label at 28px semibold white, followed by 6 landscape cards (16:9, 280px wide) with progress bars at bottom showing various completion percentages in sapphire.
> Row 2: "Trending Movies" label, followed by 7 poster cards (2:3 ratio, 180px wide) with movie poster images, the third card shown in focused state with sapphire glow ring and title revealed below.
> Row 3: "Recently Added" label, followed by 7 more poster cards, some showing green "Downloaded" badges in top-left corners.
>
> The entire interface sits on a #070B14 background. Rows fade out at the right edge with a subtle gradient mask. The content area has 5% overscan-safe margins. Everything feels like looking into a dark, luxurious home theater with sapphire accent lighting.

**Refinements:**
1. "Make the hero section feel more immersive — add a very subtle animated grain texture overlay at 2% opacity on the backdrop, and make the gradient overlay include a hint of the movie's dominant color bleeding into the dark area."
2. "Refine the rail nav — make the icons slightly larger (32px) and add a subtle frosted glass background to the entire rail so it floats over the hero section."

---

### 2.2 — Movie Detail Page

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop movie detail page for a streaming TV app. D-pad remote navigation, 10-foot viewing distance.
>
> BACKGROUND: Full-bleed cinematic movie backdrop (a dramatic Interstellar-style space scene) filling the entire 1920x1080. Apply a heavy gradient: solid #070B14 covering the bottom 40%, fading to 60% transparent at the middle, and a subtle dark veil at the top. A frosted glass noise texture at 2% opacity over everything.
>
> LEFT NAV: 80px collapsed rail nav with sapphire active indicator on the film icon.
>
> MAIN CONTENT (floating over backdrop): A large frosted glass panel (rgba(14,22,42,0.65), 20px backdrop blur, rounded 24px corners, subtle 1px border rgba(255,255,255,0.06)) positioned in the lower two-thirds of the screen, offset 100px from left and 60px from right.
>
> Inside the glass panel, two-column layout:
> LEFT COLUMN (240px wide): A movie poster image (2:3 ratio) with rounded 16px corners and subtle shadow. Below the poster: a large sapphire "Play" button (full width, 48px height) with play triangle icon and white text, showing a focused state with glow. Below that: outline buttons for "Trailer" and "Add to Library" side by side.
>
> RIGHT COLUMN:
> - Title "Interstellar" at 44px bold white
> - Metadata line: amber star icon + "8.7" in amber, then "2014 • 2h 49m • PG-13" in #94A3B8 with dot separators
> - Genre pills: rounded badges "Sci-Fi", "Drama", "Adventure" with rgba(59,130,246,0.12) background and #60A5FA text
> - Quality badges: "4K UHD" "HDR10" "Dolby Atmos" as pills with rgba(52,211,153,0.15) background and #34D399 text
> - Download status: green dot + "Downloaded • 47.2 GB" in #34D399
> - Synopsis paragraph (3 lines max) in 18px #94A3B8 text with 1.6 line-height
> - Horizontal "Cast" section: 8 circular actor headshots (72px diameter) with names below, one focused with sapphire ring
>
> Below the glass panel, a "Similar Movies" row of 6 poster cards at the very bottom, partially visible to indicate scrollability.

**Refinements:** "Add a subtle content-reactive color tint to the glass panel — since Interstellar has warm golden tones, the glass should have the faintest warm tint (rgba(251,191,36,0.03)) mixed into its background."

---

### 2.3 — Show Detail Page

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop TV show detail page for a streaming TV app with D-pad remote navigation.
>
> BACKGROUND: Full-bleed dramatic TV show backdrop (a tense Breaking Bad desert scene). Strong gradient overlay: solid #070B14 from the left 35%, fading through the center. Subtle dark veil from the bottom covering 50%.
>
> LEFT NAV: 80px collapsed rail with sapphire active indicator on the TV icon.
>
> UPPER SECTION (top 50%): Content overlaid directly on the backdrop gradient.
> - Show poster (2:3, 200px wide) floated to the far left with shadow and rounded 16px corners
> - Adjacent: title "Breaking Bad" at 48px bold white, below it "2008-2013" in 20px #94A3B8 with a green "Ended" badge pill
> - Metadata: amber star "9.5", "5 Seasons • 62 Episodes • Crime / Drama / Thriller" in #94A3B8
> - Episode progress: "58 of 62 episodes downloaded" with a thin progress bar (sapphire fill, 94% complete)
> - Two buttons: "Continue S5E3" sapphire filled (focused with glow) and "Manage" outline button
> - Synopsis text (2 lines) in 18px #94A3B8
>
> LOWER SECTION (bottom 50%): Seasons grid on a subtle frosted glass surface (rgba(14,22,42,0.4), 12px blur).
> - Header "Seasons" at 28px semibold white with count badge "5"
> - Horizontal row of 5 season poster cards (2:3, 160px wide), each with season poster, "Season 1" label, episode count badge, and thin progress bar (green = fully downloaded, sapphire = partial). One season focused with sapphire glow.
>
> Below: partially visible "Cast" row peeking up to suggest more content.

**Refinements:** "Give the seasons section more vertical space and make season cards 180px wide with more gap between them."

---

### 2.4 — Browse/Grid Screen

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop movie browsing grid screen for a TV streaming app with D-pad remote navigation.
>
> LEFT NAV: 80px collapsed rail with sapphire active indicator on the film icon.
>
> TOP BAR: A frosted glass strip (rgba(14,22,42,0.5), 12px blur, full width, 72px) containing:
> - Page title "Movies" at 32px bold white on the left
> - Filter tabs: "All", "Trending", "Top Rated", "Now Playing", "Upcoming", "Hidden Gems" as pills. "Trending" active with sapphire #3B82F6 fill and white text. Others ghost with #94A3B8 text. One tab focused with sapphire outline glow.
>
> GRID: 5-column grid of movie poster cards (2:3 aspect ratio), 3 rows visible (15 cards). Varying status badges. Cards slightly fade at the bottom row to suggest scrollability.
>
> One card (row 2, column 3) focused: scaled 105% with sapphire glow ring, title "The Batman" and "2022" revealed below, neighbors subtly pushed apart.
>
> Bottom fade gradient (32px) from transparent to #070B14. Background #070B14. 20px gaps, 5% overscan margins. No hero — pure browsing grid.

**Refinements:** "Add a sort dropdown on the right side of the top bar — a frosted glass button showing 'Sort: A-Z' with chevron-down icon."

---

### 2.5 — Search Experience

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop search screen for a TV streaming app with D-pad remote and on-screen keyboard.
>
> LEFT NAV: 80px collapsed rail with sapphire active indicator on search icon.
>
> SEARCH INPUT (top center): A large frosted glass search bar (720px wide, 64px tall, fully rounded, rgba(14,22,42,0.6), 16px blur). Search icon in #94A3B8, placeholder "Search movies and shows..." in #64748B. Focused: 2px sapphire border with outer glow, blinking cursor.
>
> LEFT HALF - Empty state: "Trending Searches" at 24px #94A3B8, then 8 suggestion chips in 2 rows of 4: "Dune", "Oppenheimer", "The Bear", "Severance", "Alien Romulus", "Shogun", "Fallout", "Arcane". Chips: rgba(59,130,246,0.08) background, #94A3B8 text. One focused with sapphire border and white text.
>
> RIGHT HALF - Results for "inter": typed text in white. Two columns below:
> "Movies" column with film icon: 4 compact result rows (small poster thumbnail 60x90px, title with "Inter" highlighted in sapphire #3B82F6, year and rating in #94A3B8). First result "Interstellar" focused with frosted glass highlight and sapphire left indicator.
> "Shows" column with TV icon: 3 results in same format.
>
> Background #070B14. Clean, fast, spotlight-search feeling.

**Refinements:** "Add a voice search microphone icon on the right side of the search bar in both unfocused and focused states."

---

### 2.6 — Player Overlay

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop video player overlay for a TV streaming app. Overlay on top of a paused movie frame.
>
> BACKGROUND: A still cinematic movie frame, dimmed to 40% brightness with subtle dark veil.
>
> BOTTOM OVERLAY: Frosted glass control bar from bottom (rgba(14,22,42,0.7), 24px blur, rounded top 20px). Height ~220px.
>
> TOP of bar: Progress scrubber full width. 4px track in rgba(255,255,255,0.15), sapphire #3B82F6 fill at 45%. Circular handle (16px, sapphire with white border). Time tooltip "1:04:32" in tiny frosted pill above handle. Elapsed "1:04:32" in 16px white left. Remaining "-1:22:08" in 16px #94A3B8 right.
>
> MIDDLE: Transport controls centered. Five circular buttons: skip-back-10s (outline, 44px), prev chapter (outline, 44px), play/pause (sapphire filled, 64px, focused with glow), next chapter (outline, 44px), skip-forward-10s (outline, 44px). White icons.
>
> BOTTOM: Left — movie title "Interstellar" 20px semibold white + "2014 • PG-13" 16px #94A3B8. Right — four icon buttons: subtitles (CC), audio, quality ("4K"), fullscreen. 36px ghost style, one focused with sapphire circle fill.
>
> TOP RIGHT of screen: Floating frosted glass chip "Chapter 12: No Time for Caution" in 14px white.
>
> No rail nav during playback. Cinema house feel — minimal, content-dominant.

**Refinements:** "Show a slim mode variant — only progress bar and time visible at the very bottom, controls appearing on any D-pad press."

---

### 2.7 — Empty/Onboarding State

**Stitch Prompt:**
> Design a LANDSCAPE 1920x1080 desktop first-time experience screen for a TV streaming app called Homeflix. User has connected their media server but has no content.
>
> LEFT NAV: 80px collapsed rail with sapphire "H" logo.
>
> BACKGROUND: Rich gradient #070B14 at edges to #0C1222 at center. Subtle concentric circles at 2% opacity radiating from center, like looking into a projection room.
>
> CENTER: Large centered composition:
> - Illustration area (320x320px): minimalist line-art home theater icon drawn with thin sapphire #3B82F6 lines, scattered star sparkles in #60A5FA at varying opacities. Premium, aspirational, not cartoonish.
> - "Welcome to Homeflix" at 48px bold white, centered
> - "Your personal streaming theater" at 22px #94A3B8
> - "Start building your collection by discovering movies and shows from our catalog." at 18px #64748B, max-width 560px
> - Two buttons: "Discover Movies" sapphire filled (200px, 56px, film icon, focused with glow) and "Discover Shows" outline (200px, 56px, TV icon)
> - Small "or configure your media server" link in 16px #64748B
> - Three frosted glass stat cards in a row (200px each): Film icon "0 Movies" / TV icon "0 Shows" / Download icon "0 Downloads" — with "in your library" / "in progress" subtexts in 14px #94A3B8
>
> Feel: welcoming, aspirational — an empty private theater waiting to be filled.

**Refinements:** "Make the illustration more cinematic — a minimalist theater curtain shape with a sapphire spotlight beam from above."

---

## Execution Sequence

**Phase 1** (generate in order, each builds on the previous):
1. `palette-gradients` → establishes all colors
2. `typography-scale` → establishes text hierarchy
3. `glass-surfaces` → establishes the novel surface language
4. `focus-states` → establishes interaction patterns
5. `card-variants` → establishes content containers
6. `navigation-system` → establishes navigation chrome
7. `loading-motion` → establishes feedback patterns

**Review Phase 1 outputs** — note what Stitch interpreted well vs. poorly, adjust Phase 2 accordingly.

**Phase 2** (compose elements into screens):
1. `screen-home` → flagship experience
2. `screen-movie-detail` → decision point
3. `screen-show-detail` → complex hierarchy
4. `screen-browse-grid` → scanning experience
5. `screen-search` → utility screen
6. `screen-player-overlay` → immersive context
7. `screen-onboarding` → first impression

**Per-prompt workflow**: DESKTOP device type, Gemini 3 Pro → paste prompt → wait 30-60s → screenshot → apply 1-2 refinements → screenshot final → next prompt.

## What Makes This Distinctive

1. **Frosted glass surface system** — no other TV app uses layered translucent panels this aggressively
2. **"Spotlight" focus metaphor** — focused items feel lit from above, not just highlighted
3. **Content-reactive atmosphere** — UI subtly absorbs the mood of displayed content artwork
4. **Navy-to-black + sapphire** — warmer than Netflix's black/red, more dramatic than Apple's gray/blue
5. **"Private screening room" feeling** — everything recedes to let content artwork dominate
