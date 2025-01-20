import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const PROGRAMLIST = ['Pump Lift', 'Pump Condition', 'Perform', 'Pillars', 'Minimalist']