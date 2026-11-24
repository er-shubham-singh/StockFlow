"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Boxes,
  Package,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  FileText,
  ShoppingBag,
  ArrowRight,
  Activity as ActivityIcon,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatINR, formatRelativeTime, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Icon3D } from "@/components/ui/Icon3D";
import { StatCard } from "@/components/shared/StatCard";
import { SalesPurchaseChart } from "@/components/dashboard/SalesPurchaseChart";
import { PageTransition, cardStaggerVariants, cardItemVariants } from "@/components/shared/PageTransition";

export default function DashboardPage() {
  const router = useRouter();
  const { items, sales, purchases, activities } = useAppStore();

  // 1. Total Stock Value
  const totalStockValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [items]);

  // 2. Total Items Count
  const totalItemsCount = items.length;
  const totalUnitsInWarehouse = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // 3. Sales this month (November 2024)
  const salesThisMonth = useMemo(() => {
    return sales
      .filter((s) => s.date.startsWith("2024-11") && s.status !== "Cancelled")
      .reduce((sum, s) => sum + s.total, 0);
  }, [sales]);

  // 4. Pending Purchases
  const pendingPurchases = useMemo(() => {
    return purchases.filter((p) => p.status === "Pending");
  }, [purchases]);

  const pendingPurchasesValue = useMemo(() => {
    return pendingPurchases.reduce((sum, p) => sum + p.total, 0);
  }, [pendingPurchases]);

  // Low Stock Items (quantity <= minLevel)
  const lowStockItems = useMemo(() => {
    return items
      .filter((item) => item.quantity <= item.minLevel)
      .sort((a, b) => a.quantity - b.quantity);
  }, [items]);

  // Top Selling Items derived from completed/confirmed sales
  const topSellingItems = useMemo(() => {
    const itemSalesMap = {};

    sales
      .filter((s) => s.status !== "Cancelled")
      .forEach((sale) => {
        sale.items.forEach((li) => {
          if (!itemSalesMap[li.itemId]) {
            itemSalesMap[li.itemId] = {
              id: li.itemId,
              name: li.name,
              sku: li.sku,
              quantity: 0,
              revenue: 0,
            };
          }
          itemSalesMap[li.itemId].quantity += li.quantity;
          itemSalesMap[li.itemId].revenue += li.total;
        });
      });

    const list = Object.values(itemSalesMap);
    list.sort((a, b) => b.revenue - a.revenue);
    return list.slice(0, 5);
  }, [sales]);

  const maxRevenue = topSellingItems[0]?.revenue || 1;

  return (
    <PageTransition className="space-y-8">
      {/* Welcome Banner / Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Inventory Overview
            </h1>
            <Badge variant="Active" size="sm" className="hidden sm:inline-flex">
              Live Sync
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time stock valuation, order pipeline, and critical inventory alerts.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={ShoppingBag}
            onClick={() => router.push("/purchase?action=new")}
          >
            New PO
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => router.push("/sales?action=new")}
          >
            New Sale
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid with Staggered Entrance & Smooth Count-up */}
      <motion.div
        variants={cardStaggerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={cardItemVariants}>
          <StatCard
            title="Total Stock Valuation"
            value={totalStockValue}
            isCurrency={true}
            trend="+8.4%"
            trendDirection="up"
            trendLabel="vs last month"
            icon={Boxes}
            iconColor="text-[#5B5BF0] bg-indigo-50 dark:bg-indigo-950/40"
            onClick={() => router.push("/stock")}
          />
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <StatCard
            title="Total Catalog Items"
            value={totalItemsCount}
            subtitle={`${totalUnitsInWarehouse.toLocaleString("en-IN")} units in warehouse`}
            icon={Package}
            iconColor="text-teal-600 bg-teal-50 dark:bg-teal-950/40"
            onClick={() => router.push("/stock")}
          />
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <StatCard
            title="Sales This Month"
            value={salesThisMonth}
            isCurrency={true}
            trend="+14.2%"
            trendDirection="up"
            trendLabel="vs October"
            icon={TrendingUp}
            iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
            onClick={() => router.push("/sales")}
          />
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <StatCard
            title="Pending Purchases"
            value={pendingPurchases.length}
            suffix=" orders"
            subtitle={`Valued at ${formatINR(pendingPurchasesValue)}`}
            trendDirection="neutral"
            icon={Clock}
            iconName="Clock"
            iconColor="text-amber-600 bg-amber-50 dark:bg-amber-950/40"
            onClick={() => router.push("/purchase")}
          />
        </motion.div>
      </motion.div>

      {/* Low Stock Alerts Banner (If any) */}
      {lowStockItems.length > 0 && (
        <Card className="p-5 border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-r from-amber-50/50 via-white to-transparent dark:from-amber-950/20 dark:via-[#12152A] dark:to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/50 dark:border-amber-900/40">
            <div className="flex items-center gap-3">
              <Icon3D icon={AlertTriangle} variant="amber" size="md" shape="squircle" animate={true} />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Low Stock Attention Required ({lowStockItems.length} items)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Items currently at or below minimum threshold. Reorder before stockouts occur.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={ArrowRight}
              iconRight={null}
              onClick={() => router.push("/stock")}
            >
              View All in Stock
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
            {lowStockItems.slice(0, 3).map((item) => (
              <Card
                key={item.id}
                hoverLift
                padding="none"
                onClick={() => router.push(`/purchase?item=${item.id}`)}
                className="p-3.5 rounded-xl bg-white dark:bg-[#181C38] border border-amber-200/60 dark:border-amber-800/40 shadow-xs flex items-center justify-between gap-3 group"
              >
                <div className="truncate">
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {item.sku}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "text-xs font-black",
                        item.quantity === 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-amber-600 dark:text-amber-400"
                      )}
                    >
                      {item.quantity} {item.unit} left
                    </span>
                    <span className="text-[11px] text-slate-400">
                      (Min: {item.minLevel})
                    </span>
                    <Badge variant={item.status} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="shrink-0 text-xs py-1.5 h-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/purchase?item=${item.id}`);
                  }}
                >
                  Create PO
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales vs Purchase Trend Chart */}
        <Card className="lg:col-span-2 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight">
                Sales vs Procurement Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly revenue inflow vs inventory purchasing costs (INR)
              </p>
            </div>

            {/* Legend with Live 3D Beacons */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-[#5B5BF0] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5B5BF0] shadow-[0_0_8px_#5B5BF0]" />
                </span>
                <span className="text-slate-700 dark:text-slate-300">Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#14B8A6] shadow-[0_0_8px_#14B8A6]" />
                </span>
                <span className="text-slate-700 dark:text-slate-300">Purchases</span>
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <SalesPurchaseChart sales={sales} purchases={purchases} />
        </Card>

        {/* Top Selling Items */}
        <Card className="p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">
                Top Selling Products
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ranked by sales volume & revenue
              </p>
            </div>
            <Link
              href="/sales"
              className="text-xs font-semibold text-[#5B5BF0] dark:text-[#8B5CF6] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {topSellingItems.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">
                No completed sales recorded yet.
              </p>
            ) : (
              topSellingItems.map((prod, idx) => {
                const percent = Math.round((prod.revenue / maxRevenue) * 100);
                return (
                  <div
                    key={prod.id}
                    className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 space-y-1.5 group cursor-pointer"
                    onClick={() => router.push(`/stock?view=${prod.id}`)}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {idx + 1}. {prod.name}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px] ml-1.5">
                          ({prod.quantity} sold)
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums shrink-0">
                        {formatINR(prod.revenue)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#5B5BF0] to-[#8B5CF6]"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity Feed & Fast Status */}
      <Card className="p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <Icon3D icon={ActivityIcon} variant="primary" size="md" shape="squircle" animate={true} />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">
                Recent Inventory & Order Activity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit trail of sales confirmations, purchase receipts, and stock adjustments
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {activities.length} total events
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.slice(0, 6).map((act) => {
            const isSale = act.module === "sales";
            const isPurchase = act.module === "purchase";
            const isStock = act.module === "stock";

            return (
              <Card
                key={act.id}
                hoverLift
                padding="none"
                className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70 flex flex-col justify-between gap-2 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                        isSale
                          ? "bg-indigo-50 text-[#5B5BF0] dark:bg-indigo-950/60 dark:text-[#8B5CF6]"
                          : isPurchase
                          ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      )}
                    >
                      {act.module}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>

                  <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    {act.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </PageTransition>
  );
}
