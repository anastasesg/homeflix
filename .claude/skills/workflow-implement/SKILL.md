---
name: workflow-implement
description: Execute all planned tasks — creates per-task git worktrees, spawns implementer and reviewer agents in dependency order, aggregates results.
---

# Workflow: Implementation Phase

Orchestrate the execution of all planned tasks. **You are the orchestrator — you NEVER write code, stage files, or commit.** You dispatch agents and read their reports.

## Your Role

For each task: create worktree → spawn implementer → spawn reviewer → spawn committer → update STATUS.yaml. That's it. **No code, no git add, no git commit, no fixing.**

## Workspace Discovery

The user invokes this as `/workflow-implement {slug}`.

1. If `$ARGUMENTS` is empty, scan `.workflow/*/` directories and list available workspaces
2. Scan `.workflow/*/` for a folder matching the slug `$ARGUMENTS`
3. Read `STATUS.yaml`:
   - `plan-complete` → fresh start, proceed to step 4
   - `implementation` → **resume mode** (see Resumability below)
   - Otherwise → tell the user which phase to complete first
4. Verify plan files exist
5. Update STATUS.yaml: `phase: implementation`

## Critical Rules

1. **`subagent_type: "task-implementer"`** / **`"task-reviewer"`** / **`"task-committer"`** — always use these registered agent types
2. **Never write code, stage, or commit** — if an agent fails, spawn another agent
3. **`git -C {absolute_path}`** for all git commands — never `cd`
4. **`bun --cwd {absolute_path}`** for all bun commands
5. **Agent prompts are self-contained** — paste task spec content inline, all paths absolute. Agents have NO access to this conversation.
6. **Spawn independent tasks in parallel** — multiple Task tool calls in one message
7. **Max 3 retries per task** on NEEDS_FIXES — then stop and ask the user

## Agent Prompt Templates

Before constructing agent prompts, read `{PROJECT_ROOT}/.claude/skills/workflow-implement/TEMPLATES.md` for the exact templates. Fill in all `{PLACEHOLDER}` values before dispatching.

## STATUS.yaml Tracking

Track per-task state for resumability:

```yaml
phase: implementation
branch: work/{type}/{slug}/base
base_worktree: /absolute/path/.workflow/{type}/{slug}/worktrees/base
updated: 2026-02-09T12:00:00Z
current_batch: 1
tasks:
  1: { status: completed, commit: abc1234 }
  2: { status: implementing, worktree: /abs/path/..., retries: 0 }
  3: { status: pending }
```

**Status transitions**: `pending` → `implementing` → `implemented` → `reviewing` → `approved`|`needs_fixes` → `committing` → `completed`

**Update STATUS.yaml at every transition** — this enables resume.

## Process

### 1. Read the plan

Read `plan/PLAN.md` frontmatter for `tasks` (array of `{id, title, depends_on, blocks, batch, skills}`) and `batches` (execution order).

### 2. Create base worktree

```bash
git branch work/{type}/{slug}/base HEAD
mkdir -p {PROJECT_ROOT}/.workflow/{type}/{slug}/worktrees
git worktree add {PROJECT_ROOT}/.workflow/{type}/{slug}/worktrees/base work/{type}/{slug}/base
cp {PROJECT_ROOT}/.env.local {PROJECT_ROOT}/.workflow/{type}/{slug}/worktrees/base/.env.local
```

Store absolute paths: `BASE_WORKTREE`, `WORKSPACE`, `PROJECT_ROOT`.
Initialize STATUS.yaml with all tasks as `pending` and `retries: 0`.

### 3. Create impl directory

```bash
mkdir -p {WORKSPACE}/impl/task
```

### 4. Execute batches

For each batch (update `current_batch` in STATUS.yaml):

**a. Create per-task worktrees** for all ready tasks in this batch:
```bash
git -C {BASE_WORKTREE} branch work/{type}/{slug}/task-{N}
git worktree add {WORKSPACE}/worktrees/task-{N} work/{type}/{slug}/task-{N}
cp {PROJECT_ROOT}/.env.local {WORKSPACE}/worktrees/task-{N}/.env.local
```

**b. Spawn implementers** — read each task spec, build prompt from TEMPLATES.md, set status to `implementing`. Spawn parallel tasks in a single message.

**c. Read reports** — check `status: COMPLETED` in frontmatter. Update STATUS.yaml to `implemented`, then `reviewing`.

**d. Spawn reviewers** — build prompt from TEMPLATES.md. Spawn parallel reviewers for independent tasks.

**e. Handle review verdict:**
- `APPROVED` → set status to `approved`, proceed to commit
- `NEEDS_FIXES` → increment `retries` in STATUS.yaml:
  - **retries < 3** → spawn new implementer with original task spec + review feedback, re-review
  - **retries >= 3** → **STOP**. Present the review issues to the user and ask how to proceed. Do NOT retry automatically.

**f. Spawn committer** — set status to `committing`. Build prompt from TEMPLATES.md.

**g. Post-merge verification** — after each committer completes, run on the BASE worktree:
```bash
bun --cwd {BASE_WORKTREE} check
```
If this fails, the merge introduced cross-task type errors. **Stop the batch and report to the user** with the error output. Do not continue until resolved.

**h. Update STATUS.yaml** — set task to `completed` with `commit: {hash}`, remove `worktree` key.

### 5. Final verification

```bash
bun --cwd {BASE_WORKTREE} check
bun --cwd {BASE_WORKTREE} lint --fix
```

### 6. Aggregate results

Create `impl/IMPLEMENTATION.md` with YAML frontmatter:
- `slug`, `total_tasks`, `completed`, `failed`, `all_approved`
- `branch`, `base_worktree`
- `verification: { typescript, lint }`
- `tasks:` array of `{ id, title, status, commit, review }`

Markdown body: Files Changed, Issues Found and Fixed, Outstanding Issues.

### 7. Present to user

Show summary. Ask: **"Implementation complete. Ready to review with `/workflow-review {slug}`?"**

Update STATUS.yaml: `phase: implementation-complete`

## Resumability

When STATUS.yaml has `phase: implementation`:

1. Read `base_worktree`, `branch`, `current_batch`, `tasks`
2. Verify base worktree: `git -C {BASE_WORKTREE} status`
3. For each task by status:
   - `completed` → skip
   - `committing` → check report for `commit` field; if present + worktree gone → completed; otherwise re-spawn committer
   - `approved` → spawn committer
   - `needs_fixes` → check `retries` count; re-spawn implementer if < 3, else ask user
   - `reviewing` → re-spawn reviewer
   - `implemented` → spawn reviewer
   - `implementing` → check if report exists (yes → `implemented`; no → check worktree exists, recreate if needed, re-spawn implementer)
   - `pending` → proceed when batch is ready
4. Continue from `current_batch`

## Rules

- **Never write code, stage, or commit** — dispatch agents only
- **Respect dependencies** — never spawn before dependencies complete
- **Parallel implement, sequential commit** — spawn implementers in parallel (each in its own worktree), commit one at a time
- **Max 3 retries per task** — then escalate to user
- **Verify base after each merge** — catch cross-task type errors early
- **All paths absolute** — `-C` for git, `--cwd` for bun
- **Agent prompts are self-contained** — include everything, assume no context
