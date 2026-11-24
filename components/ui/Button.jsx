"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  onClick,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 min-h-[36px] gap-1.5",
    md: "text-sm px-4 py-2 min-h-[44px] gap-2",
    lg: "text-base px-5 py-2.5 min-h-[48px] gap-2.5",
    icon: "p-2 min-h-[44px] min-w-[44px]",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#5B5BF0] to-[#8B5CF6] hover:from-[#4E4EDD] hover:to-[#7C3AED] text-white shadow-sm shadow-indigo-500/20 focus:ring-indigo-500",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-200 focus:ring-slate-400 border border-slate-200/60 dark:border-slate-700/60",
    outline:
      "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:ring-slate-400 bg-transparent",
    ghost:
      "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 focus:ring-slate-400",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/20 focus:ring-red-500",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 focus:ring-emerald-500",
    accent:
      "bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-500/20 focus:ring-teal-500",
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {!loading && IconRight ? <IconRight className="w-4 h-4 shrink-0" /> : null}
    </motion.button>
  );
}
