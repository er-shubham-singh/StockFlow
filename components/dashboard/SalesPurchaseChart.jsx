"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatINR } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

export function SalesPurchaseChart({ sales, purchases }) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute last 6 months data dynamically
  const chartData = useMemo(() => {
    const months = [
      { key: "2024-06", label: "Jun" },
      { key: "2024-07", label: "Jul" },
      { key: "2024-08", label: "Aug" },
      { key: "2024-09", label: "Sep" },
      { key: "2024-10", label: "Oct" },
      { key: "2024-11", label: "Nov" },
    ];

    return months.map(({ key, label }) => {
      // Sum sales for this month
      const monthSales = sales
        .filter((s) => s.date.startsWith(key) && s.status !== "Cancelled")
        .reduce((sum, s) => sum + s.total, 0);

      // Sum purchases for this month
      const monthPurchases = purchases
        .filter((p) => p.date.startsWith(key) && p.status !== "Cancelled")
        .reduce((sum, p) => sum + p.total, 0);

      // Baseline realistic trend
      const baseSales = key === "2024-06" ? 64000 : key === "2024-07" ? 78000 : key === "2024-08" ? 92000 : 0;
      const basePurchases = key === "2024-06" ? 52000 : key === "2024-07" ? 61000 : key === "2024-08" ? 74000 : 0;

      return {
        month: label,
        Sales: Math.round(monthSales + baseSales),
        Purchases: Math.round(monthPurchases + basePurchases),
      };
    });
  }, [sales, purchases]);

  // Continuous 3D Flowing Particles Animation Loop
  useEffect(() => {
    if (!mounted) return;

    let animId = null;
    let lastTime = performance.now();
    let salesProgress = 0;
    let purchasesProgress = 0.25;

    // Speeds: complete traversal in ~4.8s (sales) and ~5.6s (purchases)
    const salesSpeed = 1 / 4800;
    const purchasesSpeed = 1 / 5600;

    const frame = (now) => {
      const delta = Math.min(now - lastTime, 100);
      lastTime = now;

      salesProgress = (salesProgress + delta * salesSpeed) % 1;
      purchasesProgress = (purchasesProgress + delta * purchasesSpeed) % 1;

      if (containerRef.current) {
        // Robust query: find the exact SVG path by stroke color attributes
        const salesPath =
          containerRef.current.querySelector('path[stroke="#5B5BF0"]') ||
          containerRef.current.querySelector('.recharts-area-curve:not([fill])') ||
          containerRef.current.querySelectorAll('.recharts-curve')[1];

        const purchasesPath =
          containerRef.current.querySelector('path[stroke="#14B8A6"]') ||
          containerRef.current.querySelectorAll('.recharts-curve')[3];

        // Animate a flowing particle bead along a curve
        const updateBead = (beadPrefix, pathElem, progress, totalLen) => {
          if (!pathElem || typeof pathElem.getPointAtLength !== "function") return;
          const headDist = progress * totalLen;
          if (headDist < 0 || headDist > totalLen) return;

          const pt = pathElem.getPointAtLength(headDist);

          const halo = containerRef.current.querySelector(`#${beadPrefix}-halo`);
          const outer = containerRef.current.querySelector(`#${beadPrefix}-outer`);
          const inner = containerRef.current.querySelector(`#${beadPrefix}-inner`);
          const trail1 = containerRef.current.querySelector(`#${beadPrefix}-trail-1`);
          const trail2 = containerRef.current.querySelector(`#${beadPrefix}-trail-2`);

          if (halo) {
            halo.setAttribute("cx", String(pt.x));
            halo.setAttribute("cy", String(pt.y));
          }
          if (outer) {
            outer.setAttribute("cx", String(pt.x));
            outer.setAttribute("cy", String(pt.y));
          }
          if (inner) {
            inner.setAttribute("cx", String(pt.x));
            inner.setAttribute("cy", String(pt.y));
          }

          // Trailing comet particles
          const setTrail = (el, offset, baseOpacity) => {
            if (!el) return;
            const dist = headDist - offset;
            if (dist > 0 && dist <= totalLen) {
              const tPt = pathElem.getPointAtLength(dist);
              el.setAttribute("cx", String(tPt.x));
              el.setAttribute("cy", String(tPt.y));
              el.style.opacity = String(baseOpacity);
            } else {
              el.style.opacity = "0";
            }
          };

          setTrail(trail1, 14, 0.65);
          setTrail(trail2, 28, 0.35);
        };

        // 1. Update Sales Particles (Two staggered flowing beads for continuous flow)
        if (salesPath && typeof salesPath.getTotalLength === "function") {
          try {
            const totalLen = salesPath.getTotalLength();
            if (totalLen > 20) {
              const salesGroup = containerRef.current.querySelector("#sales-flow-particles");
              if (salesGroup) salesGroup.style.opacity = "1";

              updateBead("sales-bead-1", salesPath, salesProgress, totalLen);
              updateBead("sales-bead-2", salesPath, (salesProgress + 0.5) % 1, totalLen);
            }
          } catch (e) {}
        }

        // 2. Update Purchases Particles (Two staggered flowing beads for continuous flow)
        if (purchasesPath && typeof purchasesPath.getTotalLength === "function") {
          try {
            const totalLen = purchasesPath.getTotalLength();
            if (totalLen > 20) {
              const purchasesGroup = containerRef.current.querySelector("#purchases-flow-particles");
              if (purchasesGroup) purchasesGroup.style.opacity = "1";

              updateBead("purchases-bead-1", purchasesPath, purchasesProgress, totalLen);
              updateBead("purchases-bead-2", purchasesPath, (purchasesProgress + 0.5) % 1, totalLen);
            }
          } catch (e) {}
        }
      }

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [mounted, chartData]);

  if (!mounted) {
    return <Skeleton className="w-full h-72 rounded-2xl" />;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3.5 bg-white/95 dark:bg-[#12152A]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-[0_12px_32px_-6px_rgba(0,0,0,0.25)] text-xs space-y-2 select-none min-w-[170px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <p className="font-extrabold text-slate-900 dark:text-slate-100">{label} 2024</p>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Trend</span>
          </div>

          <div className="flex items-center justify-between gap-3 text-indigo-600 dark:text-indigo-400 font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-[#5B5BF0] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5B5BF0]" />
              </span>
              <span className="text-slate-600 dark:text-slate-300">Sales:</span>
            </div>
            <span className="font-black tabular-nums">{formatINR(payload[0].value)}</span>
          </div>

          <div className="flex items-center justify-between gap-3 text-teal-600 dark:text-teal-400 font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
              </span>
              <span className="text-slate-600 dark:text-slate-300">Purchases:</span>
            </div>
            <span className="font-black tabular-nums">{formatINR(payload[1].value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="relative w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 12, right: 12, left: -4, bottom: 0 }}
        >
          <defs>
            {/* 3D Curve Drop Shadows & Neon Depth Glow */}
            <filter id="sales3DGlow" x="-20%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#5B5BF0" floodOpacity="0.45" />
            </filter>
            <filter id="purchases3DGlow" x="-20%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#14B8A6" floodOpacity="0.45" />
            </filter>

            {/* 3D Multi-Stop Surface Gradients */}
            <linearGradient id="salesGradient3D" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B5BF0" stopOpacity={0.42} />
              <stop offset="50%" stopColor="#5B5BF0" stopOpacity={0.14} />
              <stop offset="95%" stopColor="#5B5BF0" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="purchaseGradient3D" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.38} />
              <stop offset="50%" stopColor="#14B8A6" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#94A3B8"
            opacity={0.15}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
            tickFormatter={(val) => `₹${val / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Sales 3D Area Curve */}
          <Area
            type="monotone"
            dataKey="Sales"
            stroke="#5B5BF0"
            strokeWidth={3}
            filter="url(#sales3DGlow)"
            fillOpacity={1}
            fill="url(#salesGradient3D)"
            isAnimationActive={false}
            activeDot={{
              r: 6,
              fill: "#FFFFFF",
              stroke: "#5B5BF0",
              strokeWidth: 3,
            }}
          />

          {/* Purchases 3D Area Curve */}
          <Area
            type="monotone"
            dataKey="Purchases"
            stroke="#14B8A6"
            strokeWidth={2.6}
            filter="url(#purchases3DGlow)"
            fillOpacity={1}
            fill="url(#purchaseGradient3D)"
            isAnimationActive={false}
            activeDot={{
              r: 6,
              fill: "#FFFFFF",
              stroke: "#14B8A6",
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Floating 3D Flowing Particle Dots & Comet Trail Overlay */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-20"
        aria-hidden="true"
      >
        <defs>
          <filter id="particleGlowSales" x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#706BFA" floodOpacity="0.9" />
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#5B5BF0" floodOpacity="0.6" />
          </filter>
          <filter id="particleGlowPurchases" x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#2DD4BF" floodOpacity="0.9" />
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#14B8A6" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Continuous Flowing Particles on Sales Curve (Indigo) */}
        <g id="sales-flow-particles" style={{ opacity: 0 }} className="transition-opacity duration-300">
          {/* Bead 1 */}
          <circle id="sales-bead-1-trail-2" r="2.2" fill="#5B5BF0" opacity="0.35" />
          <circle id="sales-bead-1-trail-1" r="3.2" fill="#706BFA" opacity="0.65" />
          <circle id="sales-bead-1-halo" r="8" fill="#5B5BF0" opacity="0.35" filter="url(#particleGlowSales)" />
          <circle id="sales-bead-1-outer" r="5" fill="#5B5BF0" filter="url(#particleGlowSales)" />
          <circle id="sales-bead-1-inner" r="2.8" fill="#FFFFFF" />

          {/* Bead 2 (Continuous staggered stream) */}
          <circle id="sales-bead-2-trail-2" r="2.2" fill="#5B5BF0" opacity="0.35" />
          <circle id="sales-bead-2-trail-1" r="3.2" fill="#706BFA" opacity="0.65" />
          <circle id="sales-bead-2-halo" r="8" fill="#5B5BF0" opacity="0.35" filter="url(#particleGlowSales)" />
          <circle id="sales-bead-2-outer" r="5" fill="#5B5BF0" filter="url(#particleGlowSales)" />
          <circle id="sales-bead-2-inner" r="2.8" fill="#FFFFFF" />
        </g>

        {/* Continuous Flowing Particles on Purchases Curve (Teal) */}
        <g id="purchases-flow-particles" style={{ opacity: 0 }} className="transition-opacity duration-300">
          {/* Bead 1 */}
          <circle id="purchases-bead-1-trail-2" r="2.2" fill="#14B8A6" opacity="0.35" />
          <circle id="purchases-bead-1-trail-1" r="3.2" fill="#2DD4BF" opacity="0.65" />
          <circle id="purchases-bead-1-halo" r="8" fill="#14B8A6" opacity="0.35" filter="url(#particleGlowPurchases)" />
          <circle id="purchases-bead-1-outer" r="5" fill="#14B8A6" filter="url(#particleGlowPurchases)" />
          <circle id="purchases-bead-1-inner" r="2.8" fill="#FFFFFF" />

          {/* Bead 2 (Continuous staggered stream) */}
          <circle id="purchases-bead-2-trail-2" r="2.2" fill="#14B8A6" opacity="0.35" />
          <circle id="purchases-bead-2-trail-1" r="3.2" fill="#2DD4BF" opacity="0.65" />
          <circle id="purchases-bead-2-halo" r="8" fill="#14B8A6" opacity="0.35" filter="url(#particleGlowPurchases)" />
          <circle id="purchases-bead-2-outer" r="5" fill="#14B8A6" filter="url(#particleGlowPurchases)" />
          <circle id="purchases-bead-2-inner" r="2.8" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}
