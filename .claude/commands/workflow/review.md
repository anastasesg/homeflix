---
description: Present implementation results for user sign-off before finalizing
---

# Review Phase

Present implementation results for user sign-off.

## Instructions

The user wants to review workspace: `$ARGUMENTS`

If no arguments provided, list available workspaces by scanning `.working/*/` and ask which one.

### 1. Find workspace

Scan `.working/*/` directories for a folder matching the slug `$ARGUMENTS`.

### 2. Validate phase

Read `STATUS.md`. The phase must be `implementation-complete`.
If not, tell the user which phase to complete first.

### 3. Enter review phase

Update STATUS.md: `phase: review`, `updated: {timestamp}`

Use the `workflow-review` skill to present results.
Pass the workspace path.
