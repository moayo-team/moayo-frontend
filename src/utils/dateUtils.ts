/**
 * Calculate D-Day from a deadline date
 * @param deadline - The deadline date
 * @returns D-Day string (e.g., "D-4", "D-Day", "종료")
 */
export function calculateDDay(deadline: Date | string): string {
  // Helper: parse input into a Date representing local midnight for that date.
  const toLocalMidnight = (d: Date | string) => {
    if (typeof d === 'string') {
      // If string is in YYYY-MM-DD format, construct as local date to avoid
      // UTC-based parsing which can shift the day across timezones.
      const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m) {
        const y = Number(m[1]);
        const mo = Number(m[2]) - 1;
        const day = Number(m[3]);
        const nd = new Date(y, mo, day);
        nd.setHours(0, 0, 0, 0);
        return nd;
      }
    }
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };

  // Get today's date at midnight (local time)
  const today = toLocalMidnight(new Date());
  // Parse deadline into local midnight
  const deadlineDate = toLocalMidnight(deadline);
  
  // Calculate difference in days
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  console.log('=== D-Day Calculation ===');
  console.log('Today:', today.toLocaleDateString('ko-KR'));
  console.log('Deadline:', deadlineDate.toLocaleDateString('ko-KR'));
  console.log('Diff in milliseconds:', diffTime);
  console.log('Diff in days:', diffDays);
  console.log('========================');
  
  if (diffDays < 0) {
    return "종료";
  } else if (diffDays === 0) {
    return "D-Day";
  } else {
    return `D-${diffDays}`;
  }
}

/**
 * Check if a deadline is urgent (within 3 days)
 * @param deadline - The deadline date
 * @returns true if urgent, false otherwise
 */
export function isUrgent(deadline: Date | string): boolean {
  const toLocalMidnight = (d: Date | string) => {
    if (typeof d === 'string') {
      const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m) {
        const y = Number(m[1]);
        const mo = Number(m[2]) - 1;
        const day = Number(m[3]);
        const nd = new Date(y, mo, day);
        nd.setHours(0, 0, 0, 0);
        return nd;
      }
    }
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };

  const today = toLocalMidnight(new Date());
  const deadlineDate = toLocalMidnight(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= 3;
}

/**
 * Format a date range string
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns Formatted date range string (e.g., "2025.01.07 - 2025.01.21")
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const formatDate = (date: Date | string) => {
    // ensure local date parsing for YYYY-MM-DD strings
    let d: Date;
    if (typeof date === 'string') {
      const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m) {
        d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      } else {
        d = new Date(date);
      }
    } else {
      d = new Date(date);
    }
    d.setHours(0, 0, 0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
