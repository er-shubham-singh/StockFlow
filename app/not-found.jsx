"use client";

import React from "react";
import Link from "next/link";
import { PackageX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B5BF0] dark:text-[#8B5CF6] flex items-center justify-center mb-6 shadow-sm">
        <PackageX className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md leading-relaxed">
        The inventory page, order, or document you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Link href="/">
          <Button variant="primary" icon={ArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
