---
description: Produce a high-level design from discussion output for a workspace
---

# Design Phase

Produce a high-level design from the discussion output.

## Instructions

The user wants to design workspace: `$ARGUMENTS`

If no arguments provided, list available workspaces by scanning `.working/*/` and ask which one.

### 1. Find workspace

Scan `.working/*/` directories for a folder matching the slug `$ARGUMENTS`.

### 2. Validate phase

Read `STATUS.md`. The phase must be `discussion-complete`.
If not, tell the user: "Discussion phase isn't complete yet. Run the discussion first or check `.working/{type}/{slug}/DISCUSSION.md`."

### 3. Enter design phase

Update STATUS.md: `phase: design`, `updated: {timestamp}`

Use the `workflow-design` skill to produce the design.
Pass the workspace path.
