"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";

/**
 * TopNavigationProgressBar:
 * Instant glowing progress bar on route navigation.
 * Triggers on internal link clicks and completes when pathname changes.
 */
export function TopNavigationProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // When pathname changes, complete and hide
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Intercept all internal navigation clicks for instant 0ms feedback
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !anchor.getAttribute("target") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        // Only trigger if going to a different route
        const currentPath = window.location.pathname;
        if (href !== currentPath) {
          setVisible(true);
          setProgress(25);
          setTimeout(() => setProgress(65), 100);
          setTimeout(() => setProgress(85), 300);
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#5B5BF0] via-[#8B5CF6] to-[#14B8A6] transition-all ease-out shadow-[0_0_12px_#5B5BF0]"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "150ms" : "300ms",
        }}
      />
    </div>
  );
}

/**
 * GlobalActionLoader:
 * Premium glassmorphic loader overlay triggered on major actions.
 */
export function GlobalActionLoader() {
  const { actionLoading, actionLoadingMessage } = useAppStore();

  return (
    <AnimatePresence>
      {actionLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="relative flex flex-col items-center justify-center p-7 rounded-3xl bg-white/95 dark:bg-[#12152A]/95 border border-slate-200/90 dark:border-slate-800/90 shadow-2xl max-w-xs w-full text-center"
          >
            {/* 3D Dual-Orbiting Glowing Rings */}
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-[#5B5BF0] border-r-[#8B5CF6] animate-spin" />
              {/* Counter-rotating Inner Ring */}
              <div
                className="absolute inset-2 rounded-full border-3 border-transparent border-b-[#14B8A6] border-l-[#2DD4BF] animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "0.85s" }}
              />
              {/* Center Pulsing Logo Icon */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B5BF0] to-[#8B5CF6] flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Boxes className="w-4 h-4 animate-pulse" />
              </div>
            </div>

            {/* Title & Message */}
            <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {actionLoadingMessage || "Processing..."}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Updating real-time inventory records
            </p>

            {/* Shimmering live status pill */}
            <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-[11px] font-semibold text-[#5B5BF0] dark:text-[#8B5CF6]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B5BF0] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B5BF0]" />
              </span>
              <span>StockFlow Engine Active</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * InlineSpinner:
 * Compact glowing spinner for buttons and interactive controls.
 */
export function InlineSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-3.5 h-3.5 border-2",
    md: "w-4.5 h-4.5 border-2",
    lg: "w-6 h-6 border-3",
  };

  return (
    <div
      className={`rounded-full border-transparent border-t-current border-r-current animate-spin ${sizes[size] || sizes.md} ${className}`}
      aria-label="Loading..."
    />
  );
}
