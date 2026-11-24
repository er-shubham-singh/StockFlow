"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FilterDrawer:
 * Slide-up mobile bottom sheet for filters with a clean header,
 * touch-friendly filter options, and a sticky footer with Clear & Apply buttons.
 */
export function FilterDrawer({
  isOpen,
  onClose,
  title = "Filters",
  children,
  onClear,
  onApply,
  clearLabel = "Clear Filter",
  applyLabel = "Apply Filter",
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Bottom Sheet Container */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#12152A] rounded-t-[28px] sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] z-10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle Indicator */}
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {children}
            </div>

            {/* Sticky Bottom Actions */}
            <div className="flex items-center gap-3 p-4 px-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#181C38]/80 shrink-0">
              <button
                type="button"
                onClick={onClear}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
              >
                {clearLabel}
              </button>
              <button
                type="button"
                onClick={onApply}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#5B5BF0] hover:bg-[#4542D8] shadow-md shadow-indigo-500/25 transition-all"
              >
                {applyLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
