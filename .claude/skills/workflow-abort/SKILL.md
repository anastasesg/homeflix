---
name: workflow-abort
description: Abort a workflow — cleans up worktrees and branches, marks the workspace as aborted.
---

# Workflow: Abort

Clean up a stuck or unwanted workflow. Removes git worktrees and branches but preserves workspace files for reference.

## Workspace Discovery

The user invokes this as `/workflow-abort {slug}`.

1. If `$ARGUMENTS` is empty, scan `.workflow/*/` directories and list available workspaces
2. Scan `.workflow/*/` for a folder matching the slug `$ARGUMENTS`
3. Read `STATUS.yaml` — can be any phase except `complete`

## Process

### 1. Confirm with user

Present the current state (phase, completed tasks, pending tasks) and ask:
**"This will remove all worktrees and branches for `{slug}`. The workspace files (discussion, design, plan, reports) will be preserved. Continue?"**

Wait for confirmation before proceeding.

### 2. Remove task worktrees

Check for remaining task worktrees:
```bash
git worktree list
```

For each worktree under `.workflow/{type}/{slug}/worktrees/task-*`:
```bash
git worktree remove {TASK_WORKTREE} --force
git branch -D work/{type}/{slug}/task-{N}
```

### 3. Remove base worktree

If `base_worktree` exists in STATUS.yaml:
```bash
git worktree remove {BASE_WORKTREE} --force
git branch -D work/{type}/{slug}/base
```

### 4. Clean up worktrees directory

```bash
rm -rf {WORKSPACE}/worktrees
```

### 5. Update STATUS.yaml

```yaml
phase: aborted
aborted: {ISO timestamp}
```

Remove `base_worktree` and task `worktree` keys (no longer valid).

### 6. Summary

```markdown
## Workflow Aborted: {slug}

- Worktrees removed: {count}
- Branches deleted: {list}
- Workspace preserved at `.workflow/{type}/{slug}/`
```

## Rules

- **Always confirm before aborting** — this removes git worktrees and branches
- **Preserve workspace files** — discussion, design, plan, and reports stay for reference
- **Use `--force` for worktree removal** — worktrees may have uncommitted changes
- **Use `-D` for branch deletion** — branches may not be fully merged
- **Use `-C` for git commands** — never use `cd`
