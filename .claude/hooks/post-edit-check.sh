#!/bin/bash
set -uo pipefail

cd "$CLAUDE_PROJECT_DIR" || exit 0

errors=""

# Run TypeScript type checking
check_output=$(bun check 2>&1) || {
  errors+="=== Type Errors ===
$check_output

"
}

# Run ESLint with auto-fix
lint_output=$(bun lint --fix 2>&1) || {
  errors+="=== Lint Errors ===
$lint_output

"
}

if [ -n "$errors" ]; then
  echo "$errors" >&2
  exit 2
fi

# Silent on success — no transcript noise
exit 0
