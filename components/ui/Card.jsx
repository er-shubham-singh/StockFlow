"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  hoverLift = false,
  padding = "default",
  animated = false,
  as: Component = "div",
  ...props
}) {
  const paddings = {
    none: "",
    sm: "p-3 sm:p-4",
    default: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  const hoverClasses = hoverLift
    ? "cursor-pointer hover:-translate-y-1 hover:shadow-soft dark:hover:shadow-soft-dark hover:border-slate-300 dark:hover:border-slate-700/80 active:scale-[0.995]"
    : "";

  const baseClasses = cn(
    "bg-white dark:bg-[#12152A] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-card backdrop-blur-sm transition-all duration-300 ease-out",
    paddings[padding],
    hoverClasses,
    className
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component className={baseClasses} {...props}>
      {children}
    </Component>
  );
}

export function CardHeader({ children, className, action, subtitle, title }) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60 mb-4 transition-colors",
        className
      )}
    >
      <div>
        {title && (
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
