"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  FileText,
  ShoppingBag,
  Users,
  Building,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export function GlobalSearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const items = useAppStore((state) => state.items);
  const sales = useAppStore((state) => state.sales);
  const purchases = useAppStore((state) => state.purchases);
  const customers = useAppStore((state) => state.customers);
  const suppliers = useAppStore((state) => state.suppliers);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const cleanQuery = query.toLowerCase().trim();

  const matchingItems = cleanQuery
    ? items
        .filter(
          (i) =>
            i.name.toLowerCase().includes(cleanQuery) ||
            i.sku.toLowerCase().includes(cleanQuery) ||
            i.category.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 4)
    : [];

  const matchingSales = cleanQuery
    ? sales
        .filter(
          (s) =>
            s.invoiceNo.toLowerCase().includes(cleanQuery) ||
            s.customerName.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  const matchingPurchases = cleanQuery
    ? purchases
        .filter(
          (p) =>
            p.poNo.toLowerCase().includes(cleanQuery) ||
            p.supplierName.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  const matchingContacts = cleanQuery
    ? [
        ...customers
          .filter(
            (c) =>
              c.name.toLowerCase().includes(cleanQuery) ||
              c.company.toLowerCase().includes(cleanQuery)
          )
          .map((c) => ({ ...c, type: "Customer" })),
        ...suppliers
          .filter(
            (s) =>
              s.name.toLowerCase().includes(cleanQuery) ||
              s.company.toLowerCase().includes(cleanQuery)
          )
          .map((s) => ({ ...s, type: "Supplier" })),
      ].slice(0, 3)
    : [];

  const hasResults =
    matchingItems.length > 0 ||
    matchingSales.length > 0 ||
    matchingPurchases.length > 0 ||
    matchingContacts.length > 0;

  const navigateTo = (path) => {
    onClose();
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 sm:pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#12152A] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl z-10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items, invoices, POs, contacts, or SKU..."
                className="w-full bg-transparent text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
                ESC
              </kbd>
            </div>

            {/* Results or Quick Actions */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {!cleanQuery ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
                    Quick Navigation & Actions
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => navigateTo("/stock?action=new")}
                      className="flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-[#5B5BF0] group-hover:scale-105 transition-transform">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                          Add New Stock Item
                        </p>
                        <p className="text-[11px] text-slate-400">Inventory & products</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo("/sales?action=new")}
                      className="flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                          Create Sales Invoice
                        </p>
                        <p className="text-[11px] text-slate-400">New customer sale</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo("/purchase?action=new")}
                      className="flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 group-hover:scale-105 transition-transform">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                          Raise Purchase Order
                        </p>
                        <p className="text-[11px] text-slate-400">Restock from supplier</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo("/reports")}
                      className="flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 group-hover:scale-105 transition-transform">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                          View Reports & Analytics
                        </p>
                        <p className="text-[11px] text-slate-400">Sales, Stock & PO data</p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : hasResults ? (
                <div className="space-y-4">
                  {/* Matching Items */}
                  {matchingItems.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center justify-between">
                        <span>Items ({matchingItems.length})</span>
                      </p>
                      <div className="space-y-1">
                        {matchingItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => navigateTo(`/stock?view=${item.id}`)}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Package className="w-4 h-4 text-slate-400 shrink-0" />
                              <div className="truncate">
                                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                  {item.name}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {item.sku} • {item.category}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant={item.status} size="sm">
                                {item.quantity} {item.unit}
                              </Badge>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {formatINR(item.unitPrice)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Sales */}
                  {matchingSales.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                        Invoices ({matchingSales.length})
                      </p>
                      <div className="space-y-1">
                        {matchingSales.map((sale) => (
                          <div
                            key={sale.id}
                            onClick={() => navigateTo(`/sales?view=${sale.id}`)}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                              <div className="truncate">
                                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                  {sale.invoiceNo} • {sale.customerName}
                                </p>
                                <p className="text-[11px] text-slate-400">{sale.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant={sale.status} size="sm">
                                {sale.status}
                              </Badge>
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {formatINR(sale.total)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Purchases */}
                  {matchingPurchases.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                        Purchase Orders ({matchingPurchases.length})
                      </p>
                      <div className="space-y-1">
                        {matchingPurchases.map((po) => (
                          <div
                            key={po.id}
                            onClick={() => navigateTo(`/purchase?view=${po.id}`)}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <ShoppingBag className="w-4 h-4 text-teal-500 shrink-0" />
                              <div className="truncate">
                                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                  {po.poNo} • {po.supplierName}
                                </p>
                                <p className="text-[11px] text-slate-400">{po.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant={po.status} size="sm">
                                {po.status}
                              </Badge>
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {formatINR(po.total)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Contacts */}
                  {matchingContacts.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                        Contacts ({matchingContacts.length})
                      </p>
                      <div className="space-y-1">
                        {matchingContacts.map((contact) => (
                          <div
                            key={contact.id}
                            onClick={() => navigateTo(`/contacts`)}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {contact.type === "Customer" ? (
                                <Users className="w-4 h-4 text-indigo-500 shrink-0" />
                              ) : (
                                <Building className="w-4 h-4 text-teal-500 shrink-0" />
                              )}
                              <div className="truncate">
                                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                  {contact.company || contact.name}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {contact.name} • {contact.city}
                                </p>
                              </div>
                            </div>
                            <Badge variant="default" size="sm">
                              {contact.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try searching for item SKU, invoice number, or customer name.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span>Navigate:</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">↓</kbd>
              </div>
              <div className="flex items-center gap-1">
                <span>Select:</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">↵</kbd>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
