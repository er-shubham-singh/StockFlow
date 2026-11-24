"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const toasts = useAppStore((state) => state.toasts);
  const removeToast = useAppStore((state) => state.removeToast);

  const icons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "border-emerald-500/30 bg-emerald-50/95 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100",
    warning: "border-amber-500/30 bg-amber-50/95 dark:bg-amber-950/80 text-amber-900 dark:text-amber-100",
    error: "border-rose-500/30 bg-rose-50/95 dark:bg-rose-950/80 text-rose-900 dark:text-rose-100",
    info: "border-indigo-500/30 bg-indigo-50/95 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-100",
  };

  const iconColors = {
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    error: "text-rose-600 dark:text-rose-400",
    info: "text-indigo-600 dark:text-indigo-400",
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || icons.info;
          const colorClass = colors[toast.type] || colors.info;
          const iconColor = iconColors[toast.type] || iconColors.info;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border shadow-lg backdrop-blur-md",
                colorClass
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", iconColor)} />
              <div className="flex-1 min-w-0 pr-1">
                {toast.title && (
                  <p className="text-xs font-bold tracking-tight">
                    {toast.title}
                  </p>
                )}
                {toast.message && (
                  <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-current opacity-50 hover:opacity-100 p-1 -mr-1 rounded-lg transition-opacity"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
