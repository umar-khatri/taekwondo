import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the total number of Mondays, Wednesdays, and Fridays between two dates (inclusive).
 * @param startDate The start date (e.g., student.date_joined).
 * @param endDate The end date (e.g., today or report end date).
 */
export function calculateMWFClasses(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Normalize times to midnight to avoid timezone/time-of-day edge cases
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start > end) return 0;

  let expectedClasses = 0;
  
  // Create a new date object for iteration to avoid mutating the original
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // 1 = Monday, 3 = Wednesday, 5 = Friday
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
      expectedClasses++;
    }
    // Move to next day
    current.setDate(current.getDate() + 1);
  }
  
  return expectedClasses;
}
