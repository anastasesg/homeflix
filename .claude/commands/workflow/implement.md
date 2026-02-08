---
description: Execute planned tasks using agents in a git worktree
---

# Implementation Phase

Execute all planned tasks using agents.

## Instructions

The user wants to implement workspace: `$ARGUMENTS`

If no arguments provided, list available workspaces by scanning `.working/*/` and ask which one.

### 1. Find workspace

Scan `.working/*/` directories for a folder matching the slug `$ARGUMENTS`.

### 2. Validate phase

Read `STATUS.md`. The phase must be `plan-complete`.
If not, tell the user which phase to complete first.

### 3. Enter implementation phase

Update STATUS.md: `phase: implementation`, `updated: {timestamp}`

Use the `workflow-implement` skill to orchestrate task execution.
Pass the workspace path.
