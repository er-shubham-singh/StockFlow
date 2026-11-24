# StockFlow — Premium Modern Inventory OS

StockFlow is a modern, high-precision Inventory Management web application designed to feel like a tier-1 polished SaaS product (Linear, Stripe, Vercel-level quality). Built as an enterprise-grade trial project, it provides real-time stock balance tracking, full movement audit trails, procurement receiving workflows, sales invoicing with instant stock validation, interactive analytics, and Indian-business compliance (INR currency, GSTINs, Indian number formatting).

---

## 🌟 Key Highlights & Features

### 1. 📊 Executive Dashboard
- **Real-Time KPIs**: Animated count-up metrics for Total Stock Valuation, Total Items in Warehouse, Monthly Sales, and Pending Procurements.
- **Low Stock Priority Alerts**: Highlights items at or below minimum reorder thresholds with one-click **"Create PO"** quick actions.
- **Sales vs Procurement Trend**: Custom interactive area chart visualizing 6-month revenue inflow against purchase expenditure with custom tooltips.
- **Top Selling Products**: Ranked listing of products by sales volume and revenue generation with animated proportional bars.
- **Recent Activity Audit Feed**: Unified live feed of sales confirmations, goods receipts, and stock adjustments with relative timestamps.

### 2. 📦 Stock & Inventory Module
- **Comprehensive Catalog**: Track SKU, category, stock level, minimum alert thresholds, cost price, selling price, and stock valuation.
- **Automatic Status Calculation**: Auto-calculated status badges: `In Stock` (Emerald), `Low Stock` (Amber), `Out of Stock` (Rose).
- **Stock Movement Timeline**: Chronological audit trail for each product displaying date, transaction type (`Sale`, `Purchase`, `Adjustment`), quantity change, reference ID, and resulting running balance.
- **Manual Stock Adjustments**: Modal allowing positive or negative stock adjustments with mandatory audit reason notes (validates against negative inventory).
- **Responsive Views**: Full data table on desktop; cards on mobile.

### 3. 🛍️ Purchase Orders & Goods Receipt
- **Supplier Procurement**: Create multi-line purchase orders linked to registered suppliers with custom tax rates (18% GST).
- **Goods Receipt Workflow**: One-click **"Mark as Received"** action that automatically increases inventory quantities, writes stock movement entries, creates activity logs, and locks the order as read-only.
- **Consignment Tracking**: Monitor pending deliveries, total procurement spend, and delivery dates.

### 4. 🧾 Sales & Tax Invoicing
- **Real-Time Stock Validation**: Prevents overselling by blocking confirmed sales if requested quantities exceed current available stock with inline alerts.
- **Multi-Line Invoicing**: Dynamic line item calculation with subtotal, 18% GST, and grand total.
- **Lifecycle Workflows**: Drafts, Confirmed orders (deducts stock immediately), Paid orders, and Cancelled orders (cancelling restores deducted inventory back to warehouse stock).
- **Printable Tax Invoices**: Clean, printable invoice layout styled with proper print media rules and Indian GSTIN details.

### 5. 📈 Reports & Analytics
- **Stock Valuation Report**: Total inventory cost, selling value, potential gross margin percentage, and category breakdown charts.
- **Sales Volume Report**: Period revenue totals, invoice counts, average order values, and GST collection breakdown.
- **Procurement Spend Report**: Supplier spending breakdown and input GST metrics.
- **One-Click CSV Export**: Client-side CSV generation and download for all reports.

### 6. 👥 Business Contacts Directory
- **Institutional Customers**: Customer directory with GSTIN numbers, phone, email, and billing address.
- **Procurement Suppliers**: Vendor directory with GSTIN, contact person, and linked purchase history.

### 7. ⚡ Polish & UX Delight
- **Command Palette (`⌘K` / `Ctrl+K`)**: Global search dialog searching items, invoices, purchase orders, contacts, and quick actions.
- **Theme Engine**: Smooth toggle between Light (`#F7F8FC`) and Dark (`#0B0D17`) modes with zero layout shift.
- **Slide-In Drawers**: Forms and item details open as right-side drawers on desktop and bottom slide-up sheets on mobile.
- **Toast Notifications**: Slide-in notification system confirming every user action.
- **Reset Demo Data**: One-click restore button with confirmation to re-seed realistic sample data at any time.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: JavaScript (ES2024)
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand with `persist` middleware (`localStorage`)
- **Animations**: `framer-motion` (spring drawers, tabs, layout animations)
- **Icons**: `lucide-react`
- **Charts**: `recharts` (custom area & bar charts with responsive containers)
- **Typography**: Inter via `next/font`

---

## 🎨 Design System Tokens

| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#F7F8FC` | `#0B0D17` | Main page background |
| **Surface** | `#FFFFFF` | `#12152A` | Cards, drawers, and modal containers |
| **Primary** | `#5B5BF0` → `#8B5CF6` | `#5B5BF0` → `#8B5CF6` | Brand gradient, CTAs, active highlights |
| **Accent** | `#14B8A6` | `#14B8A6` | Teal accents, procurement highlights |
| **Success** | `#22C55E` | `#22C55E` | `In Stock`, `Paid`, `Received` badges |
| **Warning** | `#F59E0B` | `#F59E0B` | `Low Stock`, `Pending` alerts |
| **Danger** | `#EF4444` | `#EF4444` | `Out of Stock`, `Cancelled`, destructive actions |

---

## 📐 Design Decisions & Architectural Craftsmanship

1. **Centralized Business Rules**: All inventory mutation logic lives inside the central Zustand store (`lib/store.js`). Components remain clean view layers that trigger store actions.
2. **Single Source of Truth**: When a Purchase Order is received or an Invoice is confirmed, stock changes propagate across all pages (Dashboard KPI, Stock table, Low Stock panel, Sidebar badge) without full-page reloads.
3. **Optimistic Local Persistence**: Full client-side persistence via `localStorage` with SSR-safe hydration guards ensures that data persists across reloads and offline browsing.
4. **Mobile Native Feel**: Desktop navigation uses a collapsible sidebar and top glass bar; mobile transitions into a bottom tab bar with a slide-up "More" drawer. Tables switch into responsive stacked cards on viewports below `768px`.
5. **No Negative Stock Invariant**: Manual adjustments and confirmed sales enforce strict non-negative stock validation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- `pnpm`, `npm`, or `yarn`

### Installation
```bash
# Clone or navigate to the project directory
cd stockflow

# Install dependencies
pnpm install
```

### Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
# Verify build
pnpm build

# Start production server
pnpm start
```

---

## 📸 Screenshots & Layout Previews

- **Executive Dashboard**: `[KPI Cards | Sales vs PO Chart | Low Stock Alert Panel | Top Selling Products]`
- **Inventory Matrix**: `[Search & Category Filter | Available Stock vs Min Level | Stock Movement Timeline]`
- **Sales & Tax Invoices**: `[Invoice Table | Stock Validation Drawer | Printable GST Tax Invoice]`
- **Purchase Orders**: `[Procurement Table | Vendor Details | Mark as Received Workflow]`
- **Analytics & Reports**: `[Valuation Breakdown | Category Donut Chart | One-Click CSV Export]`

---

## 📄 License
MIT © 2024 StockFlow Technologies.
