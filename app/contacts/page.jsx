"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Building,
  Plus,
  Mail,
  Phone,
  MapPin,
  FileText,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { SearchInput } from "@/components/ui/SearchInput";
import { PageHeader } from "@/components/shared/PageHeader";
import { motion } from "framer-motion";
import {
  PageTransition,
  cardStaggerVariants,
  cardItemVariants,
} from "@/components/shared/PageTransition";

export default function ContactsPage() {
  const router = useRouter();
  const { customers, suppliers, sales, purchases, addCustomer, addSupplier } =
    useAppStore();

  const [activeTab, setActiveTab] = useState("customers"); // 'customers' | 'suppliers'
  const [search, setSearch] = useState("");
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  // Form states for adding contact
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.gstin.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      (s) =>
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.company.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        s.gstin.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (activeTab === "customers") {
      addCustomer({ name, company, email, phone, gstin, city, address });
    } else {
      addSupplier({ name, company, email, phone, gstin, city, address });
    }
    setAddDrawerOpen(false);
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setGstin("");
    setCity("");
    setAddress("");
  };

  return (
    <PageTransition className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Business Contacts"
        description="Manage verified GSTIN-compliant business profiles for institutional customers and procurement vendors."
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setAddDrawerOpen(true)}
          >
            Add {activeTab === "customers" ? "Customer" : "Supplier"}
          </Button>
        }
      />

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-2xl bg-white dark:bg-[#12152A] border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/70 dark:bg-slate-900/60 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("customers")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all",
              activeTab === "customers"
                ? "bg-white dark:bg-[#12152A] text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Users className="w-4 h-4 text-[#5B5BF0]" />
            Customers ({customers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("suppliers")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all",
              activeTab === "suppliers"
                ? "bg-white dark:bg-[#12152A] text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Building className="w-4 h-4 text-teal-500" />
            Suppliers ({suppliers.length})
          </button>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={`Search ${activeTab}...`}
          className="w-full sm:w-64"
        />
      </div>

      {/* CUSTOMERS GRID */}
      {activeTab === "customers" && (
        <motion.div
          variants={cardStaggerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filteredCustomers.map((c) => {
            const customerSales = sales.filter((s) => s.customerId === c.id);
            const totalSpend = customerSales
              .filter((s) => s.status !== "Cancelled")
              .reduce((sum, s) => sum + s.total, 0);

            return (
              <motion.div variants={cardItemVariants} key={c.id} className="flex">
                <Card hoverLift className="p-5 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                          {c.company || c.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Contact: <span className="font-semibold text-slate-700 dark:text-slate-300">{c.name}</span>
                        </p>
                      </div>
                      <Badge variant="primary" size="sm">
                        {customerSales.length} Orders
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 my-3 py-3 border-y border-slate-100 dark:border-slate-800/80">
                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400">GSTIN:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{c.gstin}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{c.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Invoiced:</span>
                      <span className="font-black text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                        {formatINR(totalSpend)}
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      icon={FileText}
                      onClick={() => router.push(`/sales?action=new`)}
                    >
                      New Sale
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* SUPPLIERS GRID */}
      {activeTab === "suppliers" && (
        <motion.div
          variants={cardStaggerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filteredSuppliers.map((s) => {
            const supplierPOs = purchases.filter((p) => p.supplierId === s.id);
            const totalProcured = supplierPOs
              .filter((p) => p.status !== "Cancelled")
              .reduce((sum, p) => sum + p.total, 0);

            return (
              <motion.div variants={cardItemVariants} key={s.id} className="flex">
                <Card hoverLift className="p-5 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                          {s.company || s.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          City: <span className="font-semibold text-slate-700 dark:text-slate-300">{s.city}</span>
                        </p>
                      </div>
                      <Badge variant="Received" size="sm">
                        {supplierPOs.length} POs
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 my-3 py-3 border-y border-slate-100 dark:border-slate-800/80">
                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400">GSTIN:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{s.gstin}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{s.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Procurement:</span>
                      <span className="font-black text-sm text-teal-600 dark:text-teal-400 tabular-nums">
                        {formatINR(totalProcured)}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={ShoppingBag}
                      onClick={() => router.push(`/purchase?action=new`)}
                    >
                      Raise PO
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Add Contact Drawer */}
      <Drawer
        isOpen={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        title={`Add New ${activeTab === "customers" ? "Customer" : "Supplier"}`}
        subtitle="Register business identity and tax identification details"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Company / Business Name *
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Apex Infotech Solutions Pvt Ltd"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Contact Person Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@apexinfotech.in"
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98201 45890"
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GSTIN Number *
              </label>
              <input
                type="text"
                required
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="27AADCA1234M1Z5"
                className="w-full px-3.5 py-2 text-sm font-mono uppercase bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City & State *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai, Maharashtra"
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Physical Address *
            </label>
            <textarea
              rows="2"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#12152A] border border-slate-200 dark:border-slate-800 rounded-xl resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <Button variant="outline" onClick={() => setAddDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save {activeTab === "customers" ? "Customer" : "Supplier"}
            </Button>
          </div>
        </form>
      </Drawer>
    </PageTransition>
  );
}
