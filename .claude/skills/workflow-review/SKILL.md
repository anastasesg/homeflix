---
name: workflow-review
description: Use when /workflow:review command is invoked. Presents the aggregated implementation report to the user for final sign-off. Runs final verification across all changes.
---

# Workflow: Review Phase

Present the implementation results for user sign-off before committing.

## Prerequisites

- `.working/{type}/{slug}/impl/IMPLEMENTATION.md` must exist
- `STATUS.md` phase must be `implementation-complete`

If prerequisites aren't met, tell the user which phase to complete first.

## Skills Integration

### Superpowers
- **`requesting-code-review`** — Invoke this skill to frame the review correctly. Present the full diff context, not just summaries.
- **`verification-before-completion`** — Run full verification (`bun check`, `bun lint --fix`) before declaring the review passed.

### Plugin tools
- **`code-simplifier`** (agent) — After verification passes, spawn this agent on the changed files to simplify and refine code for clarity and consistency. It preserves all functionality while improving maintainability.
- **`playwright`** (MCP tools) — If the work involves visible UI changes, use Playwright to take screenshots of affected pages for visual verification. Navigate to `localhost:3000` (start dev server if needed) and screenshot the relevant routes.
- **`feature-dev:code-reviewer`** (agent) — Spawn for a final confidence-scored review of the full diff. It reports only high-priority issues (confidence >= 80) and references CLAUDE.md guidelines.

## Process

### 1. Read implementation report

Read `impl/IMPLEMENTATION.md` and all individual task reports from `impl/task/TASK_*.md`.

### 2. Run final verification

In the worktree, run:
```bash
cd {worktree_path}
bun check
bun lint --fix
```

Both must pass across the entire codebase, not just changed files.

### 3. Get full diff

Show the complete diff from the branch point:
```bash
cd {worktree_path}
git diff main...HEAD --stat
```

### 4. Present to user

Present a structured summary:

```markdown
## Implementation Review: {slug}

### Changes Overview
{git diff --stat output}

### Tasks Completed
{Table from IMPLEMENTATION.md}

### Verification
- TypeScript: PASS/FAIL
- Lint: PASS/FAIL

### All Task Reviews: APPROVED

### Ready to finalize?
```

### 5. Handle user feedback

If the user requests changes:
- Note what needs to change
- Either make the changes directly or spawn a task-implementer agent
- Re-run verification
- Present again

If the user approves:
- Update STATUS.md: `phase: review-complete`
- Tell them: **"Approved. Run `/complete {slug}` to squash and finalize."**

## Rules

- **Show the full picture** — don't hide any task results
- **Run fresh verification** — don't trust cached results from task reports
- **User decides** — present findings, let the user approve or request changes
- **Be transparent about issues** — if anything failed, highlight it clearly
