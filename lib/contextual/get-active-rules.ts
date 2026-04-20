import { matchesContext } from './matchers';
import { CONTEXTUAL_RULES } from './rules';
import type { ContextRule } from './types';

const MAX_ACTIVE_RULES = 2;

function getActiveRules(date: Date = new Date()): ContextRule[] {
  return CONTEXTUAL_RULES.filter((rule) => matchesContext(rule.matcher, date))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, MAX_ACTIVE_RULES);
}

export { getActiveRules };
