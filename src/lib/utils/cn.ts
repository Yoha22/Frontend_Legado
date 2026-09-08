import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases condicionales resolviendo conflictos de Tailwind. */
export function cn(...clases: ClassValue[]) {
  return twMerge(clsx(clases));
}
