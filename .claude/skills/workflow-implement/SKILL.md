---
name: workflow-implement
description: Use when /implement command is invoked. Orchestrates task execution — creates git worktree, reads the plan, spawns task-implementer and task-reviewer agents respecting dependency order, and aggregates results into IMPLEMENTATION.md.
---

# Workflow: Implementation Phase

Orchestrate the execution of all planned tasks.

## Prerequisites

- `.working/{type}/{slug}/plan/PLAN.md` must exist
- `.working/{type}/{slug}/plan/task/TASK_*.md` files must exist
- `STATUS.md` phase must be `plan-complete`

If prerequisites aren't met, tell the user which phase to complete first.

## Skills Integration

### Superpowers
- **`verification-before-completion`** — After all tasks complete, invoke this before declaring implementation done. Run `bun check` and `bun lint --fix` across the full worktree.
- **`dispatching-parallel-agents`** — Use this pattern when spawning batch tasks in parallel.
- **`using-git-worktrees`** — Invoke this when creating the worktree (step 2). Use its safety verification process instead of raw git commands.
- **`systematic-debugging`** — When a task-implementer fails or reports PARTIAL, invoke this before retrying. Find root cause first, don't just retry blindly.

### Plugin tools
- **`context7`** (MCP tools) — If a task is tagged with `context7`, include the specific library lookups in the agent prompt. Tell the agent: "Before using {library API}, look up the current docs via context7 MCP tools."
- **`feature-dev:code-reviewer`** (agent) — For high-risk tasks (many file changes, complex logic), spawn this agent alongside the task-reviewer for a second opinion with confidence-scored findings.

### Skill-aware agent dispatch
When spawning task-implementer agents, **include the Applicable Skills from each task spec** in the agent prompt. The task-implementer reads those skill files before writing code.

## Process

### 1. Read the plan

Read `plan/PLAN.md` to understand:
- All tasks and their dependencies
- Execution batches
- File impact summary
- **Skills column** — which skills each task requires

### 2. Create worktree

Create a git worktree for this workspace:

```bash
# Create branch
git branch work/{type}/{slug} HEAD

# Create worktree in parent directory
git worktree add ../homeflix-frontend-work-{type}-{slug} work/{type}/{slug}
```

Update STATUS.md with:
- `branch: work/{type}/{slug}`
- `worktree: ../homeflix-frontend-work-{type}-{slug}`
- `phase: implementation`

### 3. Create impl directory structure

```bash
mkdir -p .working/{type}/{slug}/impl/task
```

### 4. Execute batches

For each batch in the plan:

#### a. Identify ready tasks

Tasks are ready when:
- Status is `pending`
- All `depends_on` tasks have status `completed`

#### b. Spawn task-implementer agents (parallel)

For each ready task, spawn a `task-implementer` agent using the Task tool:
- Pass the task file path
- Pass the worktree path
- Pass the project root path
- **Pass the Applicable Skills list** from the task spec — tell the agent: "Before writing code, read these skill files from `.claude/skills/`: {list}. Follow them strictly."

Use `subagent_type: "task-implementer"` with the task-implementer agent prompt.

**Spawn independent tasks in parallel** — use multiple Task tool calls in a single message.

#### c. Collect results

After each agent completes:
- Read the task report from `impl/task/TASK_{N}.md`
- Check if status is COMPLETED

#### d. Spawn task-reviewer agent

For each completed task, spawn a `task-reviewer` agent:
- Pass the task spec path
- Pass the task report path
- Pass the worktree path
- Pass the commit hash (from the task report)

#### e. Handle review results

If review verdict is NEEDS_FIXES:
- Spawn a new task-implementer agent with the fix instructions
- Re-run the reviewer after fixes

If review verdict is APPROVED:
- Mark the task as completed
- Check if any blocked tasks are now unblocked
- Continue to next batch

### 5. Aggregate results

After all tasks complete, create `.working/{type}/{slug}/impl/IMPLEMENTATION.md`:

```markdown
# Implementation Report: {slug}

## Summary
- Total tasks: {N}
- Completed: {N}
- Failed: {N}
- Commits: {N}

## Task Results

| # | Title | Status | Commit | Review |
|---|-------|--------|--------|--------|
| 1 | ... | COMPLETED | abc123 | APPROVED |
| 2 | ... | COMPLETED | def456 | APPROVED |

## Files Changed
- `path/to/file.ts` — Created (Task 1)
- `path/to/other.ts` — Modified (Tasks 2, 4)

## Verification Summary
- TypeScript: ALL PASS
- Lint: ALL PASS

## Review Summary
- All tasks approved: YES | NO
- Issues found and fixed: {count}
- Outstanding issues: {list if any}
```

### 6. Present to user

Show the IMPLEMENTATION.md summary and ask:
**"Implementation complete. {N} tasks finished, all reviews passed. Ready to review with `/review {slug}`?"**

Update STATUS.md: `phase: implementation-complete`

## Rules

- **Respect dependencies** — never spawn a task before its dependencies complete
- **Parallel when possible** — spawn all independent tasks in the same message
- **Don't implement yourself** — the orchestrator dispatches, agents implement
- **Report failures clearly** — if a task fails, show what went wrong
- **Track everything** — every task gets a report, every review gets recorded
