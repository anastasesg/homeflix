---
name: workflow-implement
description: Execute all planned tasks — creates a git worktree, spawns implementer and reviewer agents in dependency order, aggregates results.
---

# Workflow: Implementation Phase

Orchestrate the execution of all planned tasks. **You are the orchestrator — you NEVER write implementation code yourself.** You dispatch agents and manage their results.

## Workspace Discovery

The user invokes this as `/workflow-implement {slug}`.

1. If `$ARGUMENTS` is empty, scan `.working/*/` directories and list available workspaces — ask which one
2. Scan `.working/*/` for a folder matching the slug `$ARGUMENTS`
3. Read `STATUS.yaml` — check `phase`:
   - If `plan-complete` → fresh start, proceed to step 4
   - If `implementation` → **resume mode** (see Resumability section below)
   - Otherwise → tell the user which phase to complete first
4. Verify `.working/{type}/{slug}/plan/PLAN.md` and `plan/task/TASK_*.md` files exist
5. Update STATUS.yaml: `phase: implementation`, `updated: {ISO timestamp}`

## CRITICAL: Agent Dispatch Rules

These rules are non-negotiable:

1. **Use `subagent_type: "task-implementer"`** for implementation agents — this is a registered agent type
2. **Use `subagent_type: "task-reviewer"`** for review agents — this is a registered agent type
3. **Never implement code yourself** — if an agent fails, spawn another agent with fix instructions
4. **All git commands use `-C <absolute_worktree_path>`** — NEVER use `cd` in Bash calls, as shell state resets between calls
5. **Agent prompts must be fully self-contained** — include all file paths, worktree path, project root as absolute paths. The agent has NO access to this conversation's context.
6. **Spawn independent tasks in parallel** — use multiple Task tool calls in a single message

### Git Command Pattern

ALWAYS use this pattern for git commands — never `cd`:

```bash
# CORRECT — uses -C flag with absolute path
git -C /absolute/path/to/.worktrees/type/slug status
git -C /absolute/path/to/.worktrees/type/slug diff
git -C /absolute/path/to/.worktrees/type/slug commit -m "message"

# WRONG — cd state doesn't persist between Bash calls
cd .worktrees/type/slug && git status
```

## CRITICAL: Staging & Commit Strategy

Parallel agents writing to the same worktree creates a staging conflict: if agents A and B both `git add`, committing A's work also commits B's staged files.

**Solution: Agents NEVER stage or commit. The orchestrator handles all git operations sequentially.**

1. Agents **write files only** — no `git add`, no `git commit`
2. Agents **list all changed files** in their report (`files_changed` frontmatter)
3. The orchestrator, after review approval, **stages and commits per-task atomically**:
   ```bash
   # Stage only this task's files
   git -C {WORKTREE_PATH} add path/to/file1.ts path/to/file2.ts
   # Commit only what was just staged
   git -C {WORKTREE_PATH} commit -m "message"
   ```
4. **Review and commit happen SEQUENTIALLY** — even if tasks in a batch were implemented in parallel, the review→stage→commit cycle runs one task at a time

This means the staging area is always clean between tasks.

## Resumability

STATUS.yaml tracks per-task progress so the orchestrator can resume after interruption.

### STATUS.yaml task tracking format

After creating the worktree, add a `tasks` map to STATUS.yaml:

```yaml
phase: implementation
branch: work/{type}/{slug}
worktree: /absolute/path/.worktrees/{type}/{slug}
updated: 2026-02-09T12:00:00Z
current_batch: 1
tasks:
  1: { status: completed, commit: abc1234 }
  2: { status: completed, commit: def5678 }
  3: { status: implementing }
  4: { status: pending }
  5: { status: pending }
```

**Status transitions per task:**
- `pending` → task hasn't started
- `implementing` → agent dispatched (set BEFORE spawning the agent)
- `implemented` → agent finished, report written
- `reviewing` → reviewer dispatched
- `approved` → review passed, ready to commit
- `needs_fixes` → review failed, needs re-implementation
- `completed` → committed with hash

**Update STATUS.yaml at every transition** — this is what enables resume.

### Resume protocol

When `phase: implementation` is detected in step 3:

1. Read STATUS.yaml to get `worktree`, `branch`, `current_batch`, and `tasks` state
2. Verify the worktree still exists: `git -C {WORKTREE_PATH} status`
3. For each task, determine what to do based on its status:
   - `completed` → skip (already committed)
   - `approved` → stage + commit (review passed but commit was missed)
   - `needs_fixes` → re-spawn implementer with review feedback
   - `reviewing` → read report, re-spawn reviewer (reviewer may have been interrupted)
   - `implemented` → read report, spawn reviewer
   - `implementing` → check if report exists:
     - Yes → treat as `implemented`
     - No → re-spawn implementer (agent was interrupted)
   - `pending` → proceed normally when batch is ready
4. Continue from `current_batch`

## Process

### 1. Read the plan

Read `plan/PLAN.md` — the **YAML frontmatter** contains the structured plan data:
- `tasks` — array of `{id, title, depends_on, blocks, batch, skills}` objects
- `batches` — array of `{batch, tasks}` for execution ordering

The markdown body has the summary, file impact, and risk areas for context.

### 2. Create worktree

Resolve the absolute project root first:

```bash
# Get absolute project root
pwd
```

Then create the worktree using absolute paths:

```bash
# Create branch from HEAD
git branch work/{type}/{slug} HEAD

# Create worktree directory
mkdir -p {PROJECT_ROOT}/.worktrees/{type}

# Create worktree
git worktree add {PROJECT_ROOT}/.worktrees/{type}/{slug} work/{type}/{slug}

# Copy environment variables
cp {PROJECT_ROOT}/.env.local {PROJECT_ROOT}/.worktrees/{type}/{slug}/.env.local
```

Store these absolute paths — you'll use them for ALL subsequent operations:
- `WORKTREE_PATH` = `{PROJECT_ROOT}/.worktrees/{type}/{slug}` (absolute)
- `PROJECT_ROOT` = absolute path to main project

Update STATUS.yaml with worktree info AND initialize the tasks map:

```yaml
phase: implementation
branch: work/{type}/{slug}
worktree: {WORKTREE_PATH}
updated: {ISO timestamp}
current_batch: 1
tasks:
  1: { status: pending }
  2: { status: pending }
  # ... one entry per task from the plan
```

### 3. Create impl directory structure

```bash
mkdir -p {PROJECT_ROOT}/.working/{type}/{slug}/impl/task
```

### 4. Execute batches

For each batch in the plan:

**Update STATUS.yaml**: set `current_batch: {N}`

#### a. Identify ready tasks

Use the **PLAN.md frontmatter** `batches` array to determine execution order. For each batch, check STATUS.yaml `tasks` map:
- Skip tasks with `status: completed`
- Task is ready if all `depends_on` task IDs have `status: completed` in STATUS.yaml

#### b. Read each task spec yourself

Before dispatching, **read each task spec file** so you can build a complete agent prompt. Extract:
- `skills` list from frontmatter
- `files_create` / `files_modify` / `files_reference` from frontmatter
- `acceptance` criteria from frontmatter
- The full markdown body (context, objective, implementation notes)

#### c. Spawn task-implementer agents (parallel)

**Before spawning**: Update STATUS.yaml — set each task to `implementing`

For each ready task, spawn using the Task tool with these exact parameters:

```
Task(
  subagent_type: "task-implementer",
  description: "Implement task {N}: {title}",
  prompt: <see template below>
)
```

**Agent prompt template** — fill in ALL values before dispatching:

```
## Task

Implement task {N}: {title}

## Paths (all absolute)

- Project root: {PROJECT_ROOT}
- Worktree: {WORKTREE_PATH}
- Task spec: {PROJECT_ROOT}/.working/{type}/{slug}/plan/task/TASK_{N}.md
- Report output: {PROJECT_ROOT}/.working/{type}/{slug}/impl/task/TASK_{N}.md

## Skills to read first

Read these skill files from {PROJECT_ROOT}/.claude/skills/ before writing any code:
{for each skill in task.skills: "- {PROJECT_ROOT}/.claude/skills/{skill}/SKILL.md"}

Always read code-style: {PROJECT_ROOT}/.claude/skills/code-style/SKILL.md

## Task Spec Content

{paste the FULL content of the task spec file here}

## Instructions

1. Read the skill files listed above
2. Read all reference files listed in the task spec
3. Implement the code in the WORKTREE directory ({WORKTREE_PATH})
4. Run verification: `bun --cwd {WORKTREE_PATH} check` and `bun --cwd {WORKTREE_PATH} lint --fix`
5. Write report to: {PROJECT_ROOT}/.working/{type}/{slug}/impl/task/TASK_{N}.md

IMPORTANT:
- Do NOT run `git add` — the orchestrator handles staging
- Do NOT run `git commit` — the orchestrator handles commits
- Just write the code files and the report
```

**Spawn ALL independent tasks in a single message** — multiple Task tool calls at once.

#### d. Collect results

After each agent completes:
- Read the task report from `impl/task/TASK_{N}.md`
- Check the **frontmatter `status`** field — should be `COMPLETED`
- **Update STATUS.yaml**: set task to `implemented`

#### e. Stage, review, and commit (SEQUENTIAL per task)

For each implemented task in the batch, **process one at a time**:

**Step 1 — Stage the task's files:**
```bash
git -C {WORKTREE_PATH} add {space-separated list of files from report's files_changed}
```

**Step 2 — Update STATUS.yaml**: set task to `reviewing`

**Step 3 — Spawn reviewer:**

```
Task(
  subagent_type: "task-reviewer",
  description: "Review task {N}: {title}",
  prompt: <see template below>
)
```

**Reviewer prompt template:**

```
## Review Task {N}: {title}

## Paths (all absolute)

- Project root: {PROJECT_ROOT}
- Worktree: {WORKTREE_PATH}
- Task spec: {PROJECT_ROOT}/.working/{type}/{slug}/plan/task/TASK_{N}.md
- Task report: {PROJECT_ROOT}/.working/{type}/{slug}/impl/task/TASK_{N}.md

## Files to review

{list of files from the implementation report's files_changed}

## Instructions

1. Read the task spec and task report
2. Read applicable skill files from {PROJECT_ROOT}/.claude/skills/
3. Run verification: `bun --cwd {WORKTREE_PATH} check` and `bun --cwd {WORKTREE_PATH} lint --fix`
4. Review staged diff: `git -C {WORKTREE_PATH} diff --cached`
5. Update the task report file with review results in the YAML frontmatter

IMPORTANT: Do NOT run git add or git commit. Only review what's staged.
```

**Step 4 — Handle verdict:**

Read the task report's `review.verdict`:

If `NEEDS_FIXES`:
- **Update STATUS.yaml**: set task to `needs_fixes`
- **Unstage the files**: `git -C {WORKTREE_PATH} reset HEAD -- {files}`
- Spawn a NEW task-implementer agent with the original task spec AND review feedback
- After the fix agent completes, restart from Step 1 for this task

If `APPROVED`:
- **Commit** (files are already staged from Step 1):
  ```bash
  git -C {WORKTREE_PATH} commit -m "$(cat <<'EOF'
  {suggested_commit_message from task report frontmatter}

  Co-Authored-By: Claude <noreply@anthropic.com>
  EOF
  )"
  ```
- **Verify** the commit landed correctly:
  ```bash
  git -C {WORKTREE_PATH} log --oneline -1
  git -C {WORKTREE_PATH} branch --show-current
  ```
- **Update STATUS.yaml**: set task to `completed` with `commit: {hash}`
- **Update the task report frontmatter**: set `commit: {hash}`
- Proceed to the next task in this batch

### 5. Final verification

After all tasks complete, run full verification on the worktree:

```bash
bun --cwd {WORKTREE_PATH} check
bun --cwd {WORKTREE_PATH} lint --fix
```

### 6. Aggregate results

Create `.working/{type}/{slug}/impl/IMPLEMENTATION.md` with frontmatter:

````markdown
---
slug: "{slug}"
total_tasks: {N}
completed: {N}
failed: {N}
all_approved: true | false
branch: "work/{type}/{slug}"
worktree: "{WORKTREE_PATH}"
verification:
  typescript: ALL PASS | FAILURES
  lint: ALL PASS | FAILURES
tasks:
  - id: 1
    title: "..."
    status: COMPLETED
    commit: "abc123"
    review: APPROVED
  - id: 2
    title: "..."
    status: COMPLETED
    commit: "def456"
    review: APPROVED
---

## Files Changed
- `path/to/file.ts` — Created (Task 1)
- `path/to/other.ts` — Modified (Tasks 2, 4)

## Issues Found and Fixed
- {count and details, if any}

## Outstanding Issues
- {list if any, otherwise "None"}
````

### 7. Present to user

Show the IMPLEMENTATION.md summary and ask:
**"Implementation complete. {N} tasks finished, all reviews passed. Ready to review with `/workflow-review {slug}`?"**

Update STATUS.yaml: `phase: implementation-complete`

## Rules

- **NEVER implement code yourself** — you are the orchestrator, not the implementer
- **NEVER let agents stage or commit** — the orchestrator owns all git state
- **Respect dependencies** — never spawn a task before its dependencies complete
- **Parallel implementation, sequential commits** — spawn implementers in parallel, but stage→review→commit one task at a time
- **All git commands use `-C {WORKTREE_PATH}`** — NEVER use `cd` for git operations
- **All bun commands use `--cwd {WORKTREE_PATH}`** — never assume working directory
- **Agent prompts are self-contained** — paste task spec content into the prompt, include absolute paths for everything
- **Update STATUS.yaml at every transition** — this is what makes resume work
- **Verify branch after every commit** — confirm commits land on the worktree branch, not main
