"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mb-6 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
        Something went wrong
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
        {error?.message || "An unexpected error occurred while processing inventory data."}
      </p>
      <div className="mt-6">
        <Button variant="primary" icon={RotateCcw} onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
