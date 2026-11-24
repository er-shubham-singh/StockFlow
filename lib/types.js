/**
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} sku
 * @property {string} name
 * @property {string} category
 * @property {number} quantity
 * @property {number} minLevel
 * @property {number} unitPrice
 * @property {number} purchasePrice
 * @property {'In Stock' | 'Low Stock' | 'Out of Stock'} status
 * @property {string} description
 * @property {string} [unit]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Customer
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} company
 * @property {string} gstin
 * @property {string} city
 * @property {string} address
 */

/**
 * @typedef {Object} Supplier
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} company
 * @property {string} gstin
 * @property {string} city
 * @property {string} address
 */

/**
 * @typedef {Object} OrderLineItem
 * @property {string} itemId
 * @property {string} sku
 * @property {string} name
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} total
 */

/**
 * @typedef {Object} SalesOrder
 * @property {string} id
 * @property {string} invoiceNo
 * @property {string} customerId
 * @property {string} customerName
 * @property {string} date
 * @property {OrderLineItem[]} items
 * @property {number} subtotal
 * @property {number} taxRate // e.g. 18 for 18% GST
 * @property {number} taxAmount
 * @property {number} total
 * @property {'Draft' | 'Confirmed' | 'Paid' | 'Cancelled'} status
 * @property {string} [notes]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} PurchaseOrder
 * @property {string} id
 * @property {string} poNo
 * @property {string} supplierId
 * @property {string} supplierName
 * @property {string} date
 * @property {OrderLineItem[]} items
 * @property {number} subtotal
 * @property {number} taxRate
 * @property {number} taxAmount
 * @property {number} total
 * @property {'Pending' | 'Received' | 'Cancelled'} status
 * @property {string} [receivedAt]
 * @property {string} [notes]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} StockMovement
 * @property {string} id
 * @property {string} itemId
 * @property {string} itemName
 * @property {string} itemSku
 * @property {string} date
 * @property {'Purchase' | 'Sale' | 'Adjustment'} type
 * @property {number} quantityChange // positive for inbound, negative for outbound
 * @property {number} balanceAfter
 * @property {string} referenceNumber // e.g. INV-1001, PO-2001, ADJ-001
 * @property {string} [reason]
 */

/**
 * @typedef {Object} Activity
 * @property {string} id
 * @property {string} timestamp
 * @property {'sale_created' | 'sale_confirmed' | 'sale_cancelled' | 'purchase_created' | 'purchase_received' | 'stock_adjusted' | 'item_created'} type
 * @property {string} title
 * @property {string} description
 * @property {string} [referenceId]
 * @property {'sales' | 'purchase' | 'stock'} module
 */

export const ItemCategories = [
  "Electronics",
  "Office Supplies",
  "Packaging",
  "Raw Materials",
  "Hardware & Tools",
];

export const Units = ["Pcs", "Boxes", "Kg", "Meters", "Sets", "Rolls"];
