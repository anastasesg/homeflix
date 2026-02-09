---
name: workflow-discuss
description: Kick off a new workflow by discussing requirements — asks clarifying questions, explores trade-offs, and captures decisions in a structured format.
---

# Workflow: Discussion Phase

Guide the user through a structured discussion to understand what they want to build/fix/refactor. Capture everything in DISCUSSION.md.

## Workspace Setup

The user invokes this as `/workflow-discuss {description}`.

### 1. Parse arguments

If `$ARGUMENTS` is empty, ask the user to describe what they want to work on.

### 2. Classify work type

Based on the description, determine the type:
- `feat` — New feature or functionality
- `bug` — Bug fix
- `refactor` — Code restructuring without behavior change
- `docs` — Documentation changes
- `chore` — Maintenance, dependencies, tooling

### 3. Generate slug

Create a descriptive, kebab-case slug (3-5 words max). Examples:
- "add global search with filters" → `global-search-filters`
- "fix movie detail page crash" → `fix-movie-detail-crash`

### 4. Confirm with user

Present: **"I'd classify this as `{type}` with slug `{slug}`. Does that look right?"**

Wait for confirmation before proceeding.

### 5. Create workspace

```bash
mkdir -p .working/{type}/{slug}
```

Write `.working/{type}/{slug}/STATUS.yaml`:

```yaml
slug: {slug}
type: {type}
phase: discussion
created: {ISO timestamp}
updated: {ISO timestamp}
```

## Skills Integration

Before starting the discussion, invoke these skills to inform your exploration:

### Always invoke
- **`brainstorming`** (superpowers) — Use this to explore the solution space before narrowing scope. Present 2-3 creative approaches to the user during discussion.

### Invoke based on work type

**Project skills** (from `.claude/skills/`):
- **`page-building`** — If the work involves creating or modifying pages, invoke to understand the page architecture patterns (listing vs. detail vs. browse).
- **`component-architecture`** — If the work involves new or restructured components, invoke to understand file organization, composition, and prop design patterns.
- **`data-fetching`** — If the work involves API data, invoke to understand the query pipeline (API client → function → query options → Query wrapper).
- **`styling-design`** — If the work involves visual changes, invoke to understand the color system, animation patterns, and responsive approach.
- **`query-autonomy`** — If the work involves refactoring prop passthrough into independent queries.

**Plugin skills/tools:**
- **`frontend-design`** (plugin) — If the work involves building new UI with significant visual design. Use to inform bold aesthetic direction and avoid generic AI aesthetics.
- **`feature-dev:code-explorer`** (agent) — Spawn this agent to deeply analyze existing features before discussing changes. It traces execution paths and maps architecture layers.
- **`context7`** (MCP tools) — **CRITICAL: Never assume library APIs.** Use `resolve-library-id` + `query-docs` to look up current documentation for Next.js, TanStack Query, Radix/shadcn, nuqs, or any library used in this project. Do this during discussion when API behavior matters for a decision.

Reference the relevant skills when asking questions — e.g., "Based on our page-building patterns, this would follow the Detail Page structure (Header + Stats + Tabs). Does that match your intent?"

## Process

### 1. Understand the intent

Read the user's description and ask clarifying questions **one at a time**. Prefer multiple-choice questions when possible.

Focus areas:
- What exactly needs to happen?
- What are the constraints?
- What's in scope vs out of scope?
- Are there existing patterns to follow? (consult relevant project skills)
- What does "done" look like?

### 2. Explore the codebase

As the discussion progresses, proactively explore relevant code:
- Search for existing implementations the work relates to
- Identify files that will likely be affected
- Note patterns the implementation should follow (reference specific skills)

### 3. Capture in DISCUSSION.md

Write/update `.working/{type}/{slug}/DISCUSSION.md` as the conversation progresses:

```markdown
# Discussion: {slug}

## Intent
{One paragraph summarizing what the user wants}

## Key Decisions
- **Decision 1**: {What was decided and why}
- **Decision 2**: ...

## Scope
### In scope
- Item 1
- Item 2

### Out of scope
- Item 1

## Relevant Code
- `path/to/file.ts` — {Why it's relevant}
- `path/to/other.ts` — {Pattern to follow}

## Applicable Skills
- `component-architecture` — {Why this skill applies}
- `data-fetching` — {Why this skill applies}
- `styling-design` — {Why this skill applies}
- (only list skills that are relevant to this work)

## Open Questions
- {Any unresolved questions}

## Notes
- {Additional context gathered during discussion}
```

### 4. Track assumptions

If any assumptions are made during discussion, create/update `.working/{type}/{slug}/ASSUMPTIONS.md`:

```markdown
# Assumptions: {slug}

- **Assumption**: {What was assumed}
  **Basis**: {Why this seems reasonable}
  **Risk if wrong**: {What would need to change}
```

### 5. Wrap up

When the discussion feels complete (scope is clear, decisions are made, no open questions):

1. Present a summary of DISCUSSION.md to the user
2. Ask: **"Does this capture everything? Ready to move to design with `/workflow-design {slug}`?"** (or continue with `/workflow-plan {slug}` if design isn't needed)
3. Update STATUS.yaml: `phase: discussion-complete`

## Rules

- **One question at a time** — never ask multiple questions in one message
- **Multiple choice preferred** — easier for the user to respond
- **Capture as you go** — don't wait until the end to write DISCUSSION.md
- **Explore proactively** — search the codebase to inform questions
- **No implementation** — this phase is purely about understanding
- **Track assumptions** — if you assume something, write it down
