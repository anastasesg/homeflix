---
name: workflow-plan
description: Break an approved design into atomic implementation tasks — creates dependency-ordered task specs ready for parallel agent execution.
---

# Workflow: Plan Phase

Decompose the design into atomic, narrowly-scoped implementation tasks.

## Workspace Discovery

The user invokes this as `/workflow-plan {slug}`.

1. If `$ARGUMENTS` is empty, scan `.workflow/*/` directories and list available workspaces — ask which one
2. Scan `.workflow/*/` for a folder matching the slug `$ARGUMENTS`
3. Read `STATUS.yaml` — phase must be `design-complete` or `discussion-complete`:
   - `design-complete` → normal flow, read DESIGN.md
   - `discussion-complete` → design was skipped, derive plan from DISCUSSION.md directly
   - Otherwise → tell the user which phase to complete first
4. If `design-complete`: verify `DESIGN.md` exists. If `discussion-complete`: verify `DISCUSSION.md` exists (DESIGN.md is optional).
5. Update STATUS.yaml: `phase: plan`, `updated: {ISO timestamp}`

## Skills Integration

### Skill tagging is mandatory

Every task MUST include an `## Applicable Skills` section listing which project skills the task-implementer agent should consult. This is the **primary mechanism** for ensuring agents follow project patterns.

### Available skills for tagging

**Project skills** (from `.claude/skills/` — agent reads these files directly):

| Skill | Tag when... |
|---|---|
| `code-style` | **Always** — every task gets this |
| `component-architecture` | Task creates or modifies React components |
| `data-fetching` | Task involves queries, API calls, or Query/Queries wrappers |
| `styling-design` | Task involves Tailwind CSS, visual design, loading states |
| `new-component` | Task creates a new React component from scratch |
| `page-building` | Task creates a new page or page-level component |
| `query-autonomy` | Task refactors prop passthrough into select-based queries |

**Plugin skills/tools** (agent uses via Skill tool or MCP tools):

| Skill | Tag when... |
|---|---|
| `frontend-design` | Task involves building distinctive new UI (not just structural changes) |
| `context7` | Task uses library APIs that must be verified — **tag with specific libraries to look up** (e.g., "context7: TanStack Query select option, nuqs parseAsArrayOf") |
| `systematic-debugging` | Task involves fixing bugs or unexpected behavior |

### Read applicable skills from DESIGN.md

The design's `## Applicable Skills` section tells you which skills are relevant to this workspace. Distribute them to individual tasks based on what each task does.

## Process

### 1. Read inputs

Read these files from the workspace:
- `DESIGN.md` — architecture, component breakdown, file changes, **applicable skills**
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

Create `.workflow/{type}/{slug}/plan/PLAN.md`:

````markdown
---
slug: "{slug}"
total_tasks: {N}
tasks:
  - id: 1
    title: "..."
    depends_on: []
    blocks: [3, 4]
    batch: 1
    skills: [code-style, data-fetching]
  - id: 2
    title: "..."
    depends_on: []
    blocks: [5]
    batch: 1
    skills: [code-style, component-architecture, styling-design]
  - id: 3
    title: "..."
    depends_on: [1]
    blocks: [6]
    batch: 2
    skills: [code-style, data-fetching]
batches:
  - batch: 1
    tasks: [1, 2]
  - batch: 2
    tasks: [3, 4]
---

## Summary
{What this plan implements, referencing the design}

## File Impact Summary

### New files
- `path/to/file.ts` — Task 1

### Modified files
- `path/to/file.ts` — Tasks 2, 4

## Risk Areas
- {Anything that might cause issues during implementation}
````

**Frontmatter schema notes:**
- `tasks` — full task overview (replaces the markdown table); used by workflow-implement to resolve dependencies
- `batches` — execution order; each batch lists task IDs that can run in parallel
- Prose sections (Summary, File Impact, Risk Areas) stay in the markdown body for readability

### 6. Write task files

Create `.workflow/{type}/{slug}/plan/task/TASK_{N}.md` for each task using this template:

````markdown
---
task: {N}
title: "{Title}"
status: pending
depends_on: []
blocks: []
batch: {batch_number}
skills:
  - code-style
  - "{other applicable skills}"
files_create:
  - path: "path/to/file.ts"
    description: "What this file does"
files_modify:
  - path: "path/to/file.ts"
    description: "What specific changes to make"
files_reference:
  - path: "path/to/file.ts"
    description: "Why to read this (pattern to follow, types to use, etc.)"
acceptance:
  - "Specific functional criterion 1"
  - "Specific functional criterion 2"
  - "bun check passes"
  - "bun lint --fix clean"
---

## Context
{Why this task exists and how it fits in the plan. Reference the design.}

## Objective
{Single clear sentence of what this task accomplishes.}

## Skills Guidance
The task-implementer agent MUST read these skills (from `.claude/skills/`) before writing code.
Always include `code-style`. Add others based on what the task does:
- `component-architecture` — {Why, if applicable}
- `data-fetching` — {Why, if applicable}
- `styling-design` — {Why, if applicable}

## Implementation Notes
- Specific guidance, patterns to follow, gotchas
- Reference existing code patterns: "Follow the same pattern as `api/functions/movies.ts`"
- Note any project conventions: "Use `cn()` for class merging, named exports only"

## Out of Scope
- {Things explicitly excluded — prevents agent scope creep}
````

**Frontmatter schema notes:**
- `skills` — list of skill names the task-implementer must read; always includes `code-style`
- `files_create` / `files_modify` / `files_reference` — structured file lists for programmatic access
- `acceptance` — flat list of strings; the last two should always be `bun check` and `bun lint`
- Prose sections (Context, Objective, Implementation Notes, Out of Scope) stay in the markdown body

### 7. Present and validate

1. Present the PLAN.md overview table to the user
2. Walk through the dependency graph: "Tasks 1 and 2 run in parallel, then task 3 after 1 completes..."
3. Ask: **"Does this task breakdown look right? Any tasks too big or missing?"**
4. Adjust based on feedback
5. Update STATUS.yaml: `phase: plan-complete`

## Rules

- **Read DESIGN.md first** — or DISCUSSION.md if design was skipped. The plan must trace back to the design or discussion.
- **Atomic tasks** — if a task description says "and also", split it
- **Explicit dependencies** — every task must declare what it depends on
- **Reference files** — every task must list files to read for patterns
- **No ambiguity** — an agent with zero project knowledge should be able to execute a task
- **Acceptance criteria are mechanical** — "TypeScript compiles" not "code is good"
- **Out of scope section is mandatory** — prevents agent scope creep
