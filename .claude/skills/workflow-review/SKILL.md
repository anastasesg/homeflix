---
name: workflow-review
description: Review completed implementation — runs final verification across all changes and presents results for user sign-off.
---

# Workflow: Review Phase

Present the implementation results for user sign-off before committing.

## Workspace Discovery

The user invokes this as `/workflow-review {slug}`.

1. If `$ARGUMENTS` is empty, scan `.workflow/*/` directories and list available workspaces — ask which one
2. Scan `.workflow/*/` for a folder matching the slug `$ARGUMENTS`
3. Read `STATUS.yaml` — phase must be `implementation-complete`. If not, tell the user which phase to complete first.
4. Verify `.workflow/{type}/{slug}/impl/IMPLEMENTATION.md` exists
5. Update STATUS.yaml: `phase: review`, `updated: {ISO timestamp}`

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

Read `impl/IMPLEMENTATION.md` — the **YAML frontmatter** contains structured results:
- `total_tasks`, `completed`, `failed`, `all_approved` — summary stats
- `verification` — aggregate TypeScript and lint status
- `tasks` — array of `{id, title, status, commit, review}` for each task

Also read individual task reports from `impl/task/TASK_*.md` for detailed notes and review findings.

Read `STATUS.yaml` for `base_worktree` — this is the worktree with all merged changes.

### 2. Run final verification

In the **base worktree** (which has all task branches merged in), run:
```bash
bun --cwd {BASE_WORKTREE} check
bun --cwd {BASE_WORKTREE} lint --fix
```

Both must pass across the entire codebase, not just changed files.

### 3. Get full diff

Show the complete diff from the branch point:
```bash
git -C {BASE_WORKTREE} diff main...HEAD --stat
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
- **Always spawn a task-implementer agent** — NEVER make code changes yourself
- Create a temporary task worktree for fix-up work (branch from base, merge back after)
- Re-run verification
- Present again

If the user approves:
- Update STATUS.yaml: `phase: review-complete`
- Tell them: **"Approved. Run `/workflow-complete {slug}` to squash and finalize."**

## Rules

- **Show the full picture** — don't hide any task results
- **Run fresh verification** — don't trust cached results from task reports
- **User decides** — present findings, let the user approve or request changes
- **Be transparent about issues** — if anything failed, highlight it clearly
- **Use the base worktree** — all review verification happens there (task worktrees are gone)
