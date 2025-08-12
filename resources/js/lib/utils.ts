import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for reservation tables

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  return dateString.slice(0, 10);
}

export function normalizeDate(dateString: string): string {
  return dateString.split('T')[0];
}

export function compareTimeSlots(timeA: string, timeB: string): number {
  const parseTime = (timeStr: string): number => {
    const time = timeStr.toLowerCase();
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    let hour24 = hours;
    if (period === 'pm' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'am' && hours === 12) {
      hour24 = 0;
    }
    return hour24 * 60 + minutes;
  };
  return parseTime(timeA) - parseTime(timeB);
} 

