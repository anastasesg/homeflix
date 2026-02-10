---
name: workflow-design
description: Convert discussion output into a validated design — reads captured requirements and presents architecture for iterative approval.
---

# Workflow: Design Phase

Transform the discussion output into a validated high-level design.

## Workspace Discovery

The user invokes this as `/workflow-design {slug}`.

1. If `$ARGUMENTS` is empty, scan `.workflow/*/` directories and list available workspaces — ask which one
2. Scan `.workflow/*/` for a folder matching the slug `$ARGUMENTS`
3. Read `STATUS.yaml` — phase must be `discussion-complete`. If not, tell the user which phase to complete first.
4. Verify `.workflow/{type}/{slug}/DISCUSSION.md` exists
5. Update STATUS.yaml: `phase: design`, `updated: {ISO timestamp}`

## Skills Integration

### Always invoke
- **`writing-plans`** (superpowers) — Use this to structure the design approach before presenting to the user.

### Consult from DISCUSSION.md
Read the `## Applicable Skills` section from DISCUSSION.md. For each listed skill, invoke it and use its patterns to inform the design:

**Project skills:**
- **`page-building`** → Use its page type taxonomy (listing / detail / browse) and step-by-step architecture to structure the Component Breakdown section.
- **`component-architecture`** → Use its file organization rules, composition patterns, and splitting decisions to inform the Architecture section.
- **`data-fetching`** → Use its pipeline (client → function → query options → Query wrapper) to inform the Data Flow section.
- **`styling-design`** → Use its color system, animation patterns, and responsive approach to inform any visual design decisions.
- **`query-autonomy`** → If refactoring prop passthrough, use its select-based pattern for the data flow design.

**Plugin skills/tools:**
- **`frontend-design`** (plugin) → If the work involves significant new UI, invoke for visual direction. Use its aesthetic thinking process (Purpose → Tone → Differentiation) to inform the Visual Design section.
- **`feature-dev:code-architect`** (agent) → Spawn this agent to produce a comprehensive architecture blueprint. It analyzes existing patterns, makes decisive choices, and provides file-level implementation maps.
- **`context7`** (MCP tools) → **CRITICAL: Verify all library APIs before committing to a design.** Use `resolve-library-id` + `query-docs` to look up current API signatures for any library where the design depends on specific behavior (e.g., TanStack Query `select` option, nuqs parsers, Radix component APIs).

When presenting design sections, **cite which skill** informed the decision — e.g., "Per the data-fetching skill, each section will own its query rather than receiving props from a parent."

## Process

### 1. Read inputs

Read these files from the workspace:
- `DISCUSSION.md` — decisions, scope, relevant code, **applicable skills**
- `ASSUMPTIONS.md` — if it exists
- `STATUS.yaml` — workspace metadata

### 2. Explore approaches

Based on the discussion and applicable skills, propose **2-3 different approaches** with trade-offs:
- Lead with your recommended approach and explain why
- Be specific about architectural implications
- Reference existing codebase patterns and project skills where relevant

Ask the user which approach to proceed with.

### 3. Present design in sections

Once an approach is chosen, present the design in **sections of 200-300 words**. After each section, ask: **"Does this look right?"**

Sections to cover (adapt based on work type):
- **Architecture overview** — how components/modules relate (informed by `component-architecture`)
- **Data flow** — how data moves through the system (informed by `data-fetching`)
- **Component/file breakdown** — what gets created/modified (informed by `page-building`)
- **Visual design** — key styling decisions (informed by `styling-design`, if applicable)
- **Edge cases & error handling** — what could go wrong
- **Integration points** — how this connects to existing code

### 4. Write DESIGN.md

After all sections are validated, write `.workflow/{type}/{slug}/DESIGN.md`:

```markdown
# Design: {slug}

## Overview
{2-3 sentence summary of what this design achieves}

## Approach
{Which approach was chosen and why}

## Architecture
{How components/modules relate}

## Data Flow
{How data moves through the system}

## Component Breakdown
| Component | Type | Purpose |
|-----------|------|---------|
| ... | create/modify | ... |

## File Changes
### New files
- `path/to/file.ts` — Purpose

### Modified files
- `path/to/file.ts` — What changes and why

### Reference files
- `path/to/file.ts` — Pattern to follow

## Edge Cases
- {Edge case and how it's handled}

## Integration Points
- {How this connects to existing code}

## Design Decisions
- **Decision**: {What} — **Rationale**: {Why}

## Applicable Skills
Carried forward from DISCUSSION.md, refined with implementation-specific detail:
- `code-style` — Always (all tasks)
- `component-architecture` — {Which tasks and why}
- `data-fetching` — {Which tasks and why}
- `styling-design` — {Which tasks and why}
- (only list skills relevant to this work)
```

### 5. Wrap up

1. Present the complete DESIGN.md for final confirmation
2. Ask: **"Design looks complete. Ready to plan with `/workflow-plan {slug}`?"**
3. Update STATUS.yaml: `phase: design-complete`

## Rules

- **Read DISCUSSION.md first** — never skip the inputs
- **Propose alternatives** — always show 2-3 approaches before committing
- **Validate incrementally** — present in sections, don't dump the whole design
- **Be specific** — name exact files, patterns, and integration points
- **No implementation** — this phase is about what, not how
