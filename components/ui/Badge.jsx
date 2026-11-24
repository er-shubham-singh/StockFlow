import React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className,
}) {
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-semibold",
    lg: "text-sm px-3 py-1 font-semibold",
  };

  const variants = {
    // Inventory statuses
    "In Stock": "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
    "Low Stock": "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
    "Out of Stock": "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",

    // Order statuses
    Draft: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700",
    Confirmed: "bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40",
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
    Received: "bg-teal-50 text-teal-700 border-teal-200/60 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40",
    Pending: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",

    // General purpose
    default: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    primary: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40",
    accent: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40",
    warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
    danger: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
  };

  const dotColors = {
    "In Stock": "bg-emerald-500",
    "Low Stock": "bg-amber-500",
    "Out of Stock": "bg-rose-500",
    Draft: "bg-slate-400",
    Confirmed: "bg-indigo-500",
    Paid: "bg-emerald-500",
    Received: "bg-teal-500",
    Pending: "bg-amber-500",
    Cancelled: "bg-rose-500",
    default: "bg-slate-500",
  };

  const badgeStyle = variants[variant] || variants.default;
  const dotColor = dotColors[variant] || dotColors.default;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border shadow-xs whitespace-nowrap",
        sizeStyles[size],
        badgeStyle,
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />}
      {children}
    </span>
  );
}
