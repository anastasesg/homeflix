import type { DiscoverMovieFilters, DiscoverShowFilters } from '@/api/dtos';

// ============================================================================
// Matcher Types
// ============================================================================

interface DateRangeMatcher {
  type: 'date-range';
  start: [month: number, day: number];
  end: [month: number, day: number];
}

interface HourRangeMatcher {
  type: 'hour-range';
  start: number;
  end: number;
}

interface DayOfWeekMatcher {
  type: 'day-of-week';
  days: number[];
}

interface MonthMatcher {
  type: 'month';
  months: number[];
}

type ContextMatcher = DateRangeMatcher | HourRangeMatcher | DayOfWeekMatcher | MonthMatcher;

// ============================================================================
// Rule Types
// ============================================================================

type ContextRuleType = 'holiday' | 'time-of-day' | 'day-of-week' | 'season' | 'festival';

interface ContextRule {
  id: string;
  type: ContextRuleType;
  priority: number;
  title: { movies: string; shows: string };
  matcher: ContextMatcher;
  filters: {
    movies: DiscoverMovieFilters;
    shows: DiscoverShowFilters;
  };
}

export type { ContextMatcher, ContextRule, ContextRuleType };
export type { DateRangeMatcher, DayOfWeekMatcher, HourRangeMatcher, MonthMatcher };
