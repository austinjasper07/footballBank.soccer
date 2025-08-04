// utils/dateHelpers.ts
import { format, formatDistanceToNow } from 'date-fns'

/**
 * Converts a date to "time ago" (e.g. 5 minutes ago)
 */
export function formatTimeAgo(date){
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return 'Invalid date'
  }
}

/**
 * Converts a date to readable full date (e.g. 2nd May 2025)
 */
export function formatFullDate(date){
  try {
    return format(new Date(date), "do MMMM yyyy") // e.g. 2nd May 2025
  } catch {
    return 'Invalid date'
  }
}

export function formatShortDate(date){
  try {
    return format(new Date(date), "yyyy-MM-dd") // e.g. 2025-05-02
  } catch {
    return 'Invalid date'
  }
}

export function calculateAge (date) {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}