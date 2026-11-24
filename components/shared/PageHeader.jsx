import React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-200/80 dark:border-slate-800/80 mb-4 sm:mb-8",
        className
      )}
    >
      <div>
        {breadcrumbs && (
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            {breadcrumbs}
          </div>
        )}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto">{action}</div>}
    </div>
  );
}
