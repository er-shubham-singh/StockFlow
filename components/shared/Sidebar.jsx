"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  BarChart3,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, items } = useAppStore();

  // Workflow Rule: count items <= minLevel for sidebar badge
  const lowStockCount = useMemo(() => {
    return items.filter((item) => item.quantity <= item.minLevel).length;
  }, [items]);

  const navLinks = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Stock",
      href: "/stock",
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      label: "Sales",
      href: "/sales",
      icon: FileText,
    },
    {
      label: "Purchase",
      href: "/purchase",
      icon: ShoppingBag,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
    {
      label: "Godowns",
      href: "/warehouse",
      icon: Building2,
    },
    {
      label: "Contacts",
      href: "/contacts",
      icon: Users,
    },
  ];

  const isActive = (link) => {
    if (link.exact) {
      return pathname === link.href;
    }
    return pathname.startsWith(link.href);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#12152A] transition-all duration-300 ease-in-out shrink-0 z-40 sticky top-0 h-screen",
        sidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Logo & Name */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800/80">
        <Link href="/" prefetch={true} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B5BF0] to-[#8B5CF6] flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <span className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                StockFlow
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-indigo-50 text-[#5B5BF0] dark:bg-indigo-950/60 dark:text-[#8B5CF6] border border-indigo-200/50 dark:border-indigo-800/50">
                  Pro
                </span>
              </span>
              <p className="text-[11px] text-slate-400 leading-none">
                Smart Inventory OS
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navLinks.map((link) => {
          const active = isActive(link);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className={cn(
                "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 group",
                active
                  ? "text-[#5B5BF0] dark:text-[#8B5CF6]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
              )}
            >
              {/* Framer Motion Active Indicator */}
              {active && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/50 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-transform group-hover:scale-105",
                  active
                    ? "text-[#5B5BF0] dark:text-[#8B5CF6]"
                    : "text-slate-400 dark:text-slate-500"
                )}
              />

              {!sidebarCollapsed && (
                <span className="flex-1 truncate">{link.label}</span>
              )}

              {/* Dynamic Badge for Low Stock */}
              {link.badge && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-[11px] font-black rounded-full shrink-0 shadow-xs",
                    link.badgeColor,
                    sidebarCollapsed && "absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px]"
                  )}
                  title={`${link.badge} items below minimum level`}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse/Expand Toggle */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="px-2">
            <span className="text-[11px] font-medium text-slate-400">
              StockFlow v1.0 • INR
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors mx-auto"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
