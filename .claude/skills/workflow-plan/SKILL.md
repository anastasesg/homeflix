---
name: workflow-plan
description: Use when /plan command is invoked. Reads DESIGN.md and decomposes it into atomic TASK files with dependency tracking. Creates plan/PLAN.md and plan/task/TASK_{N}.md files.
---

# Workflow: Plan Phase

Decompose the design into atomic, narrowly-scoped implementation tasks.

## Prerequisites

- `.working/{type}/{slug}/DESIGN.md` must exist
- `STATUS.md` phase must be `design-complete`

If prerequisites aren't met, tell the user which phase to complete first.

## Process

### 1. Read inputs

Read these files from the workspace:
- `DESIGN.md` — architecture, component breakdown, file changes
- `DISCUSSION.md` — original context and scope
- `ASSUMPTIONS.md` — if it exists

### 2. Decompose into tasks

Break the design into atomic tasks. Each task should:
- Have a **single clear objective**
- Touch a **small, well-defined set of files** (ideally 1-3)
- Be **completable by one agent** without needing clarification
- Have **clear acceptance criteria** that can be mechanically verified
- Take roughly **5-15 minutes** of focused implementation

### 3. Define dependencies

Map which tasks depend on others:
- `depends_on: [1, 3]` — this task can't start until tasks 1 and 3 are done
- `blocks: [5, 6]` — tasks 5 and 6 can't start until this is done
- Tasks with no dependencies can run in parallel

### 4. Identify execution batches

Group tasks into batches for parallel execution:
- **Batch 1**: All tasks with `depends_on: []`
- **Batch 2**: Tasks whose dependencies are all in batch 1
- **Batch N**: And so on

### 5. Write plan/PLAN.md

Create `.working/{type}/{slug}/plan/PLAN.md`:

```markdown
# Plan: {slug}

## Summary
{What this plan implements, referencing the design}

## Task Overview

| # | Title | Depends On | Blocks | Batch |
|---|-------|-----------|--------|-------|
| 1 | ... | — | 3, 4 | 1 |
| 2 | ... | — | 5 | 1 |
| 3 | ... | 1 | 6 | 2 |

## Execution Batches

### Batch 1 (parallel)
- Task 1: ...
- Task 2: ...

### Batch 2 (parallel, after batch 1)
- Task 3: ...
- Task 4: ...

## File Impact Summary

### New files
- `path/to/file.ts` — Task 1

### Modified files
- `path/to/file.ts` — Tasks 2, 4

## Risk Areas
- {Anything that might cause issues during implementation}
```

### 6. Write task files

Create `.working/{type}/{slug}/plan/task/TASK_{N}.md` for each task using this template:

```markdown
# Task {N}: {Title}

## Status
status: pending
depends_on: []
blocks: []

## Context
{Why this task exists and how it fits in the plan. Reference the design.}

## Objective
{Single clear sentence of what this task accomplishes.}

## Scope
### Files to create
- `path/to/file.ts` — Description of what this file does

### Files to modify
- `path/to/file.ts` — What specific changes to make

### Files for reference (read-only)
- `path/to/file.ts` — Why to read this (pattern to follow, types to use, etc.)

## Implementation Notes
- Specific guidance, patterns to follow, gotchas
- Reference existing code patterns: "Follow the same pattern as `api/functions/movies.ts`"
- Note any project conventions: "Use `cn()` for class merging, named exports only"

## Acceptance Criteria
- [ ] Specific functional criterion 1
- [ ] Specific functional criterion 2
- [ ] TypeScript compiles: `bun check` passes
- [ ] Lint passes: `bun lint --fix` clean

## Out of Scope
- {Things explicitly excluded — prevents agent scope creep}
```

### 7. Present and validate

1. Present the PLAN.md overview table to the user
2. Walk through the dependency graph: "Tasks 1 and 2 run in parallel, then task 3 after 1 completes..."
3. Ask: **"Does this task breakdown look right? Any tasks too big or missing?"**
4. Adjust based on feedback
5. Update STATUS.md: `phase: plan-complete`

## Rules

- **Read DESIGN.md first** — the plan must trace back to the design
- **Atomic tasks** — if a task description says "and also", split it
- **Explicit dependencies** — every task must declare what it depends on
- **Reference files** — every task must list files to read for patterns
- **No ambiguity** — an agent with zero project knowledge should be able to execute a task
- **Acceptance criteria are mechanical** — "TypeScript compiles" not "code is good"
- **Out of scope section is mandatory** — prevents agent scope creep
