import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function getMasteryColor(score: number): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
} {
  if (score >= 75) {
    return {
      bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      dot: "bg-emerald-500",
      label: "High Mastery",
    };
  }
  if (score >= 50) {
    return {
      bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      dot: "bg-amber-500",
      label: "Medium Mastery",
    };
  }
  return {
    bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
    label: "Low Mastery",
  };
}
