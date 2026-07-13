import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the number of Mondays, Wednesdays, and Fridays in a given month.
 * @param date The date object representing the current month. Defaults to today.
 */
export function getMonthlyExpectedClasses(date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let expectedClasses = 0;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dayOfWeek = d.getDay();
    // 1 = Monday, 3 = Wednesday, 5 = Friday
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
      expectedClasses++;
    }
  }
  
  return expectedClasses;
}
