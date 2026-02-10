---
name: workflow-complete
description: Finalize the workflow — squash commits into one clean commit, remove worktrees, and close the workspace.
---

# Workflow: Complete Phase

Finalize the work — squash, clean up, and close the workspace.

## Skills Integration

### Superpowers
- **`finishing-a-development-branch`** — Invoke this before squashing/merging. It guides the decision on how to integrate the work (squash merge, rebase, etc.) and ensures nothing is left behind.
- **`verification-before-completion`** — Final pre-merge verification. Run `bun check` and `bun lint --fix` one last time on the base worktree before squashing.

## Workspace Discovery

The user invokes this as `/workflow-complete {slug}`.

1. If `$ARGUMENTS` is empty, scan `.workflow/*/` directories and list available workspaces — ask which one
2. Scan `.workflow/*/` for a folder matching the slug `$ARGUMENTS`
3. Read `STATUS.yaml` — phase must be `review-complete`. If not, tell the user which phase to complete first.
4. Update STATUS.yaml: `phase: completing`, `updated: {ISO timestamp}`

## Process

### 1. Read workspace state

Read `STATUS.yaml` for:
- `branch` — the base branch name (`work/{type}/{slug}`)
- `base_worktree` — the base worktree path
- `type` — for commit message prefix

Read `DESIGN.md` for the overview (used in commit message).

### 2. Squash commits

In the base worktree (which has all task branches merged in), squash all commits since branching from main:

```bash
# Count commits to squash
git -C {BASE_WORKTREE} log main..HEAD --oneline

# Soft reset to branch point
git -C {BASE_WORKTREE} reset --soft main

# Create single clean commit (NO co-author)
git -C {BASE_WORKTREE} commit -m "$(cat <<'EOF'
{type}({scope}): {descriptive message}

{Summary from DESIGN.md overview}

Implemented:
- {Key change 1}
- {Key change 2}
- {Key change 3}
EOF
)"
```

### 3. Merge to main

```bash
# Switch to main in the project root
git checkout main

# Merge the squashed branch
git merge work/{type}/{slug}
```

**IMPORTANT:** Ask the user before merging. Present the squashed commit and ask:
**"Here's the squashed commit. Merge to main?"**

### 4. Clean up worktrees and branches

```bash
# Remove base worktree
git worktree remove {BASE_WORKTREE}

# Delete base branch
git branch -d work/{type}/{slug}

# Remove any leftover task worktrees (shouldn't exist, but just in case)
# Check for any remaining worktrees in the workflow directory
git worktree list | grep '.workflow/{type}/{slug}/worktrees' || true

# Clean up the worktrees directory
rm -rf {WORKSPACE}/worktrees
```

### 5. Mark complete

Update STATUS.yaml:
- `phase: complete`
- `completed: {ISO timestamp}`
- Remove `base_worktree` key (no longer valid)

### 6. Summary

Present final summary:
```markdown
## Workspace Complete: {slug}

- **Commit**: {hash} — {message}
- **Branch**: merged to main, worktrees removed
- **Workspace**: `.workflow/{type}/{slug}/` preserved for reference
```

## Rules

- **Ask before merging** — always confirm with the user
- **No co-author on squash** — the final commit is clean
- **Preserve .workflow/ directory** — don't delete it, useful for reference (only worktrees/ subdir is removed)
- **Conventional commit** — squashed message follows project conventions
- **Use `-C` for git commands** — never use `cd`
