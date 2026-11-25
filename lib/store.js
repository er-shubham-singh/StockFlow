import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  SEED_ITEMS,
  SEED_CUSTOMERS,
  SEED_SUPPLIERS,
  SEED_SALES,
  SEED_PURCHASES,
  SEED_STOCK_MOVEMENTS,
  SEED_ACTIVITIES,
  SEED_WAREHOUSES,
  SEED_TRANSFERS,
} from "@/data/seed";

function calculateItemStatus(quantity, minLevel) {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= minLevel) return "Low Stock";
  return "In Stock";
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme & UI state
      theme: "light",
      sidebarCollapsed: false,
      isMounted: false,

      // Core entities
      items: SEED_ITEMS,
      customers: SEED_CUSTOMERS,
      suppliers: SEED_SUPPLIERS,
      sales: SEED_SALES,
      purchases: SEED_PURCHASES,
      stockMovements: SEED_STOCK_MOVEMENTS,
      activities: SEED_ACTIVITIES,
      warehouses: SEED_WAREHOUSES,
      transfers: SEED_TRANSFERS,

      // Toast notifications
      toasts: [],

      // Premium Action Loader
      actionLoading: false,
      actionLoadingMessage: "",
      setActionLoading: (loading, message = "Processing...") =>
        set({ actionLoading: loading, actionLoadingMessage: message }),
      triggerAction: async (actionFn, message = "Processing...") => {
        set({ actionLoading: true, actionLoadingMessage: message });
        const start = Date.now();
        try {
          const res = await actionFn();
          const elapsed = Date.now() - start;
          if (elapsed < 350) {
            await new Promise((r) => setTimeout(r, 350 - elapsed));
          }
          return res;
        } finally {
          set({ actionLoading: false, actionLoadingMessage: "" });
        }
      },

      // Actions: Theme & UI
      setMounted: () => set({ isMounted: true }),
      toggleTheme: () => {
        const nextTheme = get().theme === "dark" ? "light" : "dark";
        if (typeof document !== "undefined") {
          if (nextTheme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        set({ theme: nextTheme });
      },
      setTheme: (theme) => {
        if (typeof document !== "undefined") {
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        set({ theme });
      },
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Actions: Toasts
      addToast: ({ title, message, type = "info", duration = 4000 }) => {
        const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
        const newToast = { id, title, message, type };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
        return id;
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      // Reset Demo Data
      resetDemoData: () => {
        set({
          items: SEED_ITEMS,
          customers: SEED_CUSTOMERS,
          suppliers: SEED_SUPPLIERS,
          sales: SEED_SALES,
          purchases: SEED_PURCHASES,
          stockMovements: SEED_STOCK_MOVEMENTS,
          activities: SEED_ACTIVITIES,
          warehouses: SEED_WAREHOUSES,
          transfers: SEED_TRANSFERS,
        });
        get().addToast({
          title: "Demo Data Reset",
          message: "All items, orders, and activity have been restored to initial defaults.",
          type: "success",
        });
      },

      // Actions: Stock & Items
      addItem: (itemData) => {
        const now = new Date().toISOString();
        const quantity = Number(itemData.quantity) || 0;
        const minLevel = Number(itemData.minLevel) || 5;
        const status = calculateItemStatus(quantity, minLevel);
        const newItem = {
          id: "item-" + Date.now().toString().slice(-6),
          sku: itemData.sku.toUpperCase().trim(),
          name: itemData.name.trim(),
          category: itemData.category || "General",
          quantity,
          minLevel,
          unitPrice: Number(itemData.unitPrice) || 0,
          purchasePrice: Number(itemData.purchasePrice) || 0,
          unit: itemData.unit || "Pcs",
          status,
          description: itemData.description || "",
          createdAt: now,
          updatedAt: now,
        };

        const movements = [...get().stockMovements];
        if (quantity > 0) {
          movements.unshift({
            id: "mov-" + Date.now(),
            itemId: newItem.id,
            itemName: newItem.name,
            itemSku: newItem.sku,
            date: now,
            type: "Adjustment",
            quantityChange: quantity,
            balanceAfter: quantity,
            referenceNumber: "INIT-" + newItem.sku,
            reason: "Initial inventory setup",
          });
        }

        const activities = [
          {
            id: "act-" + Date.now(),
            timestamp: now,
            type: "item_created",
            title: `Item Created: ${newItem.name}`,
            description: `SKU ${newItem.sku} added with ${quantity} ${newItem.unit} in stock.`,
            referenceId: newItem.id,
            module: "stock",
          },
          ...get().activities,
        ];

        set({
          items: [newItem, ...get().items],
          stockMovements: movements,
          activities,
        });

        get().addToast({
          title: "Item Added",
          message: `${newItem.name} (${newItem.sku}) created successfully.`,
          type: "success",
        });

        return newItem;
      },

      updateItem: (id, itemData) => {
        const now = new Date().toISOString();
        const items = get().items.map((item) => {
          if (item.id === id) {
            const minLevel = Number(itemData.minLevel ?? item.minLevel);
            const status = calculateItemStatus(item.quantity, minLevel);
            return {
              ...item,
              ...itemData,
              minLevel,
              unitPrice: Number(itemData.unitPrice ?? item.unitPrice),
              purchasePrice: Number(itemData.purchasePrice ?? item.purchasePrice),
              status,
              updatedAt: now,
            };
          }
          return item;
        });

        set({ items });
        get().addToast({
          title: "Item Updated",
          message: "Product details updated successfully.",
          type: "success",
        });
      },

      deleteItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        set({
          items: get().items.filter((i) => i.id !== id),
        });
        get().addToast({
          title: "Item Deleted",
          message: `${item.name} removed from inventory.`,
          type: "info",
        });
      },

      adjustStock: (itemId, quantityChange, reason = "Manual adjustment") => {
        const item = get().items.find((i) => i.id === itemId);
        if (!item) return { success: false, error: "Item not found" };

        const change = Number(quantityChange);
        if (isNaN(change) || change === 0) {
          return { success: false, error: "Invalid quantity change" };
        }

        const newBalance = item.quantity + change;
        if (newBalance < 0) {
          get().addToast({
            title: "Adjustment Failed",
            message: `Cannot reduce stock below 0. Current stock is ${item.quantity}.`,
            type: "error",
          });
          return { success: false, error: "Stock cannot be negative" };
        }

        const now = new Date().toISOString();
        const newStatus = calculateItemStatus(newBalance, item.minLevel);

        const updatedItems = get().items.map((it) =>
          it.id === itemId
            ? { ...it, quantity: newBalance, status: newStatus, updatedAt: now }
            : it
        );

        const movement = {
          id: "mov-" + Date.now(),
          itemId: item.id,
          itemName: item.name,
          itemSku: item.sku,
          date: now,
          type: "Adjustment",
          quantityChange: change,
          balanceAfter: newBalance,
          referenceNumber: "ADJ-" + Math.floor(1000 + Math.random() * 9000),
          reason,
        };

        const activity = {
          id: "act-" + Date.now(),
          timestamp: now,
          type: "stock_adjusted",
          title: `Stock Adjusted: ${item.name}`,
          description: `Changed by ${change > 0 ? "+" + change : change} ${item.unit}. New balance: ${newBalance}. Reason: ${reason}`,
          referenceId: item.id,
          module: "stock",
        };

        set({
          items: updatedItems,
          stockMovements: [movement, ...get().stockMovements],
          activities: [activity, ...get().activities],
        });

        get().addToast({
          title: "Stock Adjusted",
          message: `${item.name} stock updated to ${newBalance} ${item.unit}.`,
          type: "success",
        });

        return { success: true };
      },

      // Actions: Purchase Orders
      createPurchaseOrder: (poData) => {
        const now = new Date().toISOString();
        const count = get().purchases.length + 1;
        const poNo = poData.poNo || `PO-2024-${String(count).padStart(3, "0")}`;

        const items = poData.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          total: Number(item.quantity) * Number(item.unitPrice),
        }));

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const taxRate = poData.taxRate !== undefined ? Number(poData.taxRate) : 18;
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount;

        const newPO = {
          id: "po-" + Date.now().toString().slice(-6),
          poNo,
          supplierId: poData.supplierId,
          supplierName: poData.supplierName,
          date: poData.date || now.split("T")[0],
          items,
          subtotal,
          taxRate,
          taxAmount,
          total,
          status: "Pending",
          notes: poData.notes || "",
          createdAt: now,
        };

        const activity = {
          id: "act-" + Date.now(),
          timestamp: now,
          type: "purchase_created",
          title: `PO Created: ${poNo}`,
          description: `Purchase order of ₹${Math.round(total).toLocaleString("en-IN")} raised with ${poData.supplierName}.`,
          referenceId: newPO.id,
          module: "purchase",
        };

        set({
          purchases: [newPO, ...get().purchases],
          activities: [activity, ...get().activities],
        });

        get().addToast({
          title: "Purchase Order Created",
          message: `${poNo} raised with ${poData.supplierName}.`,
          type: "success",
        });

        return newPO;
      },

      receivePurchaseOrder: (poId) => {
        const po = get().purchases.find((p) => p.id === poId);
        if (!po) return { success: false, error: "Purchase Order not found" };
        if (po.status === "Received") {
          get().addToast({
            title: "Already Received",
            message: `${po.poNo} was already received.`,
            type: "warning",
          });
          return { success: false, error: "Already received" };
        }

        const now = new Date().toISOString();
        const currentItems = [...get().items];
        const newMovements = [];

        // Increase stock for each line item
        po.items.forEach((lineItem) => {
          const itemIndex = currentItems.findIndex((it) => it.id === lineItem.itemId);
          if (itemIndex >= 0) {
            const currentItem = currentItems[itemIndex];
            const newQty = currentItem.quantity + lineItem.quantity;
            const newStatus = calculateItemStatus(newQty, currentItem.minLevel);

            currentItems[itemIndex] = {
              ...currentItem,
              quantity: newQty,
              status: newStatus,
              updatedAt: now,
            };

            newMovements.push({
              id: "mov-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
              itemId: currentItem.id,
              itemName: currentItem.name,
              itemSku: currentItem.sku,
              date: now,
              type: "Purchase",
              quantityChange: lineItem.quantity,
              balanceAfter: newQty,
              referenceNumber: po.poNo,
              reason: `PO ${po.poNo} received from ${po.supplierName}`,
            });
          }
        });

        // Update PO status to Received
        const updatedPurchases = get().purchases.map((p) =>
          p.id === poId ? { ...p, status: "Received", receivedAt: now } : p
        );

        const activity = {
          id: "act-" + Date.now(),
          timestamp: now,
          type: "purchase_received",
          title: `PO Received: ${po.poNo}`,
          description: `Consignment from ${po.supplierName} verified. Stock increased for ${po.items.length} item(s).`,
          referenceId: po.id,
          module: "purchase",
        };

        set({
          items: currentItems,
          purchases: updatedPurchases,
          stockMovements: [...newMovements, ...get().stockMovements],
          activities: [activity, ...get().activities],
        });

        get().addToast({
          title: "Goods Received",
          message: `${po.poNo} marked as received. Stock quantities increased.`,
          type: "success",
        });

        return { success: true };
      },

      cancelPurchaseOrder: (poId) => {
        const po = get().purchases.find((p) => p.id === poId);
        if (!po) return;
        if (po.status === "Received") {
          get().addToast({
            title: "Cannot Cancel",
            message: "Cannot cancel an order that has already been received.",
            type: "error",
          });
          return;
        }

        const now = new Date().toISOString();
        const updatedPurchases = get().purchases.map((p) =>
          p.id === poId ? { ...p, status: "Cancelled" } : p
        );

        const activity = {
          id: "act-" + Date.now(),
          timestamp: now,
          type: "purchase_created",
          title: `PO Cancelled: ${po.poNo}`,
          description: `Purchase order ${po.poNo} was cancelled.`,
          referenceId: po.id,
          module: "purchase",
        };

        set({
          purchases: updatedPurchases,
          activities: [activity, ...get().activities],
        });

        get().addToast({
          title: "Order Cancelled",
          message: `${po.poNo} has been cancelled.`,
          type: "info",
        });
      },

      // Actions: Sales Orders
      createSaleOrder: (saleData) => {
        const now = new Date().toISOString();
        const count = get().sales.length + 1;
        const invoiceNo = saleData.invoiceNo || `INV-2024-${String(count).padStart(3, "0")}`;

        const items = saleData.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          total: Number(item.quantity) * Number(item.unitPrice),
        }));

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const taxRate = saleData.taxRate !== undefined ? Number(saleData.taxRate) : 18;
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount;
        const status = saleData.status || "Draft";

        // If status is 'Confirmed', validate stock availability first!
        if (status === "Confirmed") {
          for (const lineItem of items) {
            const stockItem = get().items.find((i) => i.id === lineItem.itemId);
            if (!stockItem || stockItem.quantity < lineItem.quantity) {
              const available = stockItem ? stockItem.quantity : 0;
              get().addToast({
                title: "Insufficient Stock",
                message: `Cannot confirm sale. Only ${available} units of "${lineItem.name}" available in stock.`,
                type: "error",
              });
              return { success: false, error: `Insufficient stock for ${lineItem.name}` };
            }
          }
        }

        const newSale = {
          id: "so-" + Date.now().toString().slice(-6),
          invoiceNo,
          customerId: saleData.customerId,
          customerName: saleData.customerName,
          date: saleData.date || now.split("T")[0],
          items,
          subtotal,
          taxRate,
          taxAmount,
          total,
          status,
          notes: saleData.notes || "",
          createdAt: now,
        };

        // If Confirmed immediately, deduct stock and add movements
        let currentItems = [...get().items];
        let newMovements = [];

        if (status === "Confirmed") {
          items.forEach((lineItem) => {
            const idx = currentItems.findIndex((it) => it.id === lineItem.itemId);
            if (idx >= 0) {
              const currentItem = currentItems[idx];
              const newQty = currentItem.quantity - lineItem.quantity;
              const newStatus = calculateItemStatus(newQty, currentItem.minLevel);

              currentItems[idx] = {
                ...currentItem,
                quantity: newQty,
                status: newStatus,
                updatedAt: now,
              };

              newMovements.push({
                id: "mov-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
                itemId: currentItem.id,
                itemName: currentItem.name,
                itemSku: currentItem.sku,
                date: now,
                type: "Sale",
                quantityChange: -lineItem.quantity,
                balanceAfter: newQty,
                referenceNumber: invoiceNo,
                reason: `Order fulfilled for ${saleData.customerName}`,
              });
            }
          });
        }

        const activity = {
          id: "act-" + Date.now(),
          timestamp: now,
          type: status === "Confirmed" ? "sale_confirmed" : "sale_created",
          title: `Invoice ${status}: ${invoiceNo}`,
          description: `Sale of ₹${Math.round(total).toLocaleString("en-IN")} created for ${saleData.customerName}.`,
          referenceId: newSale.id,
          module: "sales",
        };

        set({
          items: currentItems,
          sales: [newSale, ...get().sales],
          stockMovements: [...newMovements, ...get().stockMovements],
          activities: [activity, ...get().activities],
        });

        get().addToast({
          title: `Invoice ${status}`,
          message: `${invoiceNo} created for ${saleData.customerName}.`,
          type: "success",
        });

        return { success: true, sale: newSale };
      },

      confirmSaleOrder: (saleId) => {
        const sale = get().sales.find((s) => s.id === saleId);
        if (!sale) return { success: false, error: "Invoice not found" };
        if (sale.status === "Confirmed" || sale.status === "Paid") {
          return { success: false, error: "Sale already confirmed" };
        }

        // Validate stock for all line items
        for (const lineItem of sale.items) {
          const item = get().items.find((i) => i.id === lineItem.itemId);
          if (!item || item.quantity < lineItem.quantity) {
            const available = item ? item.quantity : 0;
            get().addToast({
              title: "Stock Insufficient",
              message: `Cannot confirm sale. Only ${available} unit(s) of "${lineItem.name}" available.`,
              type: "error",
            });
            return { success: false, error: `Insufficient stock for ${lineItem.name}` };
          }
        }

        const now = new Date().toISOString();
        const currentItems = [...get().items];
        const newMovements = [];

        sale.items.forEach((lineItem) => {
          const idx = currentItems.findIndex((it) => it.id === lineItem.itemId);
          if (idx >= 0) {
            const currentItem = currentItems[idx];
            const newQty = currentItem.quantity - lineItem.quantity;
            const newStatus = calculateItemStatus(newQty, currentItem.minLevel);

            currentItems[idx] = {
              ...currentItem,
              quantity: newQty,
              status: newStatus,
              updatedAt: now,
            };

            newMovements.push({
              id: "mov-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
              itemId: currentItem.id,
              itemName: currentItem.name,
              itemSku: currentItem.sku,
              date: now,
              type: "Sale",
              quantityChange: -lineItem.quantity,
              balanceAfter: newQty,
              referenceNumber: sale.invoiceNo,
              reason: `Order confirmed for ${sale.customerName}`,
            });
          }
        });

        const updatedSales = get().sales.map((s) =>
          s.id === saleId ? { ...s, status: "Confirmed" } : s
        );

        const activity = {
          id: "act-" + Date.now(),
          timestamp: now,
          type: "sale_confirmed",
          title: `Sale Confirmed: ${sale.invoiceNo}`,
          description: `Confirmed order for ${sale.customerName}. Stock deducted for ${sale.items.length} item(s).`,
          referenceId: sale.id,
          module: "sales",
        };

        set({
          items: currentItems,
          sales: updatedSales,
          stockMovements: [...newMovements, ...get().stockMovements],
          activities: [activity, ...get().activities],
        });

        get().addToast({
          title: "Sale Confirmed",
          message: `${sale.invoiceNo} confirmed. Inventory updated.`,
          type: "success",
        });

        return { success: true };
      },

      markSaleAsPaid: (saleId) => {
        const sale = get().sales.find((s) => s.id === saleId);
        if (!sale) return;

        // If it was draft, confirm first to deduct stock
        if (sale.status === "Draft") {
          const confirmRes = get().confirmSaleOrder(saleId);
          if (!confirmRes?.success) return;
        }

        const now = new Date().toISOString();
        const updatedSales = get().sales.map((s) =>
          s.id === saleId ? { ...s, status: "Paid" } : s
        );

        const activity = {
          id: "act-" + Date.now(),
          timestamp: now,
          type: "sale_confirmed",
          title: `Invoice Paid: ${sale.invoiceNo}`,
          description: `Payment received in full for invoice ${sale.invoiceNo}.`,
          referenceId: sale.id,
          module: "sales",
        };

        set({
          sales: updatedSales,
          activities: [activity, ...get().activities],
        });

        get().addToast({
          title: "Payment Received",
          message: `${sale.invoiceNo} marked as Paid.`,
          type: "success",
        });
      },

      cancelSaleOrder: (saleId) => {
        const sale = get().sales.find((s) => s.id === saleId);
        if (!sale) return;
        if (sale.status === "Cancelled") return;

        const now = new Date().toISOString();
        let currentItems = [...get().items];
        let newMovements = [];

        // Workflow rule: Cancelling a confirmed/paid sale restores stock!
        if (sale.status === "Confirmed" || sale.status === "Paid") {
          sale.items.forEach((lineItem) => {
            const idx = currentItems.findIndex((it) => it.id === lineItem.itemId);
            if (idx >= 0) {
              const currentItem = currentItems[idx];
              const restoredQty = currentItem.quantity + lineItem.quantity;
              const newStatus = calculateItemStatus(restoredQty, currentItem.minLevel);

              currentItems[idx] = {
                ...currentItem,
                quantity: restoredQty,
                status: newStatus,
                updatedAt: now,
              };

              newMovements.push({
                id: "mov-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
                itemId: currentItem.id,
                itemName: currentItem.name,
                itemSku: currentItem.sku,
                date: now,
                type: "Adjustment",
                quantityChange: lineItem.quantity,
                balanceAfter: restoredQty,
                referenceNumber: sale.invoiceNo,
                reason: `Stock restored due to cancelled sale ${sale.invoiceNo}`,
              });
            }
          });
        }

        const updatedSales = get().sales.map((s) =>
          s.id === saleId ? { ...s, status: "Cancelled" } : s
        );

        const activity = {
          id: "act-" + Date.now(),
          timestamp: now,
          type: "sale_cancelled",
          title: `Sale Cancelled: ${sale.invoiceNo}`,
          description: `Invoice cancelled. ${
            sale.status === "Confirmed" || sale.status === "Paid"
              ? "Stock was restored back to inventory."
              : ""
          }`,
          referenceId: sale.id,
          module: "sales",
        };

        set({
          items: currentItems,
          sales: updatedSales,
          stockMovements: [...newMovements, ...get().stockMovements],
          activities: [activity, ...get().activities],
        });

        get().addToast({
          title: "Sale Cancelled",
          message: `${sale.invoiceNo} cancelled. Stock quantities restored.`,
          type: "info",
        });
      },

      // Customers & Suppliers CRUD
      addCustomer: (customer) => {
        const newCustomer = {
          id: "cust-" + Date.now().toString().slice(-4),
          ...customer,
        };
        set({ customers: [newCustomer, ...get().customers] });
        get().addToast({
          title: "Customer Added",
          message: `${customer.company || customer.name} added to contacts.`,
          type: "success",
        });
        return newCustomer;
      },

      addSupplier: (supplier) => {
        const newSupplier = {
          id: "sup-" + Date.now().toString().slice(-4),
          ...supplier,
        };
        set({ suppliers: [newSupplier, ...get().suppliers] });
        get().addToast({
          title: "Supplier Added",
          message: `${supplier.company || supplier.name} added to suppliers.`,
          type: "success",
        });
        return newSupplier;
      },

      // Warehouse & Godown Actions
      addWarehouse: (whData) => {
        const newWarehouse = {
          id: "wh-" + Date.now().toString().slice(-4),
          code: whData.code || "WH-NEW-" + Math.floor(10 + Math.random() * 90),
          name: whData.name,
          type: whData.type || "Regional Depot",
          city: whData.city || "",
          address: whData.address || "",
          manager: whData.manager || "",
          contact: whData.contact || "",
          capacityUnits: Number(whData.capacityUnits) || 20000,
          utilizedUnits: 0,
          status: "Active",
        };
        set({ warehouses: [newWarehouse, ...get().warehouses] });
        get().addToast({
          title: "Godown Created",
          message: `${newWarehouse.name} registered successfully.`,
          type: "success",
        });
        return newWarehouse;
      },

      createTransfer: (transferData) => {
        const now = new Date().toISOString();
        const count = get().transfers.length + 1;
        const transferNo = transferData.transferNo || `TRF-2024-${String(count).padStart(3, "0")}`;
        const qty = Number(transferData.quantity) || 1;

        const item = get().items.find((i) => i.id === transferData.itemId);
        const itemName = item ? item.name : transferData.itemName || "Inventory Item";
        const itemSku = item ? item.sku : transferData.itemSku || "SKU-GEN";

        const newTransfer = {
          id: "trf-" + Date.now().toString().slice(-6),
          transferNo,
          fromWarehouse: transferData.fromWarehouse,
          toWarehouse: transferData.toWarehouse,
          itemId: transferData.itemId,
          itemName,
          itemSku,
          quantity: qty,
          date: transferData.date || now.split("T")[0],
          status: transferData.status || "Completed",
          reason: transferData.reason || "Inter-godown rebalancing",
          carrier: transferData.carrier || "Fleet Logistics Transit",
          createdAt: now,
        };

        const movement = {
          id: "mov-" + Date.now(),
          itemId: transferData.itemId,
          itemName,
          itemSku,
          date: now,
          type: "Transfer",
          quantityChange: 0,
          balanceAfter: item ? item.quantity : qty,
          referenceNumber: transferNo,
          reason: `Transferred ${qty} ${item ? item.unit : "units"} from ${transferData.fromWarehouse} to ${transferData.toWarehouse}`,
        };

        const activity = {
          id: "act-" + Date.now(),
          timestamp: now,
          type: "stock_transferred",
          title: `Stock Transfer: ${transferNo}`,
          description: `Dispatched ${qty} ${item ? item.unit : "units"} of ${itemName} from ${transferData.fromWarehouse} to ${transferData.toWarehouse}.`,
          referenceId: newTransfer.id,
          module: "warehouse",
        };

        set({
          transfers: [newTransfer, ...get().transfers],
          stockMovements: [movement, ...get().stockMovements],
          activities: [activity, ...get().activities],
        });

        get().addToast({
          title: "Stock Transfer Recorded",
          message: `${transferNo} booked: ${qty} units dispatched to ${transferData.toWarehouse}.`,
          type: "success",
        });

        return newTransfer;
      },

      updateTransferStatus: (transferId, status) => {
        const updated = get().transfers.map((t) =>
          t.id === transferId ? { ...t, status } : t
        );
        set({ transfers: updated });
        get().addToast({
          title: "Transfer Status Updated",
          message: `Stock transfer status set to ${status}.`,
          type: "info",
        });
      },
    }),
    {
      name: "stockflow-storage-v1",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        items: state.items,
        customers: state.customers,
        suppliers: state.suppliers,
        sales: state.sales,
        purchases: state.purchases,
        stockMovements: state.stockMovements,
        activities: state.activities,
        warehouses: state.warehouses,
        transfers: state.transfers,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
