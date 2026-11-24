"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  SlidersHorizontal,
  History,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Boxes,
  Clock,
  Layers,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatINR, formatDate, formatDateTime, cn } from "@/lib/utils";
import { ItemCategories, Units } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon3D } from "@/components/ui/Icon3D";
import { PageTransition, cardStaggerVariants, cardItemVariants } from "@/components/shared/PageTransition";

function StockContent() {
  const searchParams = useSearchParams();
  const {
    items,
    stockMovements,
    addItem,
    updateItem,
    deleteItem,
    adjustStock,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Drawers & Modals
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustTargetItem, setAdjustTargetItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustType, setAdjustType] = useState("add"); // 'add' | 'subtract'
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustError, setAdjustError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Check URL query parameters (e.g. ?action=new or ?view=item-01)
  useEffect(() => {
    const action = searchParams.get("action");
    const viewId = searchParams.get("view");
    if (action === "new") {
      setEditingItem(null);
      setFormDrawerOpen(true);
    }
    if (viewId) {
      const item = items.find((i) => i.id === viewId);
      if (item) {
        setActiveItem(item);
        setDetailDrawerOpen(true);
      }
    }
  }, [searchParams, items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;

      const matchesStatus =
        !selectedStatus || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, selectedCategory, selectedStatus]);

  // Calculations for KPI pills
  const totalStockCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalValuation = items.reduce(
    (sum, i) => sum + i.quantity * i.unitPrice,
    0
  );
  const lowStockCount = items.filter((i) => i.quantity <= i.minLevel).length;

  // Stock adjustments handler
  const handlePerformAdjustment = (e) => {
    e.preventDefault();
    setAdjustError("");

    const num = Number(adjustQty);
    if (!num || num <= 0) {
      setAdjustError("Please enter a valid positive quantity");
      return;
    }

    const change = adjustType === "add" ? num : -num;
    const result = adjustStock(
      adjustTargetItem.id,
      change,
      adjustReason || "Manual inventory adjustment"
    );

    if (result.success) {
      setAdjustModalOpen(false);
      setAdjustQty("");
      setAdjustReason("");
      // Update active item if detail drawer is open
      if (activeItem && activeItem.id === adjustTargetItem.id) {
        const updated = items.find((i) => i.id === adjustTargetItem.id);
        if (updated) setActiveItem(updated);
      }
    } else {
      setAdjustError(result.error);
    }
  };

  return (
    <PageTransition className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Stock & Inventory"
        description="Monitor catalog items, inventory levels, stock history logs, and manage manual adjustments."
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingItem(null);
              setFormDrawerOpen(true);
            }}
          >
            Add New Item
          </Button>
        }
      />

      {/* Summary KPI Badges */}
      <motion.div
        variants={cardStaggerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-3.5 flex items-center gap-3">
            <Icon3D icon={Package} variant="primary" size="md" shape="squircle" animate={true} />
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Total SKUs</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums">
                {items.length}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-3.5 flex items-center gap-3">
            <Icon3D icon={Boxes} variant="emerald" size="md" shape="squircle" animate={true} />
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Total Units</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums">
                {totalStockCount.toLocaleString("en-IN")}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-3.5 flex items-center gap-3">
            <Icon3D icon={AlertTriangle} variant="amber" size="md" shape="squircle" animate={true} />
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Low Stock</p>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums">
                {lowStockCount} items
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Card hoverLift padding="none" className="p-3.5 flex items-center gap-3">
            <Icon3D icon={Layers} variant="teal" size="md" shape="squircle" animate={true} />
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Total Value</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums">
                {formatINR(totalValuation)}
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search & Filter Bar */}
      <Card className="p-4" padding="none">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search SKU, item name..."
            className="flex-1"
          />

          <div className="flex items-center gap-2.5 flex-wrap">
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
              options={["In Stock", "Low Stock", "Out of Stock"]}
              placeholder="All Statuses"
              className="w-32 sm:w-36"
            />
          </div>
        </div>
      </Card>

      {/* Main Inventory Content */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No inventory items found"
          description={
            search || selectedCategory || selectedStatus
              ? "No items match your active filter criteria. Try clearing filters."
              : "Get started by adding your first product to inventory."
          }
          actionLabel={
            search || selectedCategory || selectedStatus
              ? "Clear Filters"
              : "Add Item"
          }
          onAction={() => {
            if (search || selectedCategory || selectedStatus) {
              setSearch("");
              setSelectedCategory("");
              setSelectedStatus("");
            } else {
              setFormDrawerOpen(true);
            }
          }}
        />
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block">
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Item & SKU</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 text-right">Available Qty</th>
                      <th className="py-3.5 px-4 text-right">Unit Price</th>
                      <th className="py-3.5 px-4 text-right">Stock Value</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-medium">
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => {
                          setActiveItem(item);
                          setDetailDrawerOpen(true);
                        }}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono tracking-tight">
                            {item.sku}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums">
                          <span
                            className={cn(
                              "font-bold",
                              item.quantity <= 0
                                ? "text-rose-600 dark:text-rose-400"
                                : item.quantity <= item.minLevel
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-slate-900 dark:text-slate-100"
                            )}
                          >
                            {item.quantity.toLocaleString("en-IN")} {item.unit}
                          </span>
                          <span className="text-xs text-slate-400 block font-normal">
                            Min: {item.minLevel} {item.unit}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                          {formatINR(item.unitPrice)}
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">
                          {formatINR(item.quantity * item.unitPrice)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge variant={item.status} size="sm" dot>
                            {item.status}
                          </Badge>
                        </td>
                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setAdjustTargetItem(item);
                                setAdjustType("add");
                                setAdjustQty("");
                                setAdjustReason("");
                                setAdjustError("");
                                setAdjustModalOpen(true);
                              }}
                              title="Adjust stock balance"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <ArrowUpDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveItem(item);
                                setDetailDrawerOpen(true);
                              }}
                              title="View stock history & details"
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <History className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(item);
                                setFormDrawerOpen(true);
                              }}
                              title="Edit item details"
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setItemToDelete(item);
                                setDeleteModalOpen(true);
                              }}
                              title="Delete item"
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Stacked Card View */}
          <motion.div
            variants={cardStaggerVariants}
            initial="hidden"
            animate="visible"
            className="md:hidden space-y-3"
          >
            {filteredItems.map((item) => (
              <motion.div key={item.id} variants={cardItemVariants}>
                <Card
                  className="p-4"
                  hoverLift
                  onClick={() => {
                    setActiveItem(item);
                    setDetailDrawerOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {item.sku} • {item.category}
                      </p>
                    </div>
                    <Badge variant={item.status} size="sm" dot>
                      {item.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Stock Level:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm tabular-nums mt-0.5">
                        {item.quantity} {item.unit}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Min Alert: {item.minLevel} {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Unit Price:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm tabular-nums mt-0.5">
                        {formatINR(item.unitPrice)}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Value: {formatINR(item.quantity * item.unitPrice)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      icon={ArrowUpDown}
                      onClick={() => {
                        setAdjustTargetItem(item);
                        setAdjustType("add");
                        setAdjustQty("");
                        setAdjustReason("");
                        setAdjustError("");
                        setAdjustModalOpen(true);
                      }}
                    >
                      Adjust
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={History}
                        onClick={() => {
                          setActiveItem(item);
                          setDetailDrawerOpen(true);
                        }}
                      >
                        History
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        onClick={() => {
                          setEditingItem(item);
                          setFormDrawerOpen(true);
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {/* Item Add/Edit Drawer */}
      <ItemFormDrawer
        isOpen={formDrawerOpen}
        onClose={() => {
          setFormDrawerOpen(false);
          setEditingItem(null);
        }}
        initialItem={editingItem}
        onSubmit={(data) => {
          if (editingItem) {
            updateItem(editingItem.id, data);
          } else {
            addItem(data);
          }
          setFormDrawerOpen(false);
          setEditingItem(null);
        }}
      />

      {/* Item Detail & History Timeline Drawer */}
      {activeItem && (
        <ItemDetailDrawer
          isOpen={detailDrawerOpen}
          onClose={() => {
            setDetailDrawerOpen(false);
            setActiveItem(null);
          }}
          item={activeItem}
          movements={stockMovements.filter((m) => m.itemId === activeItem.id)}
          onAdjust={() => {
            setAdjustTargetItem(activeItem);
            setAdjustType("add");
            setAdjustQty("");
            setAdjustReason("");
            setAdjustError("");
            setAdjustModalOpen(true);
          }}
          onEdit={() => {
            setEditingItem(activeItem);
            setDetailDrawerOpen(false);
            setFormDrawerOpen(true);
          }}
        />
      )}

      {/* Stock Adjustment Modal */}
      {adjustTargetItem && (
        <Modal
          isOpen={adjustModalOpen}
          onClose={() => setAdjustModalOpen(false)}
          title="Adjust Stock Quantity"
          subtitle={`Manually update current balance for ${adjustTargetItem.name} (${adjustTargetItem.sku})`}
        >
          <form onSubmit={handlePerformAdjustment} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Current Stock:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {adjustTargetItem.quantity} {adjustTargetItem.unit}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Adjustment Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType("add")}
                  className={cn(
                    "flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all",
                    adjustType === "add"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  Increase Stock (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType("subtract")}
                  className={cn(
                    "flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all",
                    adjustType === "subtract"
                      ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <ArrowDownRight className="w-4 h-4 text-rose-500" />
                  Reduce Stock (-)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantity ({adjustTargetItem.unit}) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Adjustment *
              </label>
              <input
                type="text"
                required
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. Physical inventory count correction, Damaged stock"
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {adjustError && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {adjustError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <Button
                variant="outline"
                onClick={() => setAdjustModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm Adjustment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Item Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={() => {
          if (itemToDelete) {
            deleteItem(itemToDelete.id);
            setDeleteModalOpen(false);
            setItemToDelete(null);
          }
        }}
        title="Delete Item?"
        message={`Are you sure you want to delete "${itemToDelete?.name}" (${itemToDelete?.sku})? This item will be removed from future sales and purchases.`}
        confirmText="Delete Item"
        variant="danger"
      />
    </PageTransition>
  );
}

/**
 * Item Add / Edit Form Drawer
 */
function ItemFormDrawer({ isOpen, onClose, initialItem, onSubmit }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState(ItemCategories[0]);
  const [quantity, setQuantity] = useState("10");
  const [minLevel, setMinLevel] = useState("5");
  const [unitPrice, setUnitPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [unit, setUnit] = useState("Pcs");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setSku(initialItem.sku);
      setCategory(initialItem.category);
      setQuantity(String(initialItem.quantity));
      setMinLevel(String(initialItem.minLevel));
      setUnitPrice(String(initialItem.unitPrice));
      setPurchasePrice(String(initialItem.purchasePrice));
      setUnit(initialItem.unit || "Pcs");
      setDescription(initialItem.description || "");
    } else {
      setName("");
      setSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
      setCategory(ItemCategories[0]);
      setQuantity("10");
      setMinLevel("5");
      setUnitPrice("");
      setPurchasePrice("");
      setUnit("Pcs");
      setDescription("");
    }
    setErrors({});
  }, [initialItem, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Item name is required";
    if (!sku.trim()) newErrors.sku = "SKU code is required";
    if (!unitPrice || Number(unitPrice) < 0)
      newErrors.unitPrice = "Valid selling price is required";
    if (!purchasePrice || Number(purchasePrice) < 0)
      newErrors.purchasePrice = "Valid cost price is required";
    if (minLevel === "" || Number(minLevel) < 0)
      newErrors.minLevel = "Minimum alert level is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name,
      sku,
      category,
      quantity: Number(quantity) || 0,
      minLevel: Number(minLevel) || 5,
      unitPrice: Number(unitPrice),
      purchasePrice: Number(purchasePrice),
      unit,
      description,
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? "Edit Inventory Item" : "Add New Inventory Item"}
      subtitle={
        initialItem
          ? `Editing SKU ${initialItem.sku}`
          : "Register a new product with pricing and alert thresholds"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. 2D Barcode & QR Scanner USB"
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {errors.name && (
            <p className="text-xs text-rose-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* SKU & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              SKU Code *
            </label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. ELC-SCN-001"
              className="w-full px-3.5 py-2 text-sm uppercase font-mono bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {errors.sku && (
              <p className="text-xs text-rose-500 mt-1">{errors.sku}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {ItemCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Initial Stock (only on create) & Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {initialItem ? "Current Quantity" : "Initial Stock Quantity *"}
            </label>
            <input
              type="number"
              min="0"
              disabled={!!initialItem}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60"
            />
            {initialItem && (
              <p className="text-[10px] text-slate-400 mt-0.5">
                Use Stock Adjustment to modify quantity of existing items.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Unit of Measure *
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {Units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Min Level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Selling Price (₹) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="e.g. 2450"
              className="w-full px-3.5 py-2 text-sm tabular-nums bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {errors.unitPrice && (
              <p className="text-xs text-rose-500 mt-1">{errors.unitPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cost Price (₹) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="e.g. 1650"
              className="w-full px-3.5 py-2 text-sm tabular-nums bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {errors.purchasePrice && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.purchasePrice}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Min Stock Alert *
            </label>
            <input
              type="number"
              min="0"
              required
              value={minLevel}
              onChange={(e) => setMinLevel(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-3.5 py-2 text-sm tabular-nums bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {errors.minLevel && (
              <p className="text-xs text-rose-500 mt-1">{errors.minLevel}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specifications, supplier notes, or storage instructions..."
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialItem ? "Save Changes" : "Create Item"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

/**
 * Item Detail & Full Stock History Timeline Drawer
 */
function ItemDetailDrawer({ isOpen, onClose, item, movements, onAdjust, onEdit }) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={item.name}
      subtitle={`SKU: ${item.sku} • Category: ${item.category}`}
    >
      <div className="space-y-6">
        {/* Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Card hoverLift padding="none" className="p-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Quantity
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums">
              {item.quantity} {item.unit}
            </p>
          </Card>

          <Card hoverLift padding="none" className="p-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Selling Price
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums">
              {formatINR(item.unitPrice)}
            </p>
          </Card>

          <Card hoverLift padding="none" className="p-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Cost Price
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums">
              {formatINR(item.purchasePrice)}
            </p>
          </Card>

          <Card hoverLift padding="none" className="p-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Total Value
            </span>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
              {formatINR(item.quantity * item.unitPrice)}
            </p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={ArrowUpDown}
            onClick={onAdjust}
            className="flex-1"
          >
            Adjust Stock
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={onEdit}
            className="flex-1"
          >
            Edit Details
          </Button>
        </div>

        {/* Description & Thresholds */}
        <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Minimum Alert Threshold:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {item.minLevel} {item.unit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <Badge variant={item.status} size="sm" dot>
              {item.status}
            </Badge>
          </div>
          {item.description && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <span className="text-slate-400 block mb-1">Description:</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          )}
        </div>

        {/* Stock History Timeline */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-indigo-500" />
            Stock Movement History Timeline
          </h4>

          {movements.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">
              No recorded stock movements for this item yet.
            </p>
          ) : (
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {movements.map((m) => {
                const isInbound = m.quantityChange > 0;
                return (
                  <div key={m.id} className="relative flex items-start gap-3 pl-1">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold shadow-xs",
                        isInbound
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-500 text-white"
                      )}
                    >
                      {isInbound ? "+" : "-"}
                    </div>

                    <div className="flex-1 p-3 rounded-2xl bg-white dark:bg-[#12152A] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {m.type}: {m.referenceNumber}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-black tabular-nums",
                            isInbound
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          )}
                        >
                          {isInbound ? "+" : ""}
                          {m.quantityChange} {item.unit}
                        </span>
                      </div>

                      {m.reason && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {m.reason}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
                        <span>Balance after: {m.balanceAfter} {item.unit}</span>
                        <span>{formatDateTime(m.date)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export default function StockPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading inventory...</div>}>
      <StockContent />
    </React.Suspense>
  );
}
