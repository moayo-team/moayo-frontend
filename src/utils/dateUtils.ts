/**
 * Calculate D-Day from a deadline date
 * @param deadline - The deadline date
 * @returns D-Day string (e.g., "D-4", "D-Day", "종료")
 */
export function calculateDDay(deadline: Date | string): string {
  // Get today's date at midnight (local time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Parse deadline and set to midnight (local time)
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  
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
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
