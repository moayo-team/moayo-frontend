/**
 * Calculate D-Day from a given deadline
 * @param deadline - The deadline date
 * @returns D-Day string (e.g., "D-4", "D-Day", "D+2", or "상시모집")
 */
export function calculateDDay(deadline: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'D-Day';
  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
  
  return '상시모집';
}

/**
 * Check if a deadline is urgent (within 3 days)
 * @param deadline - The deadline date
 * @returns true if urgent, false otherwise
 */
export function isUrgent(deadline: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= 3;
}

/**
 * Format date to YYYY.MM.DD
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
}
