import React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = true,
  live = true,
  className,
}) {
  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5 font-medium gap-1.5",
    md: "text-xs px-2.5 py-1 font-semibold gap-1.5",
    lg: "text-sm px-3.5 py-1.5 font-semibold gap-2",
  };

  const variants = {
    // Inventory statuses
    "In Stock":
      "bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
    "Low Stock":
      "bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
    "Out of Stock":
      "bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",

    // Order & Procurement statuses
    Draft:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700",
    Confirmed:
      "bg-indigo-50 text-indigo-700 border-indigo-200/70 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40",
    Paid:
      "bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
    Received:
      "bg-teal-50 text-teal-700 border-teal-200/70 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
    Cancelled:
      "bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",

    // Entity active / inactive statuses
    Active:
      "bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
    Inactive:
      "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700",
    inactive:
      "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700",

    // General purpose
    default:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    primary:
      "bg-indigo-50 text-indigo-700 border-indigo-200/70 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40",
    accent:
      "bg-teal-50 text-teal-700 border-teal-200/70 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40",
    warning:
      "bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
    danger:
      "bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
  };

  const dotConfig = {
    "In Stock": { core: "bg-emerald-500", ping: "bg-emerald-400", live: true },
    "Low Stock": { core: "bg-amber-500", ping: "bg-amber-400", live: true },
    "Out of Stock": { core: "bg-rose-500", ping: "bg-rose-400", live: true },
    Draft: { core: "bg-slate-400", ping: "bg-slate-400/50", live: true },
    Confirmed: { core: "bg-indigo-500", ping: "bg-indigo-400", live: true },
    Paid: { core: "bg-emerald-500", ping: "bg-emerald-400", live: true },
    Received: { core: "bg-teal-500", ping: "bg-teal-400", live: true },
    Pending: { core: "bg-amber-500", ping: "bg-amber-400", live: true },
    Cancelled: { core: "bg-rose-500", ping: "bg-rose-400", live: true },
    Active: { core: "bg-emerald-500", ping: "bg-emerald-400", live: true },
    active: { core: "bg-emerald-500", ping: "bg-emerald-400", live: true },
    Inactive: { core: "bg-slate-400", ping: "bg-slate-400/50", live: true },
    inactive: { core: "bg-slate-400", ping: "bg-slate-400/50", live: true },
    primary: { core: "bg-indigo-500", ping: "bg-indigo-400", live: true },
    accent: { core: "bg-teal-500", ping: "bg-teal-400", live: true },
    warning: { core: "bg-amber-500", ping: "bg-amber-400", live: true },
    danger: { core: "bg-rose-500", ping: "bg-rose-400", live: true },
    default: { core: "bg-slate-400", ping: "bg-slate-400/50", live: true },
  };

  const badgeStyle = variants[variant] || variants.default;
  const config = dotConfig[variant] || dotConfig.default;
  const isLive = live && config.live;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border shadow-xs whitespace-nowrap transition-colors",
        sizeStyles[size] || sizeStyles.md,
        badgeStyle,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "relative flex items-center justify-center shrink-0",
            size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2"
          )}
        >
          {isLive && (
            <span
              className={cn(
                "animate-live-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                config.ping
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full",
              size === "lg" ? "h-2 w-2" : "h-1.5 w-1.5",
              config.core,
              isLive && "animate-live-blink"
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
