"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Plus,
  CheckCircle2,
  XCircle,
  CreditCard,
  Printer,
  AlertTriangle,
  Building,
  Calendar,
  Layers,
  Trash2,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatINR, formatDate, formatDateTime, cn } from "@/lib/utils";
import { ItemCategories } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { FilterDrawer } from "@/components/shared/FilterDrawer";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon3D } from "@/components/ui/Icon3D";
import { motion } from "framer-motion";
import {
  PageTransition,
  cardStaggerVariants,
  cardItemVariants,
} from "@/components/shared/PageTransition";

function SalesContent() {
  const searchParams = useSearchParams();
  const {
    sales,
    customers,
    items,
    createSaleOrder,
    confirmSaleOrder,
    markSaleAsPaid,
    cancelSaleOrder,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [tempStatus, setTempStatus] = useState("");
  const [tempCategory, setTempCategory] = useState("");
  const [tempDate, setTempDate] = useState("");

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [invoiceDetailOpen, setInvoiceDetailOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [saleToConfirm, setSaleToConfirm] = useState(null);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [saleToCancel, setSaleToCancel] = useState(null);

  useEffect(() => {
    const action = searchParams.get("action");
    const viewId = searchParams.get("view");

    if (action === "new") {
      setCreateDrawerOpen(true);
    }
    if (viewId) {
      const found = sales.find((s) => s.id === viewId);
      if (found) {
        setActiveInvoice(found);
        setInvoiceDetailOpen(true);
      }
    }
  }, [searchParams, sales]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        !search ||
        s.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
        s.customerName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        !selectedStatus || s.status === selectedStatus;

      const matchesDate = !dateFilter || s.date >= dateFilter;

      const matchesCategory =
        !selectedCategory ||
        s.items?.some((saleItem) => {
          const matchedItem = items.find((it) => it.id === saleItem.itemId);
          return matchedItem?.category === selectedCategory;
        });

      return matchesSearch && matchesStatus && matchesDate && matchesCategory;
    });
  }, [sales, items, search, selectedStatus, selectedCategory, dateFilter]);

  // Financial Metrics
  const totalRevenue = sales
    .filter((s) => s.status === "Confirmed" || s.status === "Paid")
    .reduce((sum, s) => sum + s.total, 0);

  const paidSales = sales.filter((s) => s.status === "Paid");
  const confirmedSales = sales.filter((s) => s.status === "Confirmed");
  const draftSales = sales.filter((s) => s.status === "Draft");

  return (
    <PageTransition className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Sales & Invoices"
        description="Create customer invoices with real-time stock validation, track payments, and issue printable tax bills."
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setCreateDrawerOpen(true)}
          >
            New Sale Invoice
          </Button>
        }
      />

      {/* Metric Badges */}
      <motion.div
        variants={cardStaggerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
      >
        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-3 group">
            <Icon3D icon={FileText} variant="primary" size="sm" shape="squircle" animate={true} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">Total Invoices</p>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums leading-tight">
                {sales.length}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-3 group">
            <Icon3D icon={CreditCard} variant="emerald" size="sm" shape="squircle" animate={true} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">Total Revenue</p>
              <p className="text-sm sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums leading-tight truncate">
                {formatINR(totalRevenue)}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-3 group">
            <Icon3D icon={CheckCircle2} variant="teal" size="sm" shape="squircle" animate={true} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">Paid Invoices</p>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums leading-tight">
                {paidSales.length}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-3 group">
            <Icon3D icon={Clock} iconName="Clock" variant="amber" size="sm" shape="squircle" animate={true} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">Draft / Pending</p>
              <p className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums leading-tight">
                {draftSales.length + confirmedSales.length}
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filter and Search Bar */}
      <Card padding="none" className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2.5 p-3 sm:p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search invoice no, customer name..."
            className="flex-1"
          />

          {/* Mobile Filter Button - In One Line With Search Bar */}
          <button
            type="button"
            onClick={() => {
              setTempStatus(selectedStatus);
              setTempCategory(selectedCategory);
              setTempDate(dateFilter);
              setFilterDrawerOpen(true);
            }}
            className={cn(
              "sm:hidden relative flex items-center justify-center min-w-[42px] h-[42px] px-3 rounded-xl border transition-all shrink-0",
              selectedStatus || selectedCategory || dateFilter
                ? "bg-[#5B5BF0]/10 text-[#5B5BF0] border-[#5B5BF0]/40 dark:bg-[#5B5BF0]/20 dark:border-[#5B5BF0]/50"
                : "bg-white dark:bg-[#12152A] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            )}
            aria-label="Open filter options"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
            {(selectedStatus || selectedCategory || dateFilter) && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4.5 h-4.5 text-[10px] font-black rounded-full bg-[#5B5BF0] text-white shadow-xs">
                {(selectedStatus ? 1 : 0) + (selectedCategory ? 1 : 0) + (dateFilter ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Desktop Inline Filters */}
          <div className="hidden sm:flex items-center gap-2.5">
            <FilterSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={ItemCategories}
              placeholder="All Categories"
              className="w-36 sm:w-44"
            />

            <FilterSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={["Draft", "Confirmed", "Paid", "Cancelled"]}
              placeholder="All Statuses"
              className="w-36 sm:w-40"
            />

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              title="Filter from date"
              className="px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 min-h-[42px]"
            />
          </div>
        </div>

        {/* Active Filter Chips on Mobile */}
        {(selectedStatus || selectedCategory || dateFilter) && (
          <div className="sm:hidden flex items-center gap-1.5 px-3 pb-3 pt-0 flex-wrap border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
            <span className="text-[10px] font-semibold text-slate-400">Active:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#5B5BF0]/10 text-[#5B5BF0] border border-[#5B5BF0]/30">
                {selectedCategory}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("")}
                  className="hover:opacity-75 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#5B5BF0]/10 text-[#5B5BF0] border border-[#5B5BF0]/30">
                {selectedStatus}
                <button
                  type="button"
                  onClick={() => setSelectedStatus("")}
                  className="hover:opacity-75 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {dateFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                From: {dateFilter}
                <button
                  type="button"
                  onClick={() => setDateFilter("")}
                  className="hover:opacity-75 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSelectedStatus("");
                setSelectedCategory("");
                setDateFilter("");
              }}
              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline ml-1"
            >
              Clear
            </button>
          </div>
        )}
      </Card>

      {/* Mobile Bottom Sheet Filters */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Filters"
        onClear={() => {
          setTempStatus("");
          setTempCategory("");
          setTempDate("");
          setSelectedStatus("");
          setSelectedCategory("");
          setDateFilter("");
          setFilterDrawerOpen(false);
        }}
        onApply={() => {
          setSelectedStatus(tempStatus);
          setSelectedCategory(tempCategory);
          setDateFilter(tempDate);
          setFilterDrawerOpen(false);
        }}
        clearLabel="Clear Filter"
        applyLabel="Apply Filter"
      >
        {/* Categories Section */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTempCategory("")}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                !tempCategory
                  ? "bg-[#5B5BF0] text-white shadow-xs font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              All Categories
            </button>
            {ItemCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setTempCategory(cat === tempCategory ? "" : cat)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                  tempCategory === cat
                    ? "bg-[#5B5BF0] text-white shadow-xs font-bold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice Status Section */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Invoice Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "All Statuses", value: "", variant: null },
              { label: "Draft", value: "Draft", variant: "Draft" },
              { label: "Confirmed", value: "Confirmed", variant: "Confirmed" },
              { label: "Paid", value: "Paid", variant: "Paid" },
              { label: "Cancelled", value: "Cancelled", variant: "Cancelled" },
            ].map((st) => (
              <button
                key={st.label}
                type="button"
                onClick={() => setTempStatus(st.value === tempStatus ? "" : st.value)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all",
                  tempStatus === st.value
                    ? "border-[#5B5BF0] bg-[#5B5BF0]/10 text-[#5B5BF0] font-bold dark:bg-[#5B5BF0]/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#181C38] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                )}
              >
                <span>{st.label}</span>
                {st.variant && <Badge variant={st.variant} size="sm" />}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter Section */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Filter From Date
          </label>
          <input
            type="date"
            value={tempDate}
            onChange={(e) => setTempDate(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#181C38] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
          />
        </div>
      </FilterDrawer>

      {/* Invoices List */}
      {filteredSales.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No sales orders found"
          description={
            search || selectedStatus || dateFilter
              ? "No invoices match the selected filter criteria."
              : "Create a new sale invoice to record orders and deduct stock."
          }
          actionLabel={
            search || selectedStatus || dateFilter
              ? "Clear Filters"
              : "New Sale Invoice"
          }
          onAction={() => {
            if (search || selectedStatus || dateFilter) {
              setSearch("");
              setSelectedStatus("");
              setDateFilter("");
            } else {
              setCreateDrawerOpen(true);
            }
          }}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Invoice No</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-center">Items</th>
                      <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-medium">
                    {filteredSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => {
                          setActiveInvoice(sale);
                          setInvoiceDetailOpen(true);
                        }}
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-bold font-mono text-[#5B5BF0] dark:text-[#8B5CF6]">
                            {sale.invoiceNo}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            {sale.customerName}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {formatDate(sale.date)}
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-slate-600 dark:text-slate-300">
                          {sale.items.length} item(s)
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">
                          {formatINR(sale.total)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge variant={sale.status} size="sm" dot>
                            {sale.status}
                          </Badge>
                        </td>
                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-2">
                            {sale.status === "Draft" && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setSaleToConfirm(sale);
                                  setConfirmModalOpen(true);
                                }}
                              >
                                Confirm Sale
                              </Button>
                            )}

                            {sale.status === "Confirmed" && (
                              <Button
                                variant="success"
                                size="sm"
                                icon={CreditCard}
                                onClick={() => markSaleAsPaid(sale.id)}
                              >
                                Mark Paid
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Printer}
                              onClick={() => {
                                setActiveInvoice(sale);
                                setInvoiceDetailOpen(true);
                              }}
                            >
                              Print
                            </Button>

                            {sale.status !== "Cancelled" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSaleToCancel(sale);
                                  setCancelModalOpen(true);
                                }}
                                title="Cancel sale (restores stock if confirmed)"
                                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Stacked Cards */}
          <motion.div
            variants={cardStaggerVariants}
            initial="hidden"
            animate="visible"
            className="md:hidden space-y-3"
          >
            {filteredSales.map((sale) => (
              <motion.div variants={cardItemVariants} key={sale.id}>
                <Card
                  className="p-4"
                  hoverLift
                  onClick={() => {
                    setActiveInvoice(sale);
                    setInvoiceDetailOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#5B5BF0] dark:text-[#8B5CF6]">
                        {sale.invoiceNo}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {sale.customerName}
                      </h4>
                    </div>
                    <Badge variant={sale.status} size="sm" dot>
                      {sale.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-400">Invoice Date:</span>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        {formatDate(sale.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Total:</span>
                      <p className="font-black text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                        {formatINR(sale.total)}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-slate-400">
                      {sale.items.length} item(s)
                    </span>

                    <div className="flex items-center gap-2">
                      {sale.status === "Draft" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSaleToConfirm(sale);
                            setConfirmModalOpen(true);
                          }}
                        >
                          Confirm
                        </Button>
                      )}
                      {sale.status === "Confirmed" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => markSaleAsPaid(sale.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveInvoice(sale);
                          setInvoiceDetailOpen(true);
                        }}
                      >
                        Invoice
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {/* New Sale Invoice Drawer with real-time stock validation */}
      <NewSaleDrawer
        isOpen={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        customers={customers}
        items={items}
        onSubmit={(saleData) => {
          const res = createSaleOrder(saleData);
          if (res?.success) {
            setCreateDrawerOpen(false);
          }
        }}
      />

      {/* Printable Invoice Detail Modal */}
      {activeInvoice && (
        <InvoiceDetailModal
          isOpen={invoiceDetailOpen}
          onClose={() => {
            setInvoiceDetailOpen(false);
            setActiveInvoice(null);
          }}
          sale={activeInvoice}
          customer={customers.find((c) => c.id === activeInvoice.customerId)}
          onConfirm={() => {
            confirmSaleOrder(activeInvoice.id);
            const updated = sales.find((s) => s.id === activeInvoice.id);
            if (updated) setActiveInvoice(updated);
          }}
          onMarkPaid={() => {
            markSaleAsPaid(activeInvoice.id);
            const updated = sales.find((s) => s.id === activeInvoice.id);
            if (updated) setActiveInvoice(updated);
          }}
          onCancel={() => {
            cancelSaleOrder(activeInvoice.id);
            const updated = sales.find((s) => s.id === activeInvoice.id);
            if (updated) setActiveInvoice(updated);
          }}
        />
      )}

      {/* Confirm Sale Dialog */}
      <ConfirmDialog
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setSaleToConfirm(null);
        }}
        onConfirm={() => {
          if (saleToConfirm) {
            const res = confirmSaleOrder(saleToConfirm.id);
            if (res?.success) {
              setConfirmModalOpen(false);
              setSaleToConfirm(null);
            }
          }
        }}
        title="Confirm Sale Order?"
        message={`Confirming ${saleToConfirm?.invoiceNo} will immediately DEDUCT stock for all line items from warehouse inventory and log the transaction.`}
        confirmText="Confirm & Deduct Stock"
        variant="primary"
      />

      {/* Cancel Sale Dialog */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSaleToCancel(null);
        }}
        onConfirm={() => {
          if (saleToCancel) {
            cancelSaleOrder(saleToCancel.id);
            setCancelModalOpen(false);
            setSaleToCancel(null);
          }
        }}
        title="Cancel Invoice?"
        message={`Cancelling ${saleToCancel?.invoiceNo} will RESTORE previously deducted items back into inventory balances.`}
        confirmText="Cancel Invoice & Restore Stock"
        variant="danger"
      />
    </PageTransition>
  );
}

/**
 * New Sale Drawer with instant Stock Validation
 */
function NewSaleDrawer({ isOpen, onClose, customers, items, onSubmit }) {
  const [customerId, setCustomerId] = useState(customers[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lineItems, setLineItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(18);
  const [status, setStatus] = useState("Confirmed");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      setError("");
      setStatus("Confirmed");

      // Pick an in-stock item
      const availableItem = items.find((i) => i.quantity > 0) || items[0];
      if (availableItem) {
        setLineItems([
          {
            itemId: availableItem.id,
            sku: availableItem.sku,
            name: availableItem.name,
            quantity: 1,
            unitPrice: availableItem.unitPrice,
            unit: availableItem.unit,
          },
        ]);
      }
    }
  }, [isOpen, items]);

  const addLineItem = () => {
    const unselected =
      items.find(
        (it) => it.quantity > 0 && !lineItems.some((li) => li.itemId === it.id)
      ) || items[0];

    if (unselected) {
      setLineItems([
        ...lineItems,
        {
          itemId: unselected.id,
          sku: unselected.sku,
          name: unselected.name,
          quantity: 1,
          unitPrice: unselected.unitPrice,
          unit: unselected.unit,
        },
      ]);
    }
  };

  const removeLineItem = (index) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index, field, value) => {
    const updated = [...lineItems];
    if (field === "itemId") {
      const selected = items.find((it) => it.id === value);
      if (selected) {
        updated[index] = {
          ...updated[index],
          itemId: selected.id,
          sku: selected.sku,
          name: selected.name,
          unitPrice: selected.unitPrice,
          unit: selected.unit,
        };
      }
    } else {
      updated[index][field] = value;
    }
    setLineItems(updated);
  };

  // Check stock validity for each line item
  const stockErrors = useMemo(() => {
    const errors = {};
    lineItems.forEach((li, idx) => {
      const stockItem = items.find((it) => it.id === li.itemId);
      const available = stockItem ? stockItem.quantity : 0;
      const requested = Number(li.quantity) || 0;
      if (requested > available) {
        errors[idx] = `Only ${available} ${stockItem?.unit || "units"} available in stock!`;
      }
    });
    return errors;
  }, [lineItems, items]);

  const hasStockError = Object.keys(stockErrors).length > 0;

  const subtotal = lineItems.reduce(
    (sum, li) => sum + (Number(li.quantity) || 0) * (Number(li.unitPrice) || 0),
    0
  );
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!customerId) {
      setError("Please select a customer");
      return;
    }

    if (lineItems.length === 0) {
      setError("Please add at least one line item");
      return;
    }

    // Workflow rule: Validate stock before creating Confirmed sale!
    if (status === "Confirmed" && hasStockError) {
      setError(
        "Cannot confirm sale. One or more items exceed currently available inventory stock."
      );
      return;
    }

    const customer = customers.find((c) => c.id === customerId);

    onSubmit({
      customerId,
      customerName: customer ? customer.company || customer.name : "Customer",
      date,
      items: lineItems,
      taxRate,
      status,
      notes,
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create Sales Invoice"
      subtitle="Select products, validate available stock, and generate tax invoice"
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Customer *
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company || c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Invoice Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Initial Status Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Initial Order Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStatus("Confirmed")}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                status === "Confirmed"
                  ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <p className="text-xs font-bold">Confirmed (Immediate Stock Deduction)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Deducts inventory units immediately upon creation.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStatus("Draft")}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                status === "Draft"
                  ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <p className="text-xs font-bold">Draft (Estimate / Requisition)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Does not deduct stock until confirmed later.
              </p>
            </button>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sale Line Items
            </label>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={addLineItem}
            >
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {lineItems.map((li, index) => {
              const stockItem = items.find((it) => it.id === li.itemId);
              const availableQty = stockItem ? stockItem.quantity : 0;
              const hasError = !!stockErrors[index];
              const lineTotal =
                (Number(li.quantity) || 0) * (Number(li.unitPrice) || 0);

              return (
                <div
                  key={index}
                  className={cn(
                    "p-3.5 rounded-2xl border transition-all",
                    hasError
                      ? "bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60"
                      : "bg-slate-50/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Item Picker */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-slate-400">
                          Product
                        </label>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0.2 rounded",
                            availableQty <= 0
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : availableQty <= (stockItem?.minLevel || 5)
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          )}
                        >
                          In Stock: {availableQty} {stockItem?.unit}
                        </span>
                      </div>
                      <select
                        value={li.itemId}
                        onChange={(e) =>
                          updateLineItem(index, "itemId", e.target.value)
                        }
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
                      >
                        {items.map((it) => (
                          <option key={it.id} value={it.id}>
                            {it.name} ({it.sku}) — Stock: {it.quantity}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="w-24">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Qty ({li.unit})
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={li.quantity}
                        onChange={(e) =>
                          updateLineItem(index, "quantity", e.target.value)
                        }
                        className={cn(
                          "w-full px-3 py-1.5 text-xs sm:text-sm tabular-nums bg-white dark:bg-[#12152A] border rounded-xl",
                          hasError
                            ? "border-rose-500 focus:ring-rose-500"
                            : "border-slate-200 dark:border-slate-800"
                        )}
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="w-32">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Rate (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={li.unitPrice}
                        onChange={(e) =>
                          updateLineItem(index, "unitPrice", e.target.value)
                        }
                        className="w-full px-3 py-1.5 text-xs sm:text-sm tabular-nums bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>

                    {/* Line Total */}
                    <div className="w-28 text-right self-end sm:self-center">
                      <span className="block text-[11px] font-medium text-slate-400">
                        Total
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                        {formatINR(lineTotal)}
                      </span>
                    </div>

                    {/* Remove */}
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg self-end sm:self-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Stock validation inline alert */}
                  {hasError && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{stockErrors[index]} Reduce requested quantity to proceed.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal:</span>
            <span className="font-semibold tabular-nums">
              {formatINR(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>GST (18%):</span>
            <span className="font-semibold tabular-nums">
              {formatINR(taxAmount)}
            </span>
          </div>

          <div className="flex justify-between text-base font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60">
            <span>Invoice Grand Total:</span>
            <span className="tabular-nums text-[#5B5BF0] dark:text-[#8B5CF6]">
              {formatINR(grandTotal)}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Invoice Notes / Payment Instructions
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Due within 15 days, NEFT to HDFC Bank A/C #0012398"
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>

        {error && (
          <p className="text-xs font-bold text-rose-500">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={status === "Confirmed" && hasStockError}
          >
            Create Invoice ({status})
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

/**
 * Clean Printable Invoice Modal
 */
function InvoiceDetailModal({
  isOpen,
  onClose,
  sale,
  customer,
  onConfirm,
  onMarkPaid,
  onCancel,
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      showCloseButton={true}
    >
      <div className="space-y-6">
        {/* Actions bar (hidden during print) */}
        <div className="no-print flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Badge variant={sale.status} size="lg" dot>
              {sale.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {sale.status === "Draft" && (
              <Button
                variant="primary"
                size="sm"
                onClick={onConfirm}
              >
                Confirm Sale
              </Button>
            )}

            {sale.status === "Confirmed" && (
              <Button
                variant="success"
                size="sm"
                icon={CreditCard}
                onClick={onMarkPaid}
              >
                Mark as Paid
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={handlePrint}
            >
              Print Invoice
            </Button>

            {sale.status !== "Cancelled" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="text-rose-500 hover:text-rose-600"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Printable Tax Invoice Paper */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#12152A] border border-slate-200/90 dark:border-slate-800 shadow-sm print:shadow-none print:border-none print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#5B5BF0] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm">
                  SF
                </div>
                <span className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                  StockFlow Technologies
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                4th Floor, Maker Chambers V, Nariman Point, Mumbai 400021<br />
                GSTIN: 27AABCS9988Z1Z5 • Email: billing@stockflow.io
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs uppercase font-bold tracking-widest text-[#5B5BF0] dark:text-[#8B5CF6]">
                Tax Invoice
              </span>
              <p className="text-xl font-black font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                {sale.invoiceNo}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Date: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(sale.date)}</span>
              </p>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To:
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {sale.customerName}
              </p>
              {customer && (
                <div className="text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                  <p>GSTIN: <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{customer.gstin}</span></p>
                  <p>Phone: {customer.phone}</p>
                  <p>Address: {customer.address}</p>
                </div>
              )}
            </div>

            <div className="sm:text-right space-y-1">
              <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Payment Details:
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                Status: <span className="font-bold text-slate-900 dark:text-slate-100">{sale.status}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Currency: <span className="font-bold text-slate-900 dark:text-slate-100">INR (₹)</span>
              </p>
            </div>
          </div>

          {/* Line Items */}
          <div className="py-6">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Item Description</th>
                  <th className="pb-3 text-right">Qty</th>
                  <th className="pb-3 text-right">Unit Price</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {sale.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-3">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {it.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {it.sku}
                      </p>
                    </td>
                    <td className="py-3 text-right tabular-nums font-semibold">
                      {it.quantity}
                    </td>
                    <td className="py-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {formatINR(it.unitPrice)}
                    </td>
                    <td className="py-3 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      {formatINR(it.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                  {formatINR(sale.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST ({sale.taxRate}%):</span>
                <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                  {formatINR(sale.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Grand Total:</span>
                <span className="tabular-nums text-[#5B5BF0] dark:text-[#8B5CF6]">
                  {formatINR(sale.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          {sale.notes && (
            <div className="mt-8 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-0.5">Note:</p>
              <p>{sale.notes}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Thank you for your business!</span>
            <span>Generated electronically via StockFlow</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function SalesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading invoices...</div>}>
      <SalesContent />
    </React.Suspense>
  );
}
