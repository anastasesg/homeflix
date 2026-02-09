---
name: workflow-complete
description: Finalize the workflow — squash commits into one clean commit, remove the worktree, and close the workspace.
---

# Workflow: Complete Phase

Finalize the work — squash, clean up, and close the workspace.

## Skills Integration

### Superpowers
- **`finishing-a-development-branch`** — Invoke this before squashing/merging. It guides the decision on how to integrate the work (squash merge, rebase, etc.) and ensures nothing is left behind.
- **`verification-before-completion`** — Final pre-merge verification. Run `bun check` and `bun lint --fix` one last time on the worktree before squashing.

## Workspace Discovery

The user invokes this as `/workflow-complete {slug}`.

1. If `$ARGUMENTS` is empty, scan `.working/*/` directories and list available workspaces — ask which one
2. Scan `.working/*/` for a folder matching the slug `$ARGUMENTS`
3. Read `STATUS.yaml` — phase must be `review-complete`. If not, tell the user which phase to complete first.
4. Update STATUS.yaml: `phase: completing`, `updated: {ISO timestamp}`

## Process

### 1. Read workspace state

Read `STATUS.yaml` for:
- `branch` — the worktree branch name
- `worktree` — the worktree path
- `type` — for commit message prefix

Read `DESIGN.md` for the overview (used in commit message).

### 2. Squash commits

In the worktree, squash all commits since branching from main:

```bash
cd {worktree_path}

# Count commits to squash
git log main..HEAD --oneline

# Soft reset to branch point
git reset --soft main

# Create single clean commit (NO co-author)
git commit -m "$(cat <<'EOF'
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
# Switch to main
git checkout main

# Merge the squashed branch
git merge work/{type}/{slug}
```

**IMPORTANT:** Ask the user before merging. Present the squashed commit and ask:
**"Here's the squashed commit. Merge to main?"**

### 4. Clean up worktree

```bash
# Remove worktree
git worktree remove {worktree_path}

# Delete branch
git branch -d work/{type}/{slug}

# Clean up empty parent directory if it exists
rmdir .worktrees/{type} 2>/dev/null || true
```

### 5. Mark complete

Update STATUS.yaml:
- `phase: complete`
- `completed: {ISO timestamp}`

### 6. Summary

Present final summary:
```markdown
## Workspace Complete: {slug}

- **Commit**: {hash} — {message}
- **Branch**: merged to main, worktree removed
- **Workspace**: `.working/{type}/{slug}/` preserved for reference
```

## Rules

- **Ask before merging** — always confirm with the user
- **No co-author on squash** — the final commit is clean
- **Preserve .working/ directory** — don't delete it, useful for reference
- **Conventional commit** — squashed message follows project conventions
