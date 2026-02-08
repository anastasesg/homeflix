---
description: Start a new workflow workspace — classifies type, generates slug, begins discussion
---

# Start Workflow

Initialize a new workflow workspace from a description.

## Instructions

The user has provided a description of what they want to do: `$ARGUMENTS`

If no arguments provided, ask the user to describe what they want to work on.

### 1. Classify the work type

Based on the description, determine the type:
- `feat` — New feature or functionality
- `bug` — Bug fix
- `refactor` — Code restructuring without behavior change
- `docs` — Documentation changes
- `chore` — Maintenance, dependencies, tooling

### 2. Generate a slug

Create a descriptive, kebab-case slug from the description (3-5 words max).
Examples:
- "add global search with filters" → `global-search-filters`
- "fix movie detail page crash" → `fix-movie-detail-crash`
- "refactor query options to use select" → `query-options-select`

### 3. Confirm with user

Present: **"I'd classify this as `{type}` with slug `{slug}`. Does that look right?"**

Wait for confirmation before proceeding.

### 4. Create workspace

```bash
mkdir -p .working/{type}/{slug}
```

### 5. Create STATUS.md

Write `.working/{type}/{slug}/STATUS.md`:

```markdown
# Status: {slug}

type: {type}
phase: discussion
created: {ISO timestamp}
updated: {ISO timestamp}
```

### 6. Enter discussion phase

Use the `workflow-discuss` skill to guide the discussion.
Pass the workspace path and the user's original description.
