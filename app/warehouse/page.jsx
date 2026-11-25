"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ArrowLeftRight,
  Plus,
  SlidersHorizontal,
  MapPin,
  Phone,
  User,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Boxes,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Search,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDate, formatDateTime, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon3D } from "@/components/ui/Icon3D";
import { Pagination } from "@/components/ui/Pagination";
import { PageTransition, cardStaggerVariants, cardItemVariants } from "@/components/shared/PageTransition";

const ITEMS_PER_PAGE = 11;

export default function WarehousePage() {
  const {
    warehouses,
    transfers,
    items,
    addWarehouse,
    createTransfer,
    updateTransferStatus,
    triggerAction,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'transfers'
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Transfer Modal State
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    itemId: items[0]?.id || "",
    fromWarehouse: warehouses[0]?.name || "",
    toWarehouse: warehouses[1]?.name || "",
    quantity: 10,
    reason: "Stock Rebalancing",
    carrier: "Blue Dart Express",
    notes: "",
  });
  const [transferError, setTransferError] = useState("");

  // Godown Modal State
  const [godownModalOpen, setGodownModalOpen] = useState(false);
  const [godownForm, setGodownForm] = useState({
    name: "",
    code: "",
    type: "Regional Depot",
    city: "",
    address: "",
    manager: "",
    contact: "",
    capacityUnits: 25000,
  });

  // Calculate high-level metrics
  const totalCapacity = useMemo(() => {
    return warehouses.reduce((sum, w) => sum + (w.capacityUnits || 0), 0);
  }, [warehouses]);

  const totalTransfersCount = transfers.length;
  const inTransitCount = transfers.filter((t) => t.status === "In Transit").length;
  const completedTransfers = transfers.filter((t) => t.status === "Completed").length;

  // Filtered Transfers
  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      const matchSearch =
        search.trim() === "" ||
        t.transferNo.toLowerCase().includes(search.toLowerCase()) ||
        t.itemName.toLowerCase().includes(search.toLowerCase()) ||
        t.itemSku.toLowerCase().includes(search.toLowerCase()) ||
        t.fromWarehouse.toLowerCase().includes(search.toLowerCase()) ||
        t.toWarehouse.toLowerCase().includes(search.toLowerCase());

      const matchStatus = !statusFilter || t.status === statusFilter;
      const matchWarehouse =
        !warehouseFilter ||
        t.fromWarehouse === warehouseFilter ||
        t.toWarehouse === warehouseFilter;

      return matchSearch && matchStatus && matchWarehouse;
    });
  }, [transfers, search, statusFilter, warehouseFilter]);

  // Paginated Transfers (Exactly 11 per page)
  const paginatedTransfers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransfers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransfers, currentPage]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusFilter = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleWarehouseFilter = (val) => {
    setWarehouseFilter(val);
    setCurrentPage(1);
  };

  // Submit New Stock Transfer
  const handleSubmitTransfer = async (e) => {
    e.preventDefault();
    setTransferError("");

    if (!transferForm.itemId) {
      setTransferError("Please select an item to transfer.");
      return;
    }
    if (transferForm.fromWarehouse === transferForm.toWarehouse) {
      setTransferError("Origin and destination godowns cannot be identical.");
      return;
    }
    const qty = Number(transferForm.quantity);
    if (isNaN(qty) || qty <= 0) {
      setTransferError("Please specify a valid positive transfer quantity.");
      return;
    }

    const item = items.find((i) => i.id === transferForm.itemId);
    if (item && qty > item.quantity) {
      setTransferError(`Cannot transfer ${qty} units. Current total stock is only ${item.quantity} ${item.unit}.`);
      return;
    }

    await triggerAction(async () => {
      createTransfer({
        ...transferForm,
        quantity: qty,
      });
      setTransferModalOpen(false);
      setTransferForm({
        itemId: items[0]?.id || "",
        fromWarehouse: warehouses[0]?.name || "",
        toWarehouse: warehouses[1]?.name || "",
        quantity: 10,
        reason: "Stock Rebalancing",
        carrier: "Blue Dart Express",
        notes: "",
      });
    }, "Booking Inter-Godown Transfer...");
  };

  // Submit New Godown
  const handleSubmitGodown = async (e) => {
    e.preventDefault();
    if (!godownForm.name.trim()) return;

    await triggerAction(async () => {
      addWarehouse(godownForm);
      setGodownModalOpen(false);
      setGodownForm({
        name: "",
        code: "",
        type: "Regional Depot",
        city: "",
        address: "",
        manager: "",
        contact: "",
        capacityUnits: 25000,
      });
    }, "Registering New Godown...");
  };

  return (
    <PageTransition className="space-y-6 pb-20 md:pb-8">
      {/* Page Header */}
      <PageHeader
        title="Godown & Stock Transfers"
        description="Monitor multi-warehouse storage facilities, regional hubs, and coordinate inter-godown inventory transfers."
        action={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGodownModalOpen(true)}
              className="rounded-xl border-slate-200 dark:border-slate-800"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Godown
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setTransferError("");
                setTransferModalOpen(true);
              }}
              className="rounded-xl bg-gradient-to-r from-[#5B5BF0] to-[#7070F5] hover:opacity-95 shadow-md shadow-indigo-500/20 text-white"
            >
              <ArrowLeftRight className="w-4 h-4 mr-1.5" />
              Transfer Stock
            </Button>
          </div>
        }
      />

      {/* KPI Metric Stat Cards */}
      <motion.div
        variants={cardStaggerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4"
      >
        <motion.div variants={cardItemVariants}>
          <Card className="p-4 sm:p-5 relative overflow-hidden flex items-center gap-3.5">
            <Icon3D icon={Building2} variant="primary" size="md" shape="squircle" animate={true} />
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Godowns</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {warehouses.length}
              </p>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Active Hubs Across India
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card className="p-4 sm:p-5 relative overflow-hidden flex items-center gap-3.5">
            <Icon3D icon={Boxes} variant="teal" size="md" shape="squircle" animate={true} />
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Capacity</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {totalCapacity.toLocaleString("en-IN")}
              </p>
              <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                Storage Units (Cu.Ft / Pcs)
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card className="p-4 sm:p-5 relative overflow-hidden flex items-center gap-3.5">
            <Icon3D icon={Truck} variant="amber" size="md" shape="squircle" animate={true} />
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">In Transit</p>
              <p className="text-xl sm:text-2xl font-black text-amber-500 mt-0.5">
                {inTransitCount}
              </p>
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                Shipments on Road
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card className="p-4 sm:p-5 relative overflow-hidden flex items-center gap-3.5">
            <Icon3D icon={CheckCircle2} variant="emerald" size="md" shape="squircle" animate={true} />
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Transfers Completed</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {completedTransfers}
              </p>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Successfully Delivered
              </span>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab("overview");
            setCurrentPage(1);
          }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
            activeTab === "overview"
              ? "bg-[#5B5BF0] text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <Building2 className="w-4 h-4" />
          Godown Facilities ({warehouses.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("transfers");
            setCurrentPage(1);
          }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative",
            activeTab === "transfers"
              ? "bg-[#5B5BF0] text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <ArrowLeftRight className="w-4 h-4" />
          Inter-Godown Transfers ({transfers.length})
          {inTransitCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold">
              {inTransitCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: GODOWNS OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warehouses.map((wh) => {
            const usagePercent = Math.min(
              100,
              Math.round(((wh.utilizedUnits || 0) / (wh.capacityUnits || 1)) * 100)
            );

            return (
              <Card
                key={wh.id}
                className="p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all rounded-2xl group relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-[#5B5BF0] dark:text-[#8B5CF6] shrink-0 group-hover:scale-105 transition-transform">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {wh.name}
                        </h3>
                        <Badge variant="teal" size="sm">
                          {wh.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {wh.type} • {wh.city}
                      </p>
                    </div>
                  </div>

                  <Badge variant="emerald" size="sm">
                    {wh.status}
                  </Badge>
                </div>

                {/* Address & Manager */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{wh.address}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Manager: <strong className="font-semibold text-slate-800 dark:text-slate-200">{wh.manager}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{wh.contact}</span>
                    </div>
                  </div>
                </div>

                {/* Storage Capacity Gauge */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      Capacity Utilization
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {wh.utilizedUnits?.toLocaleString("en-IN") || 0} / {wh.capacityUnits?.toLocaleString("en-IN")} units ({usagePercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        usagePercent > 80
                          ? "bg-rose-500"
                          : usagePercent > 50
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      )}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                {/* Quick Action */}
                <div className="mt-4 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTransferForm((prev) => ({
                        ...prev,
                        fromWarehouse: wh.name,
                      }));
                      setTransferModalOpen(true);
                    }}
                    className="text-xs font-semibold text-[#5B5BF0] dark:text-[#8B5CF6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 p-0 h-auto"
                  >
                    Initiate Dispatch From Here <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 2: TRANSFERS LOG */}
      {activeTab === "transfers" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#12152A] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search transfer #, item, godown, SKU..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Transit">In Transit</option>
              </select>

              <select
                value={warehouseFilter}
                onChange={(e) => handleWarehouseFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="">All Godowns</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Button */}
            <div className="sm:hidden flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterDrawerOpen(true)}
                className="w-full rounded-xl flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter Transfers {(statusFilter || warehouseFilter) && "• Active"}
              </Button>
            </div>
          </div>

          {/* Transfers Table / List */}
          {filteredTransfers.length === 0 ? (
            <EmptyState
              icon={ArrowLeftRight}
              title="No Transfers Found"
              description="No inter-godown transfer records matched your search or filters."
              action={
                <Button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("");
                    setWarehouseFilter("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#12152A] shadow-xs">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="py-3.5 px-4">Transfer #</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Origin Godown</th>
                      <th className="py-3.5 px-4">Destination Godown</th>
                      <th className="py-3.5 px-4">Item & SKU</th>
                      <th className="py-3.5 px-4 text-right">Units</th>
                      <th className="py-3.5 px-4">Logistics / Carrier</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {paginatedTransfers.map((trf) => (
                      <tr
                        key={trf.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-xs text-[#5B5BF0] dark:text-[#8B5CF6]">
                          {trf.transferNo}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(trf.date)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {trf.fromWarehouse}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {trf.toWarehouse}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {trf.itemName}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">
                            {trf.itemSku}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-xs text-slate-900 dark:text-white">
                          {trf.quantity}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                          {trf.carrier || "Standard Transit"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={trf.status === "Completed" ? "emerald" : "amber"}
                            size="sm"
                          >
                            {trf.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {paginatedTransfers.map((trf) => (
                  <Card
                    key={trf.id}
                    className="p-4 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#5B5BF0] dark:text-[#8B5CF6]">
                        {trf.transferNo}
                      </span>
                      <Badge
                        variant={trf.status === "Completed" ? "emerald" : "amber"}
                        size="sm"
                      >
                        {trf.status}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {trf.itemName}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {trf.itemSku} • {trf.quantity} Units
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>From:</span>
                        <strong className="text-slate-800 dark:text-slate-200">{trf.fromWarehouse}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>To:</span>
                        <strong className="text-slate-800 dark:text-slate-200">{trf.toWarehouse}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-800/50 text-[11px]">
                        <span>Carrier:</span>
                        <span>{trf.carrier}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Exact 11-item Pagination Component */}
              <Pagination
                totalItems={filteredTransfers.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </>
          )}
        </div>
      )}

      {/* MODAL: New Inter-Godown Stock Transfer */}
      <Modal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="Inter-Godown Stock Transfer"
        subtitle="Dispatch units from one storage hub to another and log movement"
      >
        <form onSubmit={handleSubmitTransfer} className="space-y-4 pt-2">
          {transferError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{transferError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Item To Transfer *
            </label>
            <select
              value={transferForm.itemId}
              onChange={(e) =>
                setTransferForm({ ...transferForm, itemId: e.target.value })
              }
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
              required
            >
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name} ({it.sku}) — Available: {it.quantity} {it.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                From Godown (Origin) *
              </label>
              <select
                value={transferForm.fromWarehouse}
                onChange={(e) =>
                  setTransferForm({ ...transferForm, fromWarehouse: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
                required
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                To Godown (Destination) *
              </label>
              <select
                value={transferForm.toWarehouse}
                onChange={(e) =>
                  setTransferForm({ ...transferForm, toWarehouse: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
                required
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Transfer Quantity (Units) *
              </label>
              <input
                type="number"
                min="1"
                value={transferForm.quantity}
                onChange={(e) =>
                  setTransferForm({ ...transferForm, quantity: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reason / Purpose
              </label>
              <input
                type="text"
                value={transferForm.reason}
                onChange={(e) =>
                  setTransferForm({ ...transferForm, reason: e.target.value })
                }
                placeholder="e.g. Stock Rebalancing"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Logistics Carrier & Tracking #
            </label>
            <input
              type="text"
              value={transferForm.carrier}
              onChange={(e) =>
                setTransferForm({ ...transferForm, carrier: e.target.value })
              }
              placeholder="e.g. Blue Dart Express (AWB: 9940129)"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTransferModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#5B5BF0] hover:bg-[#4F4FE0] text-white"
            >
              Confirm Transfer
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Add New Godown */}
      <Modal
        isOpen={godownModalOpen}
        onClose={() => setGodownModalOpen(false)}
        title="Register New Godown / Warehouse"
        subtitle="Add a new storage hub, depot, or fulfillment center"
      >
        <form onSubmit={handleSubmitGodown} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Godown Name *
            </label>
            <input
              type="text"
              required
              value={godownForm.name}
              onChange={(e) => setGodownForm({ ...godownForm, name: e.target.value })}
              placeholder="e.g. Ahmedabad Logistics Park"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Warehouse Code
              </label>
              <input
                type="text"
                value={godownForm.code}
                onChange={(e) => setGodownForm({ ...godownForm, code: e.target.value })}
                placeholder="e.g. WH-AMD-05"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Facility Type
              </label>
              <input
                type="text"
                value={godownForm.type}
                onChange={(e) => setGodownForm({ ...godownForm, type: e.target.value })}
                placeholder="Regional Depot / Primary Hub"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={godownForm.city}
                onChange={(e) => setGodownForm({ ...godownForm, city: e.target.value })}
                placeholder="e.g. Ahmedabad, Gujarat"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Capacity (Units)
              </label>
              <input
                type="number"
                value={godownForm.capacityUnits}
                onChange={(e) =>
                  setGodownForm({ ...godownForm, capacityUnits: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Physical Address
            </label>
            <input
              type="text"
              value={godownForm.address}
              onChange={(e) => setGodownForm({ ...godownForm, address: e.target.value })}
              placeholder="Plot / Industrial Area Address"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Godown Manager
              </label>
              <input
                type="text"
                value={godownForm.manager}
                onChange={(e) => setGodownForm({ ...godownForm, manager: e.target.value })}
                placeholder="Manager Name"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={godownForm.contact}
                onChange={(e) => setGodownForm({ ...godownForm, contact: e.target.value })}
                placeholder="+91 98xxx xxxxx"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B5BF0]/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGodownModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#5B5BF0] hover:bg-[#4F4FE0] text-white"
            >
              Save Godown
            </Button>
          </div>
        </form>
      </Modal>

      {/* MOBILE DRAWER: Filters */}
      <Drawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Filter Transfers"
        subtitle="Filter by dispatch status or godown"
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Transfer Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["", "Completed", "In Transit"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center",
                    statusFilter === st
                      ? "bg-[#5B5BF0] text-white border-[#5B5BF0]"
                      : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                  )}
                >
                  {st || "All Statuses"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Godown Hub
            </label>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="">All Godowns</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => {
                setStatusFilter("");
                setWarehouseFilter("");
                setFilterDrawerOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              className="flex-1 rounded-xl bg-[#5B5BF0] text-white"
              onClick={() => setFilterDrawerOpen(false)}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </Drawer>
    </PageTransition>
  );
}
