---
name: styling-design
description: Use when writing Tailwind CSS, designing component visuals, creating loading skeletons, hover effects, animations, gradients, or any visual/UI work. Covers the visual design system, responsive patterns, dark mode, and polish effects used in this codebase.
---

# Styling & Design System

This skill defines the visual language and Tailwind patterns used throughout the homeflix frontend.

## Color System

### Semantic tokens (auto dark/light)

Use shadcn/ui semantic tokens — never hardcode colors for themed elements:

```
bg-background        # Page background
text-foreground       # Primary text
text-muted-foreground # Secondary/subdued text
bg-muted             # Subdued backgrounds
border               # Default borders
bg-card              # Card backgrounds
bg-destructive       # Error/danger
text-destructive     # Error text
bg-primary           # Primary accent
```

### Accent color: Amber

Amber is the signature accent throughout the app:

```
text-amber-500/80     # Section header icons
text-amber-400        # Hover highlights on secondary text
bg-amber-500/10       # Subtle accent backgrounds
from-amber-500/60     # Gradient accents
shadow-amber-500/5    # Colored shadows
```

### Status colors

| Status | Text | Background | Glow |
|---|---|---|---|
| Downloaded/success | `text-emerald-400` | `bg-emerald-500/20` | `shadow-emerald-500/20` |
| Downloading/info | `text-blue-400` | `bg-blue-500/20` | `shadow-blue-500/20` |
| Missing/warning | `text-amber-400` | `bg-amber-500/20` | `shadow-amber-500/20` |
| Wanted/neutral | `text-muted-foreground` | `bg-muted` | — |
| Error/danger | `text-red-400` | `bg-red-500/10` | — |

### Opacity conventions

Always use semantic tokens at reduced opacity — never hardcode `white/*` or `black/*`:

```
border-border/10       # Very subtle borders
bg-muted/10            # Near-invisible background layering
bg-muted/20            # Slightly more visible background
border-muted/50        # Soft border (50%)
text-muted-foreground/50  # Subdued placeholder text
bg-muted/30            # Soft input backgrounds
```

## Tailwind Class Ordering

Follow this order within a `className`:

```
1. Layout     → flex, grid, relative, absolute, inset-0
2. Sizing     → size-4, h-10, w-full, aspect-[2/3]
3. Spacing    → p-4, mt-2, gap-2, space-y-3
4. Display    → overflow-hidden, truncate
5. Border     → rounded-xl, border, ring-1
6. Background → bg-muted/30, bg-gradient-to-r
7. Text       → text-sm, font-semibold, text-foreground
8. Effects    → shadow-md, backdrop-blur-sm, opacity-0
9. Transition → transition-all, duration-300
10. Pseudo    → hover:, group-hover:, focus:
```

Example from the codebase:

```tsx
<Input
  className="h-10 border-muted/50 bg-muted/30 pl-9 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-background"
/>
```

## Responsive Design

### Mobile-first approach

Always start with base (mobile) styles, then layer up:

```tsx
// Poster aspect ratio: progressively wider on larger screens
<div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[2.4/1]">

// Grid columns: progressively more on larger screens
<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

// Padding: larger on bigger screens
<div className="relative p-4 sm:p-6 lg:p-8">

// Hide on mobile, show on larger screens
<span className="hidden sm:flex">Rating</span>
```

### Breakpoint usage

| Breakpoint | Typical use |
|---|---|
| Base (mobile) | 2-column grid, compact padding, essential info only |
| `sm:` (640px) | 3-column grid, show secondary info |
| `md:` (768px) | 4-column grid, medium padding |
| `lg:` (1024px) | 5-column grid, larger layout |
| `xl:` (1280px) | 6-column grid, maximum columns |

## `cn()` Utility

Always use `cn()` for conditional/merged classes:

```tsx
import { cn } from '@/lib/utils';

<Badge
  className={cn(
    'size-6 p-0 shadow-md backdrop-blur-sm transition-transform duration-200 group-hover:scale-110',
    status.bg,
    status.glow && `shadow-lg ${status.glow}`
  )}
>
```

## Animation Patterns

### Group hover

Parent declares `group`, children respond to hover:

```tsx
<Link className="group relative block overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-primary/40">
  {/* Poster scales up on parent hover */}
  <Image className="transition-transform duration-500 group-hover:scale-105" />

  {/* Overlay fades in on parent hover */}
  <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
    ...hover content...
  </div>
</Link>
```

### Staggered loading animations

```tsx
{Array.from({ length: 12 }).map((_, i) => (
  <Skeleton
    key={i}
    className="aspect-[2/3] w-full rounded-xl"
    style={{ animationDelay: `${i * 50}ms` }}
  />
))}
```

### Standard transitions

```tsx
// Subtle hover (most elements)
className="transition-all duration-300 hover:border-border/20"

// Image zoom (cards)
className="transition-transform duration-500 group-hover:scale-105"

// Fast response (badges, icons)
className="transition-transform duration-200 group-hover:scale-110"

// Opacity fade (overlays)
className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
```

## Visual Effects

### Gradient overlays (hero sections)

Layer multiple gradients for depth:

```tsx
{/* Left-to-right fade for text readability */}
<div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

{/* Bottom-to-top fade */}
<div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
```

### Film grain texture

For cinematic hero sections:

```tsx
<div
  className="absolute inset-0 opacity-[0.02]"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  }}
/>
```

### Glassmorphism (buttons, overlays on images)

```tsx
className="bg-background/80 backdrop-blur-sm"
className="bg-black/70 backdrop-blur-md"
```

### Accent left-border (overview text)

```tsx
<section className="relative">
  <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent" />
  <p className="pl-2 text-[15px] leading-relaxed text-muted-foreground/90">{overview}</p>
</section>
```

### Colored glow shadows

```tsx
// Card with status glow
className="shadow-lg shadow-emerald-500/20"

// Button hover glow
className="hover:shadow-xl hover:shadow-primary/10"
```

## Section Headers

Consistent pattern for all sections:

```tsx
<SectionHeader icon={Sparkles} title="Cast" count={credits.cast.length} />
```

Renders as:
```tsx
<div className="mb-4 flex items-center gap-2">
  <Icon className="size-4 text-amber-500/80" />
  <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
  {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
</div>
```

## Card Design

### Media cards

```
┌──────────────────┐
│  ┌─────┐  Status │  ← Status badge (top-right)
│  │     │  Badge  │
│  │ IMG │         │
│  │     │         │
│  │     │  Rating │  ← Rating badge (bottom-right, on hover)
│  └─────┘         │
│  ┌───────────────┐
│  │ Hover overlay │  ← Fade-in overlay with title, year, genres
│  └───────────────┘
└──────────────────┘
   Title             ← Below card
```

Poster aspect ratio: `aspect-[2/3]`
Card corners: `rounded-xl`
Card ring: `ring-1 ring-border/20`
Hover lift: `hover:-translate-y-1`
Hover ring: `hover:ring-2 hover:ring-primary/40`

### Stat cards

```tsx
<div className="rounded-xl border border-border/10 bg-muted/10 p-5 transition-all duration-300 hover:border-border/20">
  <div className="flex items-center justify-between">
    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    <Icon className="size-4 text-amber-500/60" />
  </div>
  <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
  <p className="mt-1 text-xs text-muted-foreground">{description}</p>
</div>
```

## Error States

### Page-level error (featured, grid)

Gradient background with icon, message, and retry button:

```tsx
<div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-background to-background" />
<div className="rounded-full bg-destructive/10 p-4">
  <AlertCircle className="size-8 text-destructive" />
</div>
<h2 className="text-xl font-semibold">Unable to load featured movie</h2>
<p className="text-sm text-muted-foreground">{error.message}</p>
<Button variant="outline" onClick={refetch}>
  <RefreshCw className="size-4" /> Try Again
</Button>
```

### Section-level error (tabs)

```tsx
<div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
  <h2 className="text-lg font-semibold text-destructive">Failed to load content</h2>
  <p className="mt-2 text-sm text-muted-foreground">{message}</p>
</div>
```

### Silent failure (supplementary sections)

```tsx
error: () => null  // Cast, crew, gallery sections
```

## Empty States

```tsx
<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/20 py-20">
  <div className="rounded-full bg-muted/50 p-4">
    <Icon className="size-10 text-muted-foreground/50" />
  </div>
  <h3 className="mt-4 text-lg font-medium">{title}</h3>
  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
</div>
```

## Quality Tier Colors

For media quality badges:

```tsx
// 4K/2160p
className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"

// 1080p
className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"

// 720p
className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"

// Lower/unknown
className="bg-gradient-to-r from-zinc-500 to-zinc-600 text-white"
```

## Image Handling

### Next.js Image with fill

```tsx
<AspectRatio ratio={2 / 3}>
  <Image
    src={posterUrl}
    alt={title}
    fill
    className="h-full w-full object-cover"
    sizes="150px"  // Always provide sizes for fill images
  />
</AspectRatio>
```

### Fallback when no image

```tsx
{posterUrl ? (
  <Image src={posterUrl} alt={title} fill className="object-cover" />
) : (
  <div className="flex h-full items-center justify-center bg-muted">
    <Film className="size-8 text-muted-foreground/40" />
  </div>
)}
```

### TMDB image sizes

| Use case | Size | Notes |
|---|---|---|
| Posters | `w500` | Default for cards and detail |
| Backdrops | `original` | Full quality for heroes |
| Profile images | `w185` | Cast/crew thumbnails |
| Company logos | `w185` | Small production logos |
