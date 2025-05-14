import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const convertToSubCurrency = (amount, factor = 100) => {
  // return (amount / 100).toFixed(2);
  return Math.round(amount * factor);
};

export const formatCentsToDollars = (cents) => {
  return `${(cents / 100).toFixed(2)}`;
};
