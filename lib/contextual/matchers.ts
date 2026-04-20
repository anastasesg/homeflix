import type { ContextMatcher } from './types';

// ============================================================================
// Matcher Functions
// ============================================================================

function isDateInRange(month: number, day: number, start: [number, number], end: [number, number]): boolean {
  const current = month * 100 + day;
  const startVal = start[0] * 100 + start[1];
  const endVal = end[0] * 100 + end[1];

  // Handle year-wrapping ranges (e.g., Dec 28 - Jan 2)
  if (startVal > endVal) {
    return current >= startVal || current <= endVal;
  }
  return current >= startVal && current <= endVal;
}

function isHourInRange(hour: number, start: number, end: number): boolean {
  // Handle overnight ranges (e.g., 21:00 - 05:00)
  if (start > end) {
    return hour >= start || hour < end;
  }
  return hour >= start && hour < end;
}

function isDayMatch(dayOfWeek: number, days: number[]): boolean {
  return days.includes(dayOfWeek);
}

function isMonthMatch(month: number, months: number[]): boolean {
  return months.includes(month);
}

// ============================================================================
// Main Evaluator
// ============================================================================

function matchesContext(matcher: ContextMatcher, date: Date): boolean {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const hour = date.getHours();
  const dayOfWeek = date.getDay(); // 0=Sunday

  switch (matcher.type) {
    case 'date-range':
      return isDateInRange(month, day, matcher.start, matcher.end);
    case 'hour-range':
      return isHourInRange(hour, matcher.start, matcher.end);
    case 'day-of-week':
      return isDayMatch(dayOfWeek, matcher.days);
    case 'month':
      return isMonthMatch(month, matcher.months);
  }
}

export { matchesContext };
