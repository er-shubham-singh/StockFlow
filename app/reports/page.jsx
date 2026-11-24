"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Package,
  FileText,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Layers,
  PieChart as PieIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppStore } from "@/lib/store";
import { formatINR, formatDate, exportToCSV, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/shared/PageHeader";
import { motion } from "framer-motion";
import {
  PageTransition,
  cardStaggerVariants,
  cardItemVariants,
} from "@/components/shared/PageTransition";

export default function ReportsPage() {
  const { items, sales, purchases } = useAppStore();
  const [activeTab, setActiveTab] = useState("stock"); // 'stock' | 'sales' | 'purchase'
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  // 1. Stock Report Data
  const stockValuation = useMemo(() => {
    return items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  }, [items]);

  const stockCost = useMemo(() => {
    return items.reduce((sum, it) => sum + it.quantity * it.purchasePrice, 0);
  }, [items]);

  const potentialGrossMargin = stockValuation > 0
    ? Math.round(((stockValuation - stockCost) / stockValuation) * 100)
    : 0;

  // Category breakdown for Stock Chart
  const categoryData = useMemo(() => {
    const map = {};
    items.forEach((it) => {
      if (!map[it.category]) map[it.category] = { name: it.category, value: 0 };
      map[it.category].value += it.quantity * it.unitPrice;
    });
    return Object.values(map);
  }, [items]);

  const COLORS = ["#5B5BF0", "#14B8A6", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"];

  // 2. Sales Report Data (Filtered by date range)
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      if (s.status === "Cancelled") return false;
      if (startDate && s.date < startDate) return false;
      if (endDate && s.date > endDate) return false;
      return true;
    });
  }, [sales, startDate, endDate]);

  const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const totalTaxCollected = filteredSales.reduce((sum, s) => sum + s.taxAmount, 0);
  const avgOrderValue = filteredSales.length > 0 ? Math.round(totalSalesRevenue / filteredSales.length) : 0;

  // 3. Purchase Report Data (Filtered by date range)
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      if (p.status === "Cancelled") return false;
      if (startDate && p.date < startDate) return false;
      if (endDate && p.date > endDate) return false;
      return true;
    });
  }, [purchases, startDate, endDate]);

  const totalPurchaseSpend = filteredPurchases.reduce((sum, p) => sum + p.total, 0);
  const totalInputTax = filteredPurchases.reduce((sum, p) => sum + p.taxAmount, 0);

  // Supplier breakdown for Purchase Chart
  const supplierSpendData = useMemo(() => {
    const map = {};
    filteredPurchases.forEach((p) => {
      if (!map[p.supplierName]) map[p.supplierName] = { name: p.supplierName.split(" ")[0], spend: 0 };
      map[p.supplierName].spend += p.total;
    });
    return Object.values(map);
  }, [filteredPurchases]);

  // Export handlers
  const handleExportStockCSV = () => {
    const rows = items.map((i) => ({
      SKU: i.sku,
      Name: i.name,
      Category: i.category,
      Quantity: i.quantity,
      Unit: i.unit,
      UnitPrice: i.unitPrice,
      PurchasePrice: i.purchasePrice,
      TotalValuation: i.quantity * i.unitPrice,
      TotalCost: i.quantity * i.purchasePrice,
      Status: i.status,
    }));
    exportToCSV("StockFlow-Inventory-Report", rows);
  };

  const handleExportSalesCSV = () => {
    const rows = filteredSales.map((s) => ({
      InvoiceNo: s.invoiceNo,
      Customer: s.customerName,
      Date: s.date,
      ItemsCount: s.items.length,
      Subtotal: s.subtotal,
      GST: s.taxAmount,
      Total: s.total,
      Status: s.status,
    }));
    exportToCSV("StockFlow-Sales-Report", rows);
  };

  const handleExportPurchaseCSV = () => {
    const rows = filteredPurchases.map((p) => ({
      PONumber: p.poNo,
      Supplier: p.supplierName,
      Date: p.date,
      ItemsCount: p.items.length,
      Subtotal: p.subtotal,
      GST: p.taxAmount,
      Total: p.total,
      Status: p.status,
    }));
    exportToCSV("StockFlow-Purchase-Report", rows);
  };

  return (
    <PageTransition className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive audit reports, inventory valuation breakdown, and exportable financial datasets."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              icon={Download}
              onClick={() => {
                if (activeTab === "stock") handleExportStockCSV();
                else if (activeTab === "sales") handleExportSalesCSV();
                else handleExportPurchaseCSV();
              }}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Tabs and Date Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-2xl bg-white dark:bg-[#12152A] border border-slate-200/80 dark:border-slate-800/80">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/70 dark:bg-slate-900/60 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("stock")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all",
              activeTab === "stock"
                ? "bg-white dark:bg-[#12152A] text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Package className="w-4 h-4 text-[#5B5BF0]" />
            Stock Report
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sales")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all",
              activeTab === "sales"
                ? "bg-white dark:bg-[#12152A] text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            Sales Report
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("purchase")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all",
              activeTab === "purchase"
                ? "bg-white dark:bg-[#12152A] text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <ShoppingBag className="w-4 h-4 text-teal-500" />
            Purchase Report
          </button>
        </div>

        {/* Date Range Selectors for Sales/Purchases */}
        {activeTab !== "stock" && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            />
            <span className="text-slate-400 font-medium">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            />
          </div>
        )}
      </div>

      {/* 1. STOCK REPORT TAB */}
      {activeTab === "stock" && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <motion.div
            variants={cardStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Total Stock Value</span>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                  {formatINR(stockValuation)}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Total Stock Cost</span>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                  {formatINR(stockCost)}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Est. Profit Margin</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
                  {potentialGrossMargin}%
                </p>
              </Card>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Unique SKUs</span>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                  {items.length} items
                </p>
              </Card>
            </motion.div>
          </motion.div>

          {/* Chart & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-4">
                Inventory Valuation by Category
              </h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.15} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip formatter={(val) => [formatINR(val), "Valuation"]} />
                    <Bar dataKey="value" fill="#5B5BF0" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-4">
                Category Proportion
              </h3>
              <div className="w-full h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [formatINR(val), "Value"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Data Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                    <th className="py-3 px-4">SKU / Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Available Qty</th>
                    <th className="py-3 px-4 text-right">Cost Price</th>
                    <th className="py-3 px-4 text-right">Selling Price</th>
                    <th className="py-3 px-4 text-right">Total Valuation</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {items.map((it) => (
                    <tr key={it.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {it.name} <span className="text-slate-400 font-mono font-normal block text-xs">{it.sku}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{it.category}</td>
                      <td className="py-3 px-4 text-right tabular-nums font-semibold">
                        {it.quantity} {it.unit}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-500">{formatINR(it.purchasePrice)}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-800 dark:text-slate-200 font-semibold">{formatINR(it.unitPrice)}</td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                        {formatINR(it.quantity * it.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={it.status} size="sm">{it.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 2. SALES REPORT TAB */}
      {activeTab === "sales" && (
        <div className="space-y-6">
          <motion.div
            variants={cardStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Total Sales Volume</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
                  {formatINR(totalSalesRevenue)}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Invoices Issued</span>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                  {filteredSales.length}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Avg Invoice Value</span>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                  {formatINR(avgOrderValue)}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">GST Collected</span>
                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums mt-1">
                  {formatINR(totalTaxCollected)}
                </p>
              </Card>
            </motion.div>
          </motion.div>

          {/* Sales Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                    <th className="py-3 px-4">Invoice No</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                    <th className="py-3 px-4 text-right">GST (18%)</th>
                    <th className="py-3 px-4 text-right">Total (₹)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredSales.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-[#5B5BF0]">{s.invoiceNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{s.customerName}</td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(s.date)}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">{formatINR(s.subtotal)}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">{formatINR(s.taxAmount)}</td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">{formatINR(s.total)}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={s.status} size="sm">{s.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 3. PURCHASE REPORT TAB */}
      {activeTab === "purchase" && (
        <div className="space-y-6">
          <motion.div
            variants={cardStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Total Procurement</span>
                <p className="text-xl font-black text-teal-600 dark:text-teal-400 tabular-nums mt-1">
                  {formatINR(totalPurchaseSpend)}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Orders Raised</span>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                  {filteredPurchases.length}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Input GST Paid</span>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                  {formatINR(totalInputTax)}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <Card hoverLift padding="none" className="p-4">
                <span className="text-xs font-semibold text-slate-400">Active Vendors</span>
                <p className="text-xl font-black text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                  {supplierSpendData.length}
                </p>
              </Card>
            </motion.div>
          </motion.div>

          {/* Supplier Spend Bar Chart */}
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-4">
              Procurement Spend by Supplier
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierSpendData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.15} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip formatter={(val) => [formatINR(val), "Spend"]} />
                  <Bar dataKey="spend" fill="#14B8A6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Purchase Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                    <th className="py-3 px-4">PO Number</th>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                    <th className="py-3 px-4 text-right">GST</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredPurchases.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">{p.poNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{p.supplierName}</td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(p.date)}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">{formatINR(p.subtotal)}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">{formatINR(p.taxAmount)}</td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">{formatINR(p.total)}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={p.status} size="sm">{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </PageTransition>
  );
}
