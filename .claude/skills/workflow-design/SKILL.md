---
name: workflow-design
description: Use when /design command is invoked. Reads DISCUSSION.md and produces a high-level DESIGN.md through iterative user validation. Presents design in 200-300 word sections.
---

# Workflow: Design Phase

Transform the discussion output into a validated high-level design.

## Prerequisites

- `.working/{type}/{slug}/DISCUSSION.md` must exist
- `STATUS.md` phase must be `discussion-complete`

If prerequisites aren't met, tell the user which phase to complete first.

## Process

### 1. Read inputs

Read these files from the workspace:
- `DISCUSSION.md` — decisions, scope, relevant code
- `ASSUMPTIONS.md` — if it exists
- `STATUS.md` — workspace metadata

### 2. Explore approaches

Based on the discussion, propose **2-3 different approaches** with trade-offs:
- Lead with your recommended approach and explain why
- Be specific about architectural implications
- Reference existing codebase patterns where relevant

Ask the user which approach to proceed with.

### 3. Present design in sections

Once an approach is chosen, present the design in **sections of 200-300 words**. After each section, ask: **"Does this look right?"**

Sections to cover (adapt based on work type):
- **Architecture overview** — how components/modules relate
- **Data flow** — how data moves through the system
- **Component/file breakdown** — what gets created/modified
- **Edge cases & error handling** — what could go wrong
- **Integration points** — how this connects to existing code

### 4. Write DESIGN.md

After all sections are validated, write `.working/{type}/{slug}/DESIGN.md`:

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
```

### 5. Wrap up

1. Present the complete DESIGN.md for final confirmation
2. Ask: **"Design looks complete. Ready to plan with `/plan {slug}`?"**
3. Update STATUS.md: `phase: design-complete`

## Rules

- **Read DISCUSSION.md first** — never skip the inputs
- **Propose alternatives** — always show 2-3 approaches before committing
- **Validate incrementally** — present in sections, don't dump the whole design
- **Be specific** — name exact files, patterns, and integration points
- **No implementation** — this phase is about what, not how
