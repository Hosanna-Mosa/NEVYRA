import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Map URL slugs (used mostly on mobile links) to backend category names
export const categorySlugToBackendMap: Record<string, string> = {
  medical: "Medical",
  groceries: "Groceries",
  "fashion-beauty": "FashionBeauty",
  devices: "Devices",
  electrical: "Electrical",
  automotive: "Automotive",
  sports: "Sports",
  "home-interior": "HomeInterior",
};

// Normalize any category param from the route to a backend-recognized category
export function toBackendCategory(categoryParam?: string): string | undefined {
  if (!categoryParam) return undefined;
  const slug = categoryParam.toLowerCase();
  return categorySlugToBackendMap[slug] ?? categoryParam;
}