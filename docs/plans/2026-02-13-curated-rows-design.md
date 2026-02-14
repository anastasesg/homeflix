# Curated Rows & Explore Page Design

**Goal:** Expand the homepage with rotating curated content rows and add a dedicated Explore page for browsing all curated categories. Transform Homeflix into a cinephile's discovery platform.

**Approach:** Extend the existing contextual recommendations system (Approach A) — add curated rules with an `always` matcher, daily-seed rotation for homepage, and a new Explore route.

---

## 1. Extended Type System

### New Matcher

```typescript
interface AlwaysMatcher { type: 'always' }
```

Added to the existing `ContextMatcher` union. Rules with `always` matcher are unconditionally active — they form the curated pool.

### New Rule Types

Extend `ContextRuleType`:

```typescript
type ContextRuleType =
  | 'holiday' | 'time-of-day' | 'day-of-week' | 'season' | 'festival'  // existing
  | 'director' | 'curated-list' | 'thematic' | 'era' | 'world-cinema' | 'movement';  // new
```

### Row Mode

Each rule gets a `mode` field:

```typescript
interface ContextRule {
  // ... existing fields
  mode: 'paired' | 'movies-only' | 'shows-only';
}
```

- `paired` — produces 2 rows (movie + show). Used by contextual rules and thematic categories.
- `movies-only` — produces 1 row. Used by directors.
- `shows-only` — produces 1 row. Available for future use.

Existing contextual rules default to `paired`.

### Curated Rule Extras

Curated rules get additional metadata for the Explore page:

```typescript
interface CuratedRuleMeta {
  slug: string;              // URL-safe ID for /explore/[slug]
  description: string;       // 1-2 sentence description for collection page
  category: CuratedCategory; // grouping for Explore page sections
}

type CuratedCategory = 'director' | 'movement' | 'world-cinema' | 'era' | 'thematic' | 'collection';
```

---

## 2. Selection Algorithm

### Homepage — Two-Phase Picker

**Phase 1 — Contextual (time-based):** Unchanged. Evaluate rules with time matchers, return top 2 by priority. Always shown.

**Phase 2 — Curated (always-match):**
1. Collect all rules with `always` matcher
2. Shuffle with daily seed (`hashString(new Date().toDateString())`)
3. Pick rules until 6 row slots are filled:
   - `paired` rule costs 2 slots
   - `movies-only` or `shows-only` costs 1 slot
4. Return selected rules

**Daily seed:** Simple string hash → deterministic shuffle. Same day = same rows. New day = fresh rotation.

```typescript
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) | 0;
    const j = ((s >>> 0) % (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

### Homepage Row Order

1. Continue Watching (stub)
2. Recently Added (stub)
3. Contextual rows (up to 4 rows from 2 time-based rules)
4. Trending Movies / Trending Shows
5. **Curated rows (6 rows from rotating pool)**
6. Recommended for You (stub)

---

## 3. Curated Rule Catalog

### Directors (~33 entries, `movies-only`)

Mix of classic and modern masters. Each rule uses `crewIds` filter with the director's TMDB person ID. Each director gets a unique, distinctive description (stored in `directors.json`).

**Original 20:** Kubrick, Kurosawa, Hitchcock, Scorsese, Coppola, Tarkovsky, Bergman, Fellini, Lynch, Fincher, PTA, Villeneuve, Nolan, Bong Joon-ho, Park Chan-wook, Wong Kar-wai, Miyazaki, Wes Anderson, Joel Coen, Sofia Coppola.

**Added 13:** Steven Spielberg, Billy Wilder, Orson Welles, Ridley Scott, Terrence Malick, Pedro Almodovar, Spike Lee, Werner Herzog, Sergio Leone, Michael Mann, Yorgos Lanthimos, Abbas Kiarostami, Lars von Trier.

TMDB person IDs and descriptions stored in `lib/contextual/data/directors.json`.

### Cinematic Movements (~12 entries, `paired`)

- **French New Wave** — language: fr + years: 1958-1975 + rating: 7.0+
  - *The revolutionary movement that broke every rule of conventional filmmaking. Godard, Truffaut, Varda, and their contemporaries reinvented cinema in 1960s France.*
- **Italian Neorealism** — language: it + years: 1943-1960 + rating: 7.0+
  - *Raw, authentic stories of post-war Italy. De Sica, Rossellini, and Visconti captured life as it was, not as cinema wished it to be.*
- **German Expressionism** — language: de + years: 1920-1935 + rating: 6.5+
  - *Distorted sets, dramatic shadows, and psychological terror. The visual language that shaped horror and film noir for a century.*
- **New Hollywood** — years: 1967-1982 + genres: drama + rating: 7.0+
  - *The auteur era that gave us Coppola, Scorsese, Spielberg, and Lucas. Young filmmakers dismantled the studio system and changed everything.*
- **Dogme 95** — years: 1995-2005 + rating: 6.5+ *(no language filter — movement was international)*
  - *Lars von Trier and Thomas Vinterberg's radical manifesto: no artificial lighting, no props, no genre films. Just raw truth.*
- **Mumblecore** — genres: drama, comedy + years: 2002-2015 + language: en + rating: 6.0+
  - *Ultra-low-budget, improvised dialogue, and painfully real relationships. The Duplasses, Swanberg, and Bujalski made awkwardness an art form.*
- **Korean New Wave** — language: ko + rating: 7.0+ + years: 2000-present
  - *From Oldboy to Parasite, Korean cinema's explosive global breakthrough. Genre-bending, socially sharp, and relentlessly inventive.*
- **Japanese New Wave** — language: ja + rating: 7.0+ + years: 1956-1975
  - *Oshima, Imamura, and Teshigahara challenged tradition with politically charged, formally daring cinema that rivaled the French New Wave.*
- **Czech New Wave** — language: cs + years: 1963-1975 + rating: 6.5+
  - *Forman, Chytilova, Menzel. Crushed by Soviet tanks but not before creating some of the most daring, playful cinema ever made.*
- **Iranian New Wave** — language: fa + years: 1960-present + rating: 7.0+
  - *A cinema of astonishing beauty born under censorship. Kiarostami, Panahi, Farhadi — where limitations became creative fuel.*
- **Spaghetti Western** — language: it + genres: western + years: 1960-1978
  - *Leone, Corbucci, Morricone. Not a subgenre — a full-blown movement that reimagined the American myth through Italian eyes and unforgettable music.*
- **Romanian New Wave** — language: ro + years: 2001-present + rating: 7.0+
  - *The most vital European movement of the 21st century. Mungiu, Puiu, Porumboiu. Unflinching, darkly funny, formally rigorous.*

### World Cinema Regions (~11 entries, `paired`)

- **Korean Cinema** — language: ko + rating: 6.5+
  - *From thrillers to romances, K-dramas to revenge sagas. South Korea's film and TV industry is one of the most exciting in the world.*
- **Japanese Masters** — language: ja + rating: 7.0+
  - *From Kurosawa's samurai epics to Miyazaki's animated worlds. A cinema tradition defined by precision, beauty, and philosophical depth.*
- **Scandinavian Noir** — language: sv, da, no + genres: crime, thriller + rating: 6.5+
  - *Dark landscapes, darker secrets. The Nordic noir tradition: methodical investigations, moral ambiguity, and the cold that seeps into everything.*
- **French Cinema** — language: fr + rating: 6.5+
  - *The birthplace of cinema itself. From poetic realism to the New Wave and beyond — French film remains the gold standard of artistic expression.*
- **Italian Cinema** — language: it + rating: 6.5+
  - *Fellini's dreams, Leone's epics, Sorrentino's beauty. Italian cinema speaks the universal language of passion, style, and spectacle.*
- **Latin American Cinema** — language: es, pt + rating: 6.5+
  - *Magical realism on screen. From Cuaron and del Toro to City of God and Central Station — where the mythic meets the brutally real.*
- **Iranian Cinema** — language: fa + rating: 6.5+
  - *One of the most acclaimed national cinemas of the last 40 years. Kiarostami, Farhadi, Panahi — profound, poetic, and defiantly human.*
- **Indian Cinema** — language: hi, ta, ml, te, bn + rating: 6.5+
  - *The largest film industry on earth. From Satyajit Ray's Apu Trilogy to modern Malayalam cinema, a tradition of staggering range and depth.*
- **Chinese Cinema** — language: zh + rating: 6.5+
  - *Zhang Yimou, Chen Kaige, Jia Zhangke. From martial arts poetry to unflinching social realism — five generations of cinematic mastery.*
- **German Cinema** — language: de + rating: 6.5+
  - *From Expressionism to Fassbinder to Toni Erdmann. Germany's cinema is dark, philosophical, and perpetually reinventing itself.*
- **British Cinema** — language: en + region: GB + rating: 6.5+
  - *From David Lean to Steve McQueen. Kitchen sink realism, period grandeur, and a dry wit that cuts deeper than you expect.*

### Eras (~6 entries, `paired`)

- **Silent Era** — years: 1895-1929 + rating: 7.0+
  - *The birth of cinema itself. Chaplin, Keaton, Murnau, Eisenstein, Lang. Before sound, there was pure visual storytelling — and it was magnificent.*
- **Golden Age Hollywood** — years: 1930-1959 + rating: 7.0+
  - *The studio system at its peak. Bogart, Bergman, Hitchcock, and Wilder crafted the archetypes that all cinema still follows.*
- **80s Classics** — years: 1980-1989 + rating: 6.5+
  - *Blockbusters, brat packs, and VHS. The decade of excess gave us Indiana Jones, Blade Runner, and the birth of the modern franchise.*
- **90s Indie** — years: 1990-1999 + rating: 7.0+
  - *Sundance launched, Tarantino arrived, and indie became mainstream. The decade when low budgets and high ambition collided spectacularly.*
- **2000s Cinema** — years: 2000-2009 + rating: 7.0+
  - *Digital revolution meets prestige TV. The decade that gave us The Wire, There Will Be Blood, and the rise of global arthouse cinema.*
- **Modern Masterpieces** — years: 2015-present + rating: 7.5+ + votes: 1000+
  - *The best of right now. Critically acclaimed, audience-beloved films and shows from the last decade that will define this generation.*

**Note:** The previous "70s New Hollywood" era has been removed — it was a near-exact duplicate of the "New Hollywood" movement (same year range 1967-1982, same filters). The movement entry covers this ground.

### Themes & Moods (~18 entries, `paired`)

- **Film Noir** — genres: crime, mystery + rating: 6.5+
  - *Shadows, smoke, and moral ambiguity. From classic noir to neo-noir, the genre where everyone has something to hide.*
- **Psychological Thrillers** — genres: thriller + rating: 6.5+
  - *Trust no one — especially yourself. Films and shows that mess with your head, twist your perception, and leave you questioning reality.*
- **Coming-of-Age** — genres: drama + keywords: coming-of-age + rating: 6.5+
  - *The universal story of growing up. First loves, identity crises, and the bittersweet realization that childhood is behind you.*
- **Feel-Good** — genres: comedy, family + rating: 7.0+
  - *Pure cinematic serotonin. Warm comedies, heartfelt family stories, and films that restore your faith in everything.*
- **Mind-Bending** — genres: sci-fi, thriller + rating: 7.0+
  - *Films that demand a second viewing. Reality-warping narratives, unreliable narrators, and endings that recontextualize everything.*
- **Cyberpunk** — genres: sci-fi + keywords: cyberpunk, dystopia, android + rating: 6.5+
  - *Neon-soaked dystopias, rogue AIs, and the thin line between human and machine. High tech, low life — the future is now.*
- **Heist & Caper** — genres: crime, action + rating: 6.5+
  - *The plan, the crew, the score, the double-cross. Stylish criminals and elaborate schemes where nothing goes quite as planned.*
- **War Epics** — genres: war, drama + runtime: 120+ min
  - *Sprawling battlefield sagas and intimate human dramas set against the horror of conflict. The genre where cinema meets history.*
- **Courtroom Drama** — genres: drama + keywords: courtroom, trial, lawyer + rating: 6.5+
  - *Objection sustained. From 12 Angry Men to modern legal thrillers — the courtroom as theater, where truth and justice aren't always the same thing.*
- **Road Movies** — genres: adventure, drama + rating: 6.5+
  - *The open road as metaphor, escape route, and path to self-discovery. From Easy Rider to Paris, Texas — the journey is the destination.*
- **Horror** — genres: horror + rating: 6.5+
  - *From Nosferatu to Hereditary, cinema's most primal genre. Fear is universal — and the best horror films reveal what we're really afraid of.*
- **Western** — genres: western + rating: 6.5+
  - *The defining American genre. Ford, Leone, Eastwood, the Coens. Myths of the frontier — where justice is personal and the landscape is a character.*
- **Musical** — genres: music + rating: 6.5+
  - *Singin' in the Rain, West Side Story, La La Land. The genre that defined Golden Age Hollywood and keeps reinventing itself with infectious joy.*
- **Dark Comedy & Satire** — genres: comedy + keywords: satire, dark comedy, black comedy + rating: 7.0+
  - *Dr. Strangelove, In Bruges, Parasite, Network. Films that make you laugh at things you shouldn't — and then wonder why you're laughing.*
- **Revenge Cinema** — genres: action, thriller + keywords: revenge + rating: 6.5+
  - *Park Chan-wook's Vengeance Trilogy, Kill Bill, I Saw the Devil. Visceral, moral, and deeply cinematic explorations of what vengeance costs.*
- **Slow Cinema** — rating: 7.0+ + runtime: 120+ min + keywords: contemplative, meditative
  - *Tarkovsky, Bela Tarr, Apichatpong Weerasethakul. The cinema of patience and long takes. Not for everyone — essential for cinephiles.*
- **Dystopian Fiction** — genres: sci-fi + keywords: dystopia, totalitarian + rating: 6.5+
  - *Metropolis, Children of Men, A Clockwork Orange. Societies gone wrong — cautionary tales that feel more relevant every year.*
- **Romantic Cinema** — genres: romance, drama + rating: 7.0+
  - *Not rom-coms — genuine romantic cinema. Before Sunrise, In the Mood for Love, Casablanca. Love as art, heartbreak as poetry.*

### Collections (~4 entries, special handling)

- **The Criterion Collection** — fetched from `lib/contextual/data/criterion-collection.json` (array of TMDB movie IDs)
  - *The definitive library of important classic and contemporary films. Each title in the collection represents a landmark of world cinema.*
- **Palme d'Or Winners** — fetched from `lib/contextual/data/palme-dor-winners.json`
  - *Every Cannes top prize winner. The purest barometer of international cinematic excellence, from the Nouvelle Vague to the Korean New Wave.*
- **Sight & Sound Greatest Films** — fetched from `lib/contextual/data/sight-and-sound.json`
  - *The BFI poll — voted on by critics worldwide every decade. The cinephile's canon, from Vertigo to Jeanne Dielman.*
- **A24 Films** — fetched from `lib/contextual/data/a24-films.json`
  - *The studio that made arthouse cool again. Everything Everywhere, Moonlight, Lady Bird, The Lighthouse. Independent cinema's new golden age.*

**Total: ~84 curated rules** in the pool.

---

## 4. Collection Data

### Criterion Collection

Download the Criterion Collection spine list from a public source. Store as a JSON array of TMDB movie IDs:

```
lib/contextual/data/criterion-collection.json
→ { "films": [{ "tmdbId": 858 }, ...] }
```

### New Collections (Palme d'Or, Sight & Sound, A24)

Each stored as a JSON array of TMDB movie IDs, same format as Criterion:

```
lib/contextual/data/palme-dor-winners.json
lib/contextual/data/sight-and-sound.json
lib/contextual/data/a24-films.json
```

### Fetch Strategy

Can't use discover API with a list of IDs. Instead:

1. On homepage row: pick a random page of 20 IDs from the list, batch-fetch via `/3/movie/{id}`
2. On collection page: paginate through the full list, 20 per page
3. Cache aggressively: `staleTime: 30 * 60 * 1000` (30 min)

New fetch function: `fetchMoviesByIds(ids: number[]): Promise<MovieItem[]>`

Uses `Promise.allSettled` to fetch in parallel, filters out failures.

### Upload Mechanism

Replace the JSON file and commit. No UI upload needed — this is a dev-managed list.

---

## 5. Explore Page

### Route Structure

```
app/(protected)/explore/
├── page.tsx              — Category browser (all categories grouped by type)
├── _components/
│   ├── explore-section.tsx    — Section with title + category cards
│   └── category-card.tsx      — Clickable card for a category
└── [slug]/
    ├── page.tsx              — Collection detail page
    └── _components/
        └── collection-detail.tsx — Hero + description + media grid
```

### Explore Index Page (`/explore`)

Groups all curated rules by `category`:

```
DIRECTORS         [Kubrick] [Kurosawa] [Hitchcock] [Spielberg] [Wilder] ...
MOVEMENTS         [French New Wave] [Italian Neorealism] [Czech New Wave] ...
WORLD CINEMA      [Korean Cinema] [Japanese Masters] [Iranian Cinema] [Indian Cinema] ...
ERAS              [Silent Era] [Golden Age] [80s Classics] ...
THEMES & MOODS    [Film Noir] [Horror] [Western] [Dark Comedy] ...
COLLECTIONS       [The Criterion Collection] [Palme d'Or Winners] [Sight & Sound] [A24]
```

Each card shows the category title. Clicking navigates to `/explore/[slug]`.

### Collection Detail Page (`/explore/[slug]`)

- Hero section with title and description
- Full media grid using existing `MediaGrid` component
- For discover-based rules: paginated results from TMDB discover API
- For ID-list rules (Criterion, Palme d'Or, etc.): paginated batch-fetch from the ID list

---

## 6. Overlap Management

Several categories naturally overlap (e.g., "Korean New Wave" movement vs "Korean Cinema" world cinema). The approach:

- **Movements** focus on their historical period with year constraints — they surface the canonical films of that specific era.
- **World Cinema** regions are broader, including contemporary output — sorted by popularity to surface current hits.
- The daily-seed algorithm naturally prevents both from appearing on the same homepage day (unlikely but possible with 84 rules).

---

## 7. New Files Summary

### Data Files
- `lib/contextual/data/criterion-collection.json` — TMDB movie ID array
- `lib/contextual/data/directors.json` — director name + TMDB person ID + slug + description
- `lib/contextual/data/palme-dor-winners.json` — TMDB movie ID array (new)
- `lib/contextual/data/sight-and-sound.json` — TMDB movie ID array (new)
- `lib/contextual/data/a24-films.json` — TMDB movie ID array (new)

### Contextual System Extensions
- `lib/contextual/types.ts` — add `AlwaysMatcher`, `mode`, `CuratedRuleMeta`, `CuratedCategory`
- `lib/contextual/matchers.ts` — add `always` case
- `lib/contextual/curated-rules.ts` — all ~84 curated rules
- `lib/contextual/get-curated-rows.ts` — daily-seed shuffle + slot picker
- `lib/contextual/index.ts` — update barrel exports

### API Layer
- `api/functions/movies/collection.ts` — `fetchMoviesByIds(ids: number[])`
- `options/queries/movies/collection.ts` — query options for ID-based fetching

### Homepage
- `app/(protected)/home/_components/home-browse.tsx` — add `HomeCurated` after trending
- `app/(protected)/home/_components/home-curated.tsx` — renders 6 curated rows

### Explore Pages
- `app/(protected)/explore/page.tsx` — category browser
- `app/(protected)/explore/_components/explore-section.tsx` — section component
- `app/(protected)/explore/_components/category-card.tsx` — card component
- `app/(protected)/explore/[slug]/page.tsx` — collection detail
- `app/(protected)/explore/[slug]/_components/collection-detail.tsx` — detail view

---

## 8. TMDB Reference

### Language Codes
| Language | Code | Used By |
|----------|------|---------|
| French | `fr` | French New Wave, French Cinema |
| Italian | `it` | Italian Neorealism, Italian Cinema, Spaghetti Western |
| German | `de` | German Expressionism, German Cinema |
| Korean | `ko` | Korean New Wave, Korean Cinema |
| Japanese | `ja` | Japanese New Wave, Japanese Masters |
| Swedish | `sv` | Scandinavian Noir |
| Danish | `da` | Scandinavian Noir |
| Norwegian | `no` | Scandinavian Noir |
| Spanish | `es` | Latin American Cinema |
| Portuguese | `pt` | Latin American Cinema (Brazilian) |
| Czech | `cs` | Czech New Wave |
| Farsi/Persian | `fa` | Iranian New Wave, Iranian Cinema |
| Romanian | `ro` | Romanian New Wave |
| English | `en` | British Cinema, Mumblecore |
| Hindi | `hi` | Indian Cinema |
| Tamil | `ta` | Indian Cinema |
| Malayalam | `ml` | Indian Cinema |
| Telugu | `te` | Indian Cinema |
| Bengali | `bn` | Indian Cinema |
| Chinese | `zh` | Chinese Cinema |

### Genre IDs (Movies)
| Genre | ID |
|-------|-----|
| Action | 28 |
| Adventure | 12 |
| Animation | 16 |
| Comedy | 35 |
| Crime | 80 |
| Drama | 18 |
| Family | 10751 |
| Fantasy | 14 |
| Horror | 27 |
| Music | 10402 |
| Mystery | 9648 |
| Romance | 10749 |
| Sci-Fi | 878 |
| Thriller | 53 |
| War | 10752 |
| Western | 37 |

### Genre IDs (TV)
| Genre | ID |
|-------|-----|
| Action & Adventure | 10759 |
| Animation | 16 |
| Comedy | 35 |
| Crime | 80 |
| Drama | 18 |
| Family | 10751 |
| Mystery | 9648 |
| Sci-Fi & Fantasy | 10765 |
| War & Politics | 10768 |

---

## 9. Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Extend contextual system (Approach A) | Reuses existing infrastructure, minimal new code |
| Homepage behavior | Rotating 6 rows, daily seed | Fresh each day, consistent within a day |
| Director format | Movie-only rows | Directors are primarily known for films |
| Criterion data | Real list from web, JSON file | Accurate, simple update mechanism |
| Explore page UX | Dedicated collection pages per category | Premium feel, room for description + full grid |
| Row count | 6 curated rows on homepage | Good variety without overwhelming |
| 70s era removal | Removed (duplicate of New Hollywood movement) | Identical year ranges and filters |
| Dogme 95 filter | No language restriction | Movement was international, not just Danish |
| Mumblecore filter | Added language: en | Prevents false positives from generic drama/comedy |
| Cyberpunk filter | Added keywords: cyberpunk, dystopia, android | Genre-only filter was too broad (returned Star Wars) |
| Courtroom filter | Added keywords: courtroom, trial, lawyer | Genre-only filter was too broad (returned all dramas) |
| Coming-of-Age filter | Added keywords: coming-of-age | Genre-only filter was too broad |
| Latin American filter | language: es + pt | Portuguese required for Brazilian cinema |
| Scandinavian filter | language: sv + da + no | All three Nordic languages required |
| Director descriptions | Unique per director (in directors.json) | Generic "Films directed by X" was a disservice |
| British Cinema filter | language: en + region: GB | English-only would include US/AU/etc. |
