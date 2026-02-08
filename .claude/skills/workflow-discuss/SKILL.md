---
name: workflow-discuss
description: Use when the /work command starts a new workspace. Guides the discussion phase — asks clarifying questions one at a time, captures decisions in DISCUSSION.md, tracks assumptions in ASSUMPTIONS.md.
---

# Workflow: Discussion Phase

Guide the user through a structured discussion to understand what they want to build/fix/refactor. Capture everything in DISCUSSION.md.

## Inputs

- **Workspace path**: `.working/{type}/{slug}/` (provided by /work command)
- **User's description**: The original intent (from /work arguments)
- **STATUS.md**: Already created by /work command with type, slug, timestamps

## Process

### 1. Understand the intent

Read the user's description and ask clarifying questions **one at a time**. Prefer multiple-choice questions when possible.

Focus areas:
- What exactly needs to happen?
- What are the constraints?
- What's in scope vs out of scope?
- Are there existing patterns to follow?
- What does "done" look like?

### 2. Explore the codebase

As the discussion progresses, proactively explore relevant code:
- Search for existing implementations the work relates to
- Identify files that will likely be affected
- Note patterns the implementation should follow

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
2. Ask: **"Does this capture everything? Ready to move to design with `/design {slug}`?"**
3. Update STATUS.md: `phase: discussion-complete`

## Rules

- **One question at a time** — never ask multiple questions in one message
- **Multiple choice preferred** — easier for the user to respond
- **Capture as you go** — don't wait until the end to write DISCUSSION.md
- **Explore proactively** — search the codebase to inform questions
- **No implementation** — this phase is purely about understanding
- **Track assumptions** — if you assume something, write it down
