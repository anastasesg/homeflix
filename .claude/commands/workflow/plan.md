---
description: Decompose a design into atomic implementation tasks with dependencies
---

# Plan Phase

Decompose the design into atomic implementation tasks.

## Instructions

The user wants to plan workspace: `$ARGUMENTS`

If no arguments provided, list available workspaces by scanning `.working/*/` and ask which one.

### 1. Find workspace

Scan `.working/*/` directories for a folder matching the slug `$ARGUMENTS`.

### 2. Validate phase

Read `STATUS.md`. The phase must be `design-complete`.
If not, tell the user which phase to complete first.

### 3. Enter plan phase

Update STATUS.md: `phase: plan`, `updated: {timestamp}`

Use the `workflow-plan` skill to decompose the design into tasks.
Pass the workspace path.
