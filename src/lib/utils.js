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

export const formatTimeHMSS = (timestamp) => {
  const date = new Date(timestamp);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${hours}hr : ${minutes}min : ${seconds}sec`;
};

// export const formatTimeHMSS = (timestamp) => {
//   const date = new Date(timestamp);
//   const hours = String(date.getUTCHours()).padStart(2, "0");
//   const minutes = String(date.getUTCMinutes()).padStart(2, "0");
//   const seconds = String(date.getUTCSeconds()).padStart(2, "0");
//   return `${hours}:${minutes}:${seconds}`;
// };

export function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past; // difference in milliseconds

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (seconds > 0) return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  return "just now";
}


export function _userStatus(status) {
  if (status === "pending") {
    return { label: "Pending", colorClass: "bg-blue-400" }; // Blue for pending
  }
  if (status === "approved") {
    return { label: "Approved", colorClass: "bg-green-400" }; // Green for approved
  }
  if (status === "rejected") {
    return { label: "Rejected", colorClass: "bg-red-400" }; // Red for rejected
  }
}
