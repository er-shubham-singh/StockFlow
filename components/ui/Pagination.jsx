"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable Premium Pagination Component
 * Default pageSize = 11 (per user requirement)
 */
export function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 11,
  onPageChange,
  className,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalItems === 0 || totalPages <= 1) {
    if (totalItems > 0) {
      return (
        <div className={cn("flex items-center justify-between px-4 py-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80", className)}>
          <span>Showing all {totalItems} items</span>
          <span className="font-semibold text-slate-400">Page 1 of 1</span>
        </div>
      );
    }
    return null;
  }

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const delta = 1; // Number of pages to show before/after current
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 text-xs",
        className
      )}
    >
      {/* Range Info */}
      <div className="text-slate-500 dark:text-slate-400 font-medium">
        Showing <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{startIndex}</span>
        –<span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{endIndex}</span> of{" "}
        <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{totalItems}</span> items
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Number Pills */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 select-none">
                  …
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={cn(
                  "min-w-[32px] h-8 px-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center",
                  isCurrent
                    ? "bg-[#5B5BF0] text-white shadow-sm shadow-indigo-500/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80"
                )}
                aria-current={isCurrent ? "page" : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
