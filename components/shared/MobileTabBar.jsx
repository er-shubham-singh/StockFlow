"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  MoreHorizontal,
  BarChart3,
  Users,
  RotateCcw,
  Sun,
  Moon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Drawer } from "@/components/ui/Drawer";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Icon3D } from "@/components/ui/Icon3D";
import { cn } from "@/lib/utils";

export function MobileTabBar() {
  const pathname = usePathname();
  const { theme, toggleTheme, resetDemoData, items } = useAppStore();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const lowStockCount = useMemo(() => {
    return items.filter((item) => item.quantity <= item.minLevel).length;
  }, [items]);

  const tabs = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard, exact: true },
    { label: "Stock", href: "/stock", icon: Package, badge: lowStockCount },
    { label: "Sales", href: "/sales", icon: FileText },
    { label: "Purchase", href: "/purchase", icon: ShoppingBag },
  ];

  const isActive = (href, exact) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const isMoreActive =
    pathname.startsWith("/reports") || pathname.startsWith("/contacts");

  return (
    <>
      {/* Floating Curved Mobile Bottom Dock */}
      <div className="md:hidden fixed bottom-3 inset-x-3 max-w-[340px] mx-auto z-40 select-none pb-safe pointer-events-none">
        <nav
          aria-label="Mobile Navigation"
          className="relative flex items-center justify-between h-[56px] px-1 bg-white/95 dark:bg-[#12152A]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-[22px] shadow-[0_10px_28px_-6px_rgba(0,0,0,0.18)] dark:shadow-[0_14px_36px_-6px_rgba(0,0,0,0.7)] pointer-events-auto"
        >
          {tabs.map((tab) => {
            const active = isActive(tab.href, tab.exact);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex flex-col items-center justify-center flex-1 h-full py-0.5 transition-all group"
              >
                {active ? (
                  <div className="relative flex flex-col items-center justify-center">
                    {/* Active Option: sleek compact container */}
                    <div className="relative flex flex-col items-center justify-center">
                      <Icon3D
                        icon={Icon}
                        variant="primary"
                        size="sm"
                        shape="circle"
                        animate={false}
                        glow={false}
                        badge={tab.badge}
                      />

                      {/* Active Label */}
                      <span className="mt-0.5 text-[10px] font-extrabold text-[#5B5BF0] dark:text-[#8B5CF6] tracking-tight whitespace-nowrap leading-tight">
                        {tab.label}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center justify-center">
                    {/* Inactive tab: matching sleek dimensions */}
                    <div className="relative w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
                      <Icon className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
                      {tab.badge > 0 && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[16px] text-center text-[10px] font-black rounded-full bg-amber-500 text-white shadow-xs">
                          {tab.badge}
                        </span>
                      )}
                    </div>

                    {/* Inactive Label */}
                    <span className="mt-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 tracking-tight whitespace-nowrap leading-tight">
                      {tab.label}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}

          {/* "More" Trigger */}
          <button
            type="button"
            onClick={() => setMoreDrawerOpen(true)}
            className="relative flex flex-col items-center justify-center flex-1 h-full py-0.5 transition-all group"
          >
            {isMoreActive ? (
              <div className="relative flex flex-col items-center justify-center">
                <Icon3D
                  icon={MoreHorizontal}
                  variant="teal"
                  size="sm"
                  shape="circle"
                  animate={false}
                  glow={false}
                />
                <span className="mt-0.5 text-[10px] font-extrabold text-teal-600 dark:text-teal-400 tracking-tight whitespace-nowrap leading-tight">
                  More
                </span>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center">
                <div className="relative w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
                  <MoreHorizontal className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <span className="mt-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 tracking-tight whitespace-nowrap leading-tight">
                  More
                </span>
              </div>
            )}
          </button>
        </nav>
      </div>

      {/* Slide-Up Drawer for "More" Navigation */}
      <Drawer
        isOpen={moreDrawerOpen}
        onClose={() => setMoreDrawerOpen(false)}
        title="More Features"
        subtitle="Reports, contacts, appearance & data tools"
      >
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Link
              href="/reports"
              onClick={() => setMoreDrawerOpen(false)}
              className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
            >
              <Icon3D
                icon={BarChart3}
                variant="amber"
                size="md"
                shape="squircle"
                animate={true}
              />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Reports & Analytics
                </p>
                <p className="text-xs text-slate-400">
                  Stock valuation, monthly sales & purchase reports
                </p>
              </div>
            </Link>

            <Link
              href="/contacts"
              onClick={() => setMoreDrawerOpen(false)}
              className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
            >
              <Icon3D
                icon={Users}
                variant="primary"
                size="md"
                shape="squircle"
                animate={true}
              />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#5B5BF0] dark:group-hover:text-[#8B5CF6] transition-colors">
                  Customers & Suppliers
                </p>
                <p className="text-xs text-slate-400">
                  Manage GST numbers, contacts, and delivery addresses
                </p>
              </div>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <button
              type="button"
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <Icon3D
                  icon={theme === "dark" ? Sun : Moon}
                  variant="teal"
                  size="md"
                  shape="squircle"
                  animate={true}
                />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Appearance
                  </p>
                  <p className="text-xs text-slate-400">
                    Current: {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#5B5BF0] dark:text-[#8B5CF6]">
                Switch
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMoreDrawerOpen(false);
                setResetModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <Icon3D
                  icon={RotateCcw}
                  variant="rose"
                  size="md"
                  shape="squircle"
                  animate={true}
                />
                <div>
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    Reset Demo Data
                  </p>
                  <p className="text-xs text-slate-400">
                    Restore realistic sample inventory & orders
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              StockFlow Inventory OS
            </p>
            <p>Built with Next.js 14 App Router, Tailwind CSS, Zustand & Recharts.</p>
          </div>
        </div>
      </Drawer>

      <ConfirmDialog
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={() => {
          resetDemoData();
          setResetModalOpen(false);
        }}
        title="Reset Demo Data?"
        message="This will re-seed all 25 items, sales invoices, purchase orders, and stock movements to initial defaults."
        confirmText="Reset"
        variant="warning"
      />
    </>
  );
}
