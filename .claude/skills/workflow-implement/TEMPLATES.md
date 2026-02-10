# Agent Prompt Templates

The orchestrator reads this file when constructing agent prompts. Fill in all `{PLACEHOLDER}` values before dispatching.

## Implementer Prompt

```
## Task

Implement task {N}: {title}

## Paths (all absolute)

- Project root: {PROJECT_ROOT}
- Worktree: {TASK_WORKTREE}
- Task spec: {WORKSPACE}/plan/task/TASK_{N}.md
- Report output: {WORKSPACE}/impl/task/TASK_{N}.md

## Skills to read first

Read these skill files before writing any code:
{for each skill in task.skills: "- {PROJECT_ROOT}/.claude/skills/{skill}/SKILL.md"}

Always read: {PROJECT_ROOT}/.claude/skills/code-style/SKILL.md

## Task Spec Content

{FULL TASK SPEC CONTENT — paste the entire file here}

## Instructions

1. Read the skill files listed above
2. Read all reference files from the task spec
3. Implement in the WORKTREE directory ({TASK_WORKTREE})
4. Verify: `bun --cwd {TASK_WORKTREE} check` and `bun --cwd {TASK_WORKTREE} lint --fix`
5. Write report to: {WORKSPACE}/impl/task/TASK_{N}.md

CRITICAL: Do NOT run `git add` or `git commit`. Just write code files and the report.
```

## Implementer Fix Prompt (after NEEDS_FIXES)

```
## Task

Fix task {N}: {title} — addressing review feedback

## Paths (all absolute)

- Project root: {PROJECT_ROOT}
- Worktree: {TASK_WORKTREE}
- Task spec: {WORKSPACE}/plan/task/TASK_{N}.md
- Previous report: {WORKSPACE}/impl/task/TASK_{N}.md

## Review Feedback

{PASTE THE REVIEW DETAILS SECTION FROM THE TASK REPORT}

## Required Fixes

{LIST THE SPECIFIC ISSUES FROM review.verdict = NEEDS_FIXES}

## Instructions

1. Read the previous report to understand what was implemented
2. Read the review feedback above
3. Fix ONLY the issues identified — do not refactor or expand scope
4. Verify: `bun --cwd {TASK_WORKTREE} check` and `bun --cwd {TASK_WORKTREE} lint --fix`
5. Update the report at: {WORKSPACE}/impl/task/TASK_{N}.md

CRITICAL: Do NOT run `git add` or `git commit`. Just fix the files and update the report.
```

## Reviewer Prompt

```
## Review Task {N}: {title}

## Paths (all absolute)

- Project root: {PROJECT_ROOT}
- Worktree: {TASK_WORKTREE}
- Task spec: {WORKSPACE}/plan/task/TASK_{N}.md
- Task report: {WORKSPACE}/impl/task/TASK_{N}.md

## Files to review

{list from the implementation report's files_changed}

## Instructions

1. Read the task spec and task report
2. Read applicable skill files from {PROJECT_ROOT}/.claude/skills/
3. Verify: `bun --cwd {TASK_WORKTREE} check` and `bun --cwd {TASK_WORKTREE} lint`
4. Review working tree diff: `git -C {TASK_WORKTREE} diff -- {space-separated file list}`
5. Update the task report with review results in YAML frontmatter

CRITICAL: Do NOT run `git add`, `git commit`, or `bun lint --fix`. Only review and report.
```

## Committer Prompt

```
## Commit Task {N}: {title}

## Paths (all absolute)

- Task worktree: {TASK_WORKTREE}
- Base worktree: {BASE_WORKTREE}
- Task report: {WORKSPACE}/impl/task/TASK_{N}.md
- Task branch: work/{type}/{slug}/task-{N}

## Instructions

1. Read the task report for file list and commit message
2. Stage the listed files in the task worktree
3. Commit with the suggested message + Co-Authored-By
4. Verify the commit landed on the correct branch
5. Update the task report with the commit hash
6. Merge the task branch into the base worktree
7. Remove the task worktree and delete the task branch
```
