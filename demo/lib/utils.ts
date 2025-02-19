import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges and combines CSS class names using the twMerge and clsx functions.
 * @param {...ClassValue[]} inputs - An array of CSS class values to be merged and combined.
 * @returns {string} A string of combined and merged CSS class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
