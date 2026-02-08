---
description: Squash commits, clean up worktree, and finalize the workspace
---

# Complete Phase

Squash commits, clean up worktree, and finalize the workspace.

## Instructions

The user wants to complete workspace: `$ARGUMENTS`

If no arguments provided, list available workspaces by scanning `.working/*/` and ask which one.

### 1. Find workspace

Scan `.working/*/` directories for a folder matching the slug `$ARGUMENTS`.

### 2. Validate phase

Read `STATUS.md`. The phase must be `review-complete`.
If not, tell the user which phase to complete first.

### 3. Enter complete phase

Update STATUS.md: `phase: completing`, `updated: {timestamp}`

Use the `workflow-complete` skill to finalize.
Pass the workspace path.
