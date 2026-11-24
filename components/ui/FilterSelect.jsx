"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function FilterSelect({
  value,
  onChange,
  options = [],
  placeholder = "All",
  className,
  label,
}) {
  return (
    <div className={cn("relative flex items-center min-w-[140px]", className)}>
      {label && (
        <span className="text-xs font-medium text-slate-400 mr-2 shrink-0 hidden sm:inline">
          {label}:
        </span>
      )}
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm font-medium bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer min-h-[42px] transition-all"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val} className="dark:bg-[#12152A] py-1">
                {lbl}
              </option>
            );
          })}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
