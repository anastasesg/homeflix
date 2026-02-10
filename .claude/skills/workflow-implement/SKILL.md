---
name: workflow-implement
description: Execute all planned tasks — creates per-task git worktrees, spawns implementer and reviewer agents in dependency order, aggregates results.
---

# Workflow: Implementation Phase

Orchestrate the execution of all planned tasks. **You are the orchestrator — you NEVER write implementation code yourself, NEVER stage files, NEVER commit.** You dispatch agents and read their reports.

## Your Role

You are a **dispatcher and router**. For each task you:
1. Create a per-task worktree
2. Spawn the implementer agent → read its report
3. Spawn the reviewer agent → read its verdict
4. If approved, spawn the committer agent → read the commit hash
5. Merge the task branch into base, remove task worktree
6. Update STATUS.yaml

That's it. No code, no git mutations (except merge/cleanup), no fixing — just dispatch and route.

## Workspace Discovery

The user invokes this as `/workflow-implement {slug}`.

1. If `$ARGUMENTS` is empty, scan `.workflow/*/` directories and list available workspaces — ask which one
2. Scan `.workflow/*/` for a folder matching the slug `$ARGUMENTS`
3. Read `STATUS.yaml` — check `phase`:
   - If `plan-complete` → fresh start, proceed to step 4
   - If `implementation` → **resume mode** (see Resumability section below)
   - Otherwise → tell the user which phase to complete first
4. Verify `.workflow/{type}/{slug}/plan/PLAN.md` and `plan/task/TASK_*.md` files exist
5. Update STATUS.yaml: `phase: implementation`, `updated: {ISO timestamp}`

## CRITICAL: Agent Dispatch Rules

These rules are non-negotiable:

1. **Use `subagent_type: "task-implementer"`** for implementation agents
2. **Use `subagent_type: "task-reviewer"`** for review agents
3. **Use `subagent_type: "task-committer"`** for commit agents
4. **Never implement code yourself** — if an agent fails, spawn another agent with fix instructions
5. **Never stage or commit yourself** — always delegate to the committer agent
6. **All git commands use `-C <absolute_path>`** — NEVER use `cd` in Bash calls
7. **Agent prompts must be fully self-contained** — include all file paths, worktree path, project root as absolute paths. The agent has NO access to this conversation's context.
8. **Spawn independent tasks in parallel** — use multiple Task tool calls in a single message

### Git Command Pattern

ALWAYS use this pattern for git commands — never `cd`:

```bash
# CORRECT — uses -C flag with absolute path
git -C /absolute/path/to/worktree status

# WRONG — cd state doesn't persist between Bash calls
cd .workflow/type/slug/worktrees/base && git status
```

## CRITICAL: Agent Pipeline per Task

Each task follows this pipeline: **create worktree → implement → review → commit + merge + cleanup**

1. **Orchestrator** creates a per-task worktree (branched from base)
2. **Implementer** writes files + report in the task worktree (no git operations)
3. **Reviewer** reviews working tree diff in the task worktree (no git operations)
4. **Committer** stages + commits in the task worktree, merges into base, removes the task worktree + branch

This gives each agent a pristine, isolated workspace — no interference between parallel tasks.

## Worktree Structure

```
.workflow/{type}/{slug}/
├── STATUS.yaml
├── plan/
│   ├── PLAN.md
│   └── task/TASK_{N}.md
├── impl/
│   ├── IMPLEMENTATION.md
│   └── task/TASK_{N}.md
└── worktrees/
    ├── base/            ← git worktree on branch work/{type}/{slug}
    └── task-{N}/        ← per-task worktree (temporary, removed after commit)
```

### Git branches

- `work/{type}/{slug}` — base branch (stays for the whole workflow)
- `work/{type}/{slug}/task-{N}` — per-task branches (created before implementation, merged + deleted after commit)

## Resumability

STATUS.yaml tracks per-task progress so the orchestrator can resume after interruption.

### STATUS.yaml task tracking format

After creating the base worktree, add a `tasks` map to STATUS.yaml:

```yaml
phase: implementation
branch: work/{type}/{slug}
base_worktree: /absolute/path/.workflow/{type}/{slug}/worktrees/base
updated: 2026-02-09T12:00:00Z
current_batch: 1
tasks:
  1: { status: completed, commit: abc1234 }
  2: { status: completed, commit: def5678 }
  3: { status: implementing, worktree: /absolute/path/.workflow/{type}/{slug}/worktrees/task-3 }
  4: { status: pending }
  5: { status: pending }
```

**Status transitions per task:**
- `pending` → task hasn't started
- `implementing` → worktree created, implementer dispatched (set BEFORE spawning)
- `implemented` → implementer finished, report written
- `reviewing` → reviewer dispatched
- `approved` → review passed, ready to commit
- `committing` → committer dispatched
- `needs_fixes` → review failed, needs re-implementation
- `completed` → committed, merged into base, task worktree removed

**Update STATUS.yaml at every transition** — this is what enables resume.

### Resume protocol

When `phase: implementation` is detected in step 3:

1. Read STATUS.yaml to get `base_worktree`, `branch`, `current_batch`, and `tasks` state
2. Verify the base worktree still exists: `git -C {BASE_WORKTREE} status`
3. For each task, determine what to do based on its status:
   - `completed` → skip (already merged)
   - `committing` → check if report has `commit` field:
     - Yes with worktree gone → treat as `completed` (merge happened)
     - Yes with worktree present → merge into base + cleanup
     - No → re-spawn committer
   - `approved` → spawn committer
   - `needs_fixes` → re-spawn implementer with review feedback (check if task worktree exists, recreate if needed)
   - `reviewing` → read report, re-spawn reviewer (task worktree should exist)
   - `implemented` → read report, spawn reviewer (task worktree should exist)
   - `implementing` → check if report exists:
     - Yes → treat as `implemented`
     - No → check if task worktree exists:
       - Yes → re-spawn implementer
       - No → recreate task worktree, re-spawn implementer
   - `pending` → proceed normally when batch is ready
4. Continue from `current_batch`

## Process

### 1. Read the plan

Read `plan/PLAN.md` — the **YAML frontmatter** contains the structured plan data:
- `tasks` — array of `{id, title, depends_on, blocks, batch, skills}` objects
- `batches` — array of `{batch, tasks}` for execution ordering

The markdown body has the summary, file impact, and risk areas for context.

### 2. Create base worktree

Resolve the absolute project root first:

```bash
# Get absolute project root
pwd
```

Then create the base worktree using absolute paths:

```bash
# Create base branch from HEAD
git branch work/{type}/{slug} HEAD

# Create worktree directory structure
mkdir -p {PROJECT_ROOT}/.workflow/{type}/{slug}/worktrees

# Create base worktree
git worktree add {PROJECT_ROOT}/.workflow/{type}/{slug}/worktrees/base work/{type}/{slug}

# Copy environment variables to base
cp {PROJECT_ROOT}/.env.local {PROJECT_ROOT}/.workflow/{type}/{slug}/worktrees/base/.env.local
```

Store these absolute paths — you'll use them for ALL subsequent operations:
- `BASE_WORKTREE` = `{PROJECT_ROOT}/.workflow/{type}/{slug}/worktrees/base` (absolute)
- `WORKSPACE` = `{PROJECT_ROOT}/.workflow/{type}/{slug}` (absolute)
- `PROJECT_ROOT` = absolute path to main project

Update STATUS.yaml with worktree info AND initialize the tasks map:

```yaml
phase: implementation
branch: work/{type}/{slug}
base_worktree: {BASE_WORKTREE}
updated: {ISO timestamp}
current_batch: 1
tasks:
  1: { status: pending }
  2: { status: pending }
  # ... one entry per task from the plan
```

### 3. Create impl directory structure

```bash
mkdir -p {WORKSPACE}/impl/task
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

#### c. Create per-task worktrees and spawn implementers (parallel for independent tasks)

**Before spawning**: For each ready task:

1. Create the task branch from the base branch:
```bash
git -C {BASE_WORKTREE} branch work/{type}/{slug}/task-{N}
```

2. Create the task worktree:
```bash
git worktree add {WORKSPACE}/worktrees/task-{N} work/{type}/{slug}/task-{N}
```

3. Copy environment variables:
```bash
cp {PROJECT_ROOT}/.env.local {WORKSPACE}/worktrees/task-{N}/.env.local
```

4. Update STATUS.yaml — set task to `implementing` with `worktree: {WORKSPACE}/worktrees/task-{N}`

Then spawn the implementer:

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
- Worktree: {WORKSPACE}/worktrees/task-{N}
- Task spec: {WORKSPACE}/plan/task/TASK_{N}.md
- Report output: {WORKSPACE}/impl/task/TASK_{N}.md

## Skills to read first

Read these skill files from {PROJECT_ROOT}/.claude/skills/ before writing any code:
{for each skill in task.skills: "- {PROJECT_ROOT}/.claude/skills/{skill}/SKILL.md"}

Always read code-style: {PROJECT_ROOT}/.claude/skills/code-style/SKILL.md

## Task Spec Content

{paste the FULL content of the task spec file here}

## Instructions

1. Read the skill files listed above
2. Read all reference files listed in the task spec
3. Implement the code in the WORKTREE directory ({WORKSPACE}/worktrees/task-{N})
4. Run verification: `bun --cwd {WORKSPACE}/worktrees/task-{N} check` and `bun --cwd {WORKSPACE}/worktrees/task-{N} lint --fix`
5. Write report to: {WORKSPACE}/impl/task/TASK_{N}.md

IMPORTANT:
- Do NOT run `git add` — the committer agent handles staging
- Do NOT run `git commit` — the committer agent handles commits
- Just write the code files and the report
```

**Spawn ALL independent tasks in a single message** — multiple Task tool calls at once.

#### d. Collect results and dispatch reviewers

After each implementer completes:
1. Read the task report from `impl/task/TASK_{N}.md`
2. Check the **frontmatter `status`** field — should be `COMPLETED`
3. **Update STATUS.yaml**: set task to `implemented`
4. **Immediately spawn the reviewer** — do NOT stage files first

**Update STATUS.yaml**: set task to `reviewing`

Spawn the reviewer:

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
- Worktree: {WORKSPACE}/worktrees/task-{N}
- Task spec: {WORKSPACE}/plan/task/TASK_{N}.md
- Task report: {WORKSPACE}/impl/task/TASK_{N}.md

## Files to review

{list of files from the implementation report's files_changed}

## Instructions

1. Read the task spec and task report
2. Read applicable skill files from {PROJECT_ROOT}/.claude/skills/
3. Run verification: `bun --cwd {WORKSPACE}/worktrees/task-{N} check` and `bun --cwd {WORKSPACE}/worktrees/task-{N} lint --fix`
4. Review working tree diff: `git -C {WORKSPACE}/worktrees/task-{N} diff -- {space-separated file list}`
5. Update the task report file with review results in the YAML frontmatter

IMPORTANT: Do NOT run git add or git commit. Only review and write the report.
```

#### e. Handle review verdict

Read the task report's `review.verdict`:

**If `NEEDS_FIXES`:**
- **Update STATUS.yaml**: set task to `needs_fixes`
- Spawn a NEW task-implementer agent with the original task spec AND review feedback
- After the fix agent completes, go back to step d for this task

**If `APPROVED`:**
- **Update STATUS.yaml**: set task to `approved`
- Proceed to commit

#### f. Commit (delegate to committer agent)

**Update STATUS.yaml**: set task to `committing`

Spawn the committer:

```
Task(
  subagent_type: "task-committer",
  description: "Commit task {N}: {title}",
  prompt: <see template below>
)
```

**Committer prompt template:**

```
## Commit Task {N}: {title}

## Paths (all absolute)

- Task worktree: {WORKSPACE}/worktrees/task-{N}
- Base worktree: {BASE_WORKTREE}
- Task report: {WORKSPACE}/impl/task/TASK_{N}.md
- Task branch: work/{type}/{slug}/task-{N}

## Instructions

1. Read the task report for file list and commit message
2. Stage the listed files
3. Commit with the suggested message
4. Verify the commit
5. Update the task report with the commit hash
6. Merge the task branch into the base worktree
7. Remove the task worktree and delete the task branch
```

After the committer completes:
- Read the task report — extract the `commit` hash from frontmatter
- **Update STATUS.yaml**: set task to `completed` with `commit: {hash}`, remove `worktree` key

### 5. Final verification

After all tasks complete, run full verification on the **base worktree** (which now has all merged changes):

```bash
bun --cwd {BASE_WORKTREE} check
bun --cwd {BASE_WORKTREE} lint --fix
```

### 6. Aggregate results

Create `.workflow/{type}/{slug}/impl/IMPLEMENTATION.md` with frontmatter:

````markdown
---
slug: "{slug}"
total_tasks: {N}
completed: {N}
failed: {N}
all_approved: true | false
branch: "work/{type}/{slug}"
base_worktree: "{BASE_WORKTREE}"
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
- **NEVER stage, commit, or merge yourself** — the committer agent owns all git mutations (commit, merge, worktree cleanup)
- **NEVER fix code yourself** — if a review finds issues, spawn a new implementer with the feedback
- **Respect dependencies** — never spawn a task before its dependencies complete
- **Parallel implementation, sequential commits** — spawn implementers in parallel (each in its own worktree), but review→commit+merge one task at a time
- **All git commands use `-C {absolute_path}`** — NEVER use `cd` for git operations
- **All bun commands use `--cwd {absolute_path}`** — never assume working directory
- **Agent prompts are self-contained** — paste task spec content into the prompt, include absolute paths for everything
- **Update STATUS.yaml at every transition** — this is what makes resume work
- **Committer handles cleanup** — the committer merges into base, removes the task worktree, and deletes the task branch
