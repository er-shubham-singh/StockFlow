"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Plus,
  Truck,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  Calendar,
  Layers,
  Trash2,
  Printer,
  AlertCircle,
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

function PurchaseContent() {
  const searchParams = useSearchParams();
  const {
    purchases,
    suppliers,
    items,
    createPurchaseOrder,
    receivePurchaseOrder,
    cancelPurchaseOrder,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [tempStatus, setTempStatus] = useState("");
  const [tempCategory, setTempCategory] = useState("");

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [prefilledItemId, setPrefilledItemId] = useState(null);

  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [activePO, setActivePO] = useState(null);

  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [poToReceive, setPoToReceive] = useState(null);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [poToCancel, setPoToCancel] = useState(null);

  // Check URL params (?action=new or ?item=item-01 or ?view=po-001)
  useEffect(() => {
    const action = searchParams.get("action");
    const itemParam = searchParams.get("item");
    const viewId = searchParams.get("view");

    if (action === "new" || itemParam) {
      if (itemParam) setPrefilledItemId(itemParam);
      setCreateDrawerOpen(true);
    }
    if (viewId) {
      const po = purchases.find((p) => p.id === viewId);
      if (po) {
        setActivePO(po);
        setDetailDrawerOpen(true);
      }
    }
  }, [searchParams, purchases]);

  // Filtered list
  const filteredPurchases = useMemo(() => {
    return purchases.filter((po) => {
      const matchesSearch =
        !search ||
        po.poNo.toLowerCase().includes(search.toLowerCase()) ||
        po.supplierName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        !selectedStatus || po.status === selectedStatus;

      const matchesCategory =
        !selectedCategory ||
        po.items?.some((poItem) => {
          const matchedItem = items.find((it) => it.id === poItem.itemId);
          return matchedItem?.category === selectedCategory;
        });

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [purchases, items, search, selectedStatus, selectedCategory]);

  // Metrics
  const totalSpend = purchases
    .filter((p) => p.status !== "Cancelled")
    .reduce((sum, p) => sum + p.total, 0);

  const pendingPOs = purchases.filter((p) => p.status === "Pending");
  const receivedPOs = purchases.filter((p) => p.status === "Received");

  return (
    <PageTransition className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Purchase Orders"
        description="Raise orders to suppliers, monitor shipments in transit, and confirm stock receipt."
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setPrefilledItemId(null);
              setCreateDrawerOpen(true);
            }}
          >
            New Purchase Order
          </Button>
        }
      />

      {/* KPI Badges */}
      <motion.div
        variants={cardStaggerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
      >
        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-3 group">
            <Icon3D icon={ShoppingBag} variant="teal" size="sm" shape="squircle" animate={true} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">Total POs</p>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums leading-tight">
                {purchases.length}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-3 group">
            <Icon3D icon={Truck} variant="amber" size="sm" shape="squircle" animate={true} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">Pending Deliveries</p>
              <p className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums leading-tight">
                {pendingPOs.length}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-3 group">
            <Icon3D icon={CheckCircle2} variant="emerald" size="sm" shape="squircle" animate={true} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">Received & Added</p>
              <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums leading-tight">
                {receivedPOs.length}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-3 group">
            <Icon3D icon={Layers} variant="primary" size="sm" shape="squircle" animate={true} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">Total Procured</p>
              <p className="text-sm sm:text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums leading-tight truncate">
                {formatINR(totalSpend)}
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search & Filter Bar */}
      <Card padding="none" className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2.5 p-3 sm:p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search PO number, supplier..."
            className="flex-1"
          />

          {/* Mobile Filter Button - In One Line With Search Bar */}
          <button
            type="button"
            onClick={() => {
              setTempStatus(selectedStatus);
              setTempCategory(selectedCategory);
              setFilterDrawerOpen(true);
            }}
            className={cn(
              "sm:hidden relative flex items-center justify-center min-w-[42px] h-[42px] px-3 rounded-xl border transition-all shrink-0",
              selectedStatus || selectedCategory
                ? "bg-[#5B5BF0]/10 text-[#5B5BF0] border-[#5B5BF0]/40 dark:bg-[#5B5BF0]/20 dark:border-[#5B5BF0]/50"
                : "bg-white dark:bg-[#12152A] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            )}
            aria-label="Open filter options"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
            {(selectedStatus || selectedCategory) && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4.5 h-4.5 text-[10px] font-black rounded-full bg-[#5B5BF0] text-white shadow-xs">
                {(selectedStatus ? 1 : 0) + (selectedCategory ? 1 : 0)}
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
              options={["Pending", "Received", "Cancelled"]}
              placeholder="All PO Statuses"
              className="w-36 sm:w-44"
            />
          </div>
        </div>

        {/* Active Filter Chips on Mobile */}
        {(selectedStatus || selectedCategory) && (
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
            <button
              type="button"
              onClick={() => {
                setSelectedStatus("");
                setSelectedCategory("");
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
          setSelectedStatus("");
          setSelectedCategory("");
          setFilterDrawerOpen(false);
        }}
        onApply={() => {
          setSelectedStatus(tempStatus);
          setSelectedCategory(tempCategory);
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

        {/* PO Status Section */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            PO Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "All Statuses", value: "", variant: null },
              { label: "Pending", value: "Pending", variant: "Pending" },
              { label: "Received", value: "Received", variant: "Received" },
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
      </FilterDrawer>

      {/* PO Listing */}
      {filteredPurchases.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No purchase orders found"
          description={
            search || selectedStatus
              ? "No purchase orders match your filter criteria."
              : "Raise your first purchase order to replenish inventory."
          }
          actionLabel={
            search || selectedStatus ? "Clear Filters" : "New Purchase Order"
          }
          onAction={() => {
            if (search || selectedStatus) {
              setSearch("");
              setSelectedStatus("");
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
                      <th className="py-3.5 px-4">PO Number</th>
                      <th className="py-3.5 px-4">Supplier</th>
                      <th className="py-3.5 px-4">Order Date</th>
                      <th className="py-3.5 px-4 text-center">Items</th>
                      <th className="py-3.5 px-4 text-right">Total Amount</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-medium">
                    {filteredPurchases.map((po) => (
                      <tr
                        key={po.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => {
                          setActivePO(po);
                          setDetailDrawerOpen(true);
                        }}
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                            {po.poNo}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            {po.supplierName}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {formatDate(po.date)}
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-slate-600 dark:text-slate-300">
                          {po.items.length} product(s)
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">
                          {formatINR(po.total)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge variant={po.status} size="sm" dot>
                            {po.status}
                          </Badge>
                        </td>
                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-2">
                            {po.status === "Pending" && (
                              <Button
                                variant="success"
                                size="sm"
                                icon={CheckCircle2}
                                onClick={() => {
                                  setPoToReceive(po);
                                  setReceiveModalOpen(true);
                                }}
                              >
                                Receive
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              icon={FileText}
                              onClick={() => {
                                setActivePO(po);
                                setDetailDrawerOpen(true);
                              }}
                            >
                              View
                            </Button>

                            {po.status === "Pending" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPoToCancel(po);
                                  setCancelModalOpen(true);
                                }}
                                title="Cancel Purchase Order"
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
            {filteredPurchases.map((po) => (
              <motion.div variants={cardItemVariants} key={po.id}>
                <Card
                  className="p-4"
                  hoverLift
                  onClick={() => {
                    setActivePO(po);
                    setDetailDrawerOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {po.poNo}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {po.supplierName}
                      </h4>
                    </div>
                    <Badge variant={po.status} size="sm" dot>
                      {po.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-400">Order Date:</span>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        {formatDate(po.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Total Amount:</span>
                      <p className="font-black text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                        {formatINR(po.total)}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-slate-400">
                      {po.items.length} item(s) ordered
                    </span>

                    <div className="flex items-center gap-2">
                      {po.status === "Pending" && (
                        <Button
                          variant="success"
                          size="sm"
                          icon={CheckCircle2}
                          onClick={() => {
                            setPoToReceive(po);
                            setReceiveModalOpen(true);
                          }}
                        >
                          Receive
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActivePO(po);
                          setDetailDrawerOpen(true);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {/* New Purchase Order Drawer */}
      <NewPurchaseOrderDrawer
        isOpen={createDrawerOpen}
        onClose={() => {
          setCreateDrawerOpen(false);
          setPrefilledItemId(null);
        }}
        suppliers={suppliers}
        items={items}
        prefilledItemId={prefilledItemId}
        onSubmit={(poData) => {
          createPurchaseOrder(poData);
          setCreateDrawerOpen(false);
          setPrefilledItemId(null);
        }}
      />

      {/* Purchase Order Detail Drawer */}
      {activePO && (
        <PurchaseOrderDetailDrawer
          isOpen={detailDrawerOpen}
          onClose={() => {
            setDetailDrawerOpen(false);
            setActivePO(null);
          }}
          po={activePO}
          supplier={suppliers.find((s) => s.id === activePO.supplierId)}
          onReceive={() => {
            setPoToReceive(activePO);
            setReceiveModalOpen(true);
          }}
          onCancel={() => {
            setPoToCancel(activePO);
            setCancelModalOpen(true);
          }}
        />
      )}

      {/* Receive PO Confirmation Dialog */}
      <ConfirmDialog
        isOpen={receiveModalOpen}
        onClose={() => {
          setReceiveModalOpen(false);
          setPoToReceive(null);
        }}
        onConfirm={() => {
          if (poToReceive) {
            receivePurchaseOrder(poToReceive.id);
            setReceiveModalOpen(false);
            // Update active PO if open
            if (activePO && activePO.id === poToReceive.id) {
              const updated = purchases.find((p) => p.id === poToReceive.id);
              if (updated) setActivePO(updated);
            }
            setPoToReceive(null);
          }
        }}
        title="Mark PO as Received?"
        message={`Confirming will mark ${poToReceive?.poNo} as Received, INCREASE stock quantities for all ${poToReceive?.items?.length} items in inventory, and log stock movement entries.`}
        confirmText="Confirm & Add to Stock"
        variant="primary"
      />

      {/* Cancel PO Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setPoToCancel(null);
        }}
        onConfirm={() => {
          if (poToCancel) {
            cancelPurchaseOrder(poToCancel.id);
            setCancelModalOpen(false);
            if (activePO && activePO.id === poToCancel.id) {
              const updated = purchases.find((p) => p.id === poToCancel.id);
              if (updated) setActivePO(updated);
            }
            setPoToCancel(null);
          }
        }}
        title="Cancel Purchase Order?"
        message={`Are you sure you want to cancel ${poToCancel?.poNo}? This order will become inactive.`}
        confirmText="Cancel Order"
        variant="danger"
      />
    </PageTransition>
  );
}

/**
 * New Purchase Order Drawer with dynamic line items
 */
function NewPurchaseOrderDrawer({
  isOpen,
  onClose,
  suppliers,
  items,
  prefilledItemId,
  onSubmit,
}) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lineItems, setLineItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(18); // 18% GST standard in India
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      setError("");

      if (prefilledItemId) {
        const item = items.find((i) => i.id === prefilledItemId);
        if (item) {
          setLineItems([
            {
              itemId: item.id,
              sku: item.sku,
              name: item.name,
              quantity: Math.max(item.minLevel * 2, 10),
              unitPrice: item.purchasePrice || 1000,
              unit: item.unit,
            },
          ]);
          return;
        }
      }

      // Default with first inventory item
      if (items.length > 0) {
        setLineItems([
          {
            itemId: items[0].id,
            sku: items[0].sku,
            name: items[0].name,
            quantity: 10,
            unitPrice: items[0].purchasePrice || 500,
            unit: items[0].unit,
          },
        ]);
      }
    }
  }, [isOpen, prefilledItemId, items]);

  const addLineItem = () => {
    const unselected = items.find(
      (it) => !lineItems.some((li) => li.itemId === it.id)
    ) || items[0];

    if (unselected) {
      setLineItems([
        ...lineItems,
        {
          itemId: unselected.id,
          sku: unselected.sku,
          name: unselected.name,
          quantity: 10,
          unitPrice: unselected.purchasePrice || 500,
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
          unitPrice: selected.purchasePrice || 500,
          unit: selected.unit,
        };
      }
    } else {
      updated[index][field] = value;
    }
    setLineItems(updated);
  };

  const subtotal = lineItems.reduce(
    (sum, li) => sum + (Number(li.quantity) || 0) * (Number(li.unitPrice) || 0),
    0
  );
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!supplierId) {
      setError("Please select a supplier");
      return;
    }

    if (lineItems.length === 0) {
      setError("Please add at least one line item");
      return;
    }

    for (const li of lineItems) {
      if (!li.quantity || Number(li.quantity) <= 0) {
        setError("Quantity must be greater than 0 for all items");
        return;
      }
    }

    const supplier = suppliers.find((s) => s.id === supplierId);

    onSubmit({
      supplierId,
      supplierName: supplier ? supplier.company || supplier.name : "Supplier",
      date,
      items: lineItems,
      taxRate,
      notes,
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create Purchase Order"
      subtitle="Procure inventory goods from registered vendors"
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Supplier & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Supplier *
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.company || s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Order Date *
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

        {/* Line Items Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Procurement Line Items
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
              const lineTotal =
                (Number(li.quantity) || 0) * (Number(li.unitPrice) || 0);

              return (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  {/* Select Item */}
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Product
                    </label>
                    <select
                      value={li.itemId}
                      onChange={(e) =>
                        updateLineItem(index, "itemId", e.target.value)
                      }
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
                    >
                      {items.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.name} ({it.sku})
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
                      className="w-full px-3 py-1.5 text-xs sm:text-sm tabular-nums bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                  </div>

                  {/* Unit Purchase Price */}
                  <div className="w-32">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Cost (₹)
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

                  {/* Remove Button */}
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
              );
            })}
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal:</span>
            <span className="font-semibold tabular-nums">
              {formatINR(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Applicable GST (18%):</span>
            <span className="font-semibold tabular-nums">
              {formatINR(taxAmount)}
            </span>
          </div>

          <div className="flex justify-between text-base font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60">
            <span>Grand Total:</span>
            <span className="tabular-nums text-indigo-600 dark:text-indigo-400">
              {formatINR(grandTotal)}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Requisition / Dispatch Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Expected delivery via Gati KWE by Friday"
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-rose-500">{error}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Purchase Order
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

/**
 * Purchase Order Detail Drawer
 */
function PurchaseOrderDetailDrawer({
  isOpen,
  onClose,
  po,
  supplier,
  onReceive,
  onCancel,
}) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`PO: ${po.poNo}`}
      subtitle={`Created on ${formatDate(po.date)}`}
      width="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Status Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <Badge variant={po.status} size="lg" dot>
              {po.status}
            </Badge>
            {po.receivedAt && (
              <span className="text-xs text-slate-400">
                Received on {formatDateTime(po.receivedAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {po.status === "Pending" && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  icon={CheckCircle2}
                  onClick={onReceive}
                >
                  Mark Received
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="text-rose-500 hover:text-rose-600"
                >
                  Cancel PO
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Supplier Information Card */}
        <Card hoverLift padding="none" className="p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Supplier Details
          </h4>
          <p className="font-bold text-slate-900 dark:text-slate-100 text-base">
            {po.supplierName}
          </p>
          {supplier && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <p>GSTIN: <span className="font-mono text-slate-700 dark:text-slate-300">{supplier.gstin}</span></p>
              <p>Phone: <span className="text-slate-700 dark:text-slate-300">{supplier.phone}</span></p>
              <p className="sm:col-span-2">Address: {supplier.address}</p>
            </div>
          )}
        </Card>

        {/* Line Items Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Ordered Line Items ({po.items.length})
          </h4>
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Cost Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {po.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {item.sku}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-semibold">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {formatINR(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      {formatINR(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-100">
              {formatINR(po.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>GST ({po.taxRate}%):</span>
            <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-100">
              {formatINR(po.taxAmount)}
            </span>
          </div>
          <div className="flex justify-between text-base font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span>Total Value:</span>
            <span className="tabular-nums text-teal-600 dark:text-teal-400">
              {formatINR(po.total)}
            </span>
          </div>
        </div>

        {po.notes && (
          <div className="text-xs text-slate-500">
            <span className="font-semibold block text-slate-700 dark:text-slate-300 mb-0.5">
              Notes:
            </span>
            <p>{po.notes}</p>
          </div>
        )}
      </div>
    </Drawer>
  );
}

export default function PurchasePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading orders...</div>}>
      <PurchaseContent />
    </React.Suspense>
  );
}
