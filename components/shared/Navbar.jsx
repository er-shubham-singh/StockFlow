"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Command,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { GlobalSearchModal } from "./GlobalSearchModal";

export function Navbar() {
  const { theme, toggleTheme, resetDemoData } = useAppStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global keyboard shortcut: Cmd+K or Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 md:px-8">
          {/* Left: Search Trigger */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 w-full max-w-sm px-3.5 py-2 text-xs sm:text-sm text-slate-400 dark:text-slate-500 bg-slate-100/70 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl transition-all shadow-xs group"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              <span className="flex-1 text-left truncate">Search items, invoices, POs...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
                <Command className="w-3 h-3" />K
              </kbd>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Reset Demo Button */}
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={() => setResetModalOpen(true)}
              className="hidden sm:inline-flex text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              Reset Demo
            </Button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* User Profile avatar */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200/80 dark:border-slate-800/80">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B5BF0] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  SF
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#12152A] rounded-full" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                  Operations Admin
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-1 leading-none">
                  StockFlow Enterprise
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Reset Demo Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={() => {
          resetDemoData();
          setResetModalOpen(false);
        }}
        title="Reset Demo Data?"
        message="This will re-seed all 25 items, sales invoices, purchase orders, and stock movements to their realistic Indian-business defaults. Your current changes will be overwritten."
        confirmText="Reset to Defaults"
        variant="warning"
      />
    </>
  );
}
