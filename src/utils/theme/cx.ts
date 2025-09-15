import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cx = clsx + tailwind-merge
 * - clsx handles conditional class joining
 * - twMerge ensures Tailwind conflicts are resolved properly
 */
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
