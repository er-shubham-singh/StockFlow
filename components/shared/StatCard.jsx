"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Icon3D } from "@/components/ui/Icon3D";
import { cn } from "@/lib/utils";

/**
 * Animated number component that rolls up smoothly
 */
function CountUp({ end, prefix = "", suffix = "", isCurrency = false }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 850; // ms
    const startValue = 0;
    const target = Number(end) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * easedProgress);
      setDisplayValue(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [end]);

  const formatted = isCurrency
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(displayValue)
    : new Intl.NumberFormat("en-IN").format(displayValue);

  return (
    <span className="tabular-nums font-bold tracking-tight">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function StatCard({
  title,
  value,
  isCurrency = false,
  prefix,
  suffix,
  trend,
  trendDirection = "up", // 'up' | 'down' | 'neutral'
  trendLabel = "vs last month",
  icon: Icon,
  iconColor = "text-[#5B5BF0] bg-indigo-50 dark:bg-indigo-950/40",
  subtitle,
  onClick,
  iconVariant,
  iconName,
}) {
  const resolvedVariant =
    iconVariant ||
    (iconColor?.includes("emerald") || iconColor?.includes("green")
      ? "emerald"
      : iconColor?.includes("teal")
      ? "teal"
      : iconColor?.includes("amber") || iconColor?.includes("yellow")
      ? "amber"
      : iconColor?.includes("rose") || iconColor?.includes("red")
      ? "rose"
      : "primary");

  return (
    <Card
      hoverLift={true}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden group border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 transition-all duration-300 ease-out hover:border-indigo-500/30 dark:hover:border-indigo-500/30",
        onClick ? "cursor-pointer" : "cursor-default"
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
          {title}
        </span>
        {Icon && (
          <Icon3D
            icon={Icon}
            iconName={
              iconName ||
              (title?.toLowerCase().includes("pending") || title?.toLowerCase().includes("purchase")
                ? "Clock"
                : title?.toLowerCase().includes("sale")
                ? "TrendingUp"
                : title?.toLowerCase().includes("valuation") || title?.toLowerCase().includes("value")
                ? "Boxes"
                : title?.toLowerCase().includes("catalog") || title?.toLowerCase().includes("item")
                ? "Package"
                : Icon?.displayName || Icon?.name)
            }
            variant={resolvedVariant}
            size="md"
            shape="squircle"
            animate={true}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl text-slate-900 dark:text-slate-50 font-black tracking-tight">
          <CountUp end={value} prefix={prefix} suffix={suffix} isCurrency={isCurrency} />
        </div>

        {(trend || trendLabel || subtitle) && (
          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center font-bold px-1.5 py-0.5 rounded-md transition-colors",
                  trendDirection === "up"
                    ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : trendDirection === "down"
                    ? "text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400"
                    : "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                {trendDirection === "up" ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : trendDirection === "down" ? (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5 mr-0.5" />
                )}
                {trend}
              </span>
            )}
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              {subtitle || trendLabel}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
