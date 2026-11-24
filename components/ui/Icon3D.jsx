"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  TrendingUp,
  Boxes,
  Package,
  ShoppingBag,
  FileText,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Truck,
  MoreHorizontal,
  RotateCcw,
  Activity,
  CreditCard,
  Users,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 1. Animated Watch Icon - Clock hands / "sui" circulate 360 degrees continuously
 */
function AnimatedClockIcon({ className }) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 select-none",
        className
      )}
    >
      {/* 1. Base Clock Face SVG (Dial, cardinal ticks, luxury corner pips) */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-white"
      >
        {/* Outer Dial Face */}
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.2" />

        {/* 12, 3, 6, 9 Cardinal Ticks */}
        <line x1="12" y1="3.2" x2="12" y2="5.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        <line x1="20.8" y1="12" x2="18.2" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        <line x1="12" y1="20.8" x2="12" y2="18.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        <line x1="3.2" y1="12" x2="5.8" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />

        {/* Corner Hour Dots at 1:30, 4:30, 7:30, 10:30 */}
        <circle cx="17.4" cy="6.6" r="0.75" fill="currentColor" opacity="0.7" stroke="none" />
        <circle cx="17.4" cy="17.4" r="0.75" fill="currentColor" opacity="0.7" stroke="none" />
        <circle cx="6.6" cy="17.4" r="0.75" fill="currentColor" opacity="0.7" stroke="none" />
        <circle cx="6.6" cy="6.6" r="0.75" fill="currentColor" opacity="0.7" stroke="none" />
      </svg>

      {/* 2. Slow Hour Hand - slowly moves 360 degrees around center */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none animate-clock-hour-sui"
        style={{ transformOrigin: "50% 50%" }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
          <line
            x1="12"
            y1="12"
            x2="12"
            y2="7.2"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* 3. The Minute "Sui" Needle - continuously circulates 360 degrees smoothly around the dial */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none animate-clock-sui"
        style={{ transformOrigin: "50% 50%" }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
          {/* Main needle shaft */}
          <line
            x1="12"
            y1="12.5"
            x2="12"
            y2="3.8"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Needle tip indicator (arrowhead / bead) */}
          <circle cx="12" cy="4.5" r="1.4" fill="#FFFFFF" stroke="none" />
          {/* Subtle counterweight below center */}
          <line
            x1="12"
            y1="12"
            x2="12"
            y2="14"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* 4. Center Pivot Rivet Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-white shadow-sm border border-amber-600/80 z-20 pointer-events-none flex items-center justify-center">
        <div className="w-[1.5px] h-[1.5px] rounded-full bg-amber-600" />
      </div>
    </div>
  );
}

/**
 * 2. Animated Graph / TrendingUp Icon - Draws graph path continuously from start to end
 */
function AnimatedTrendingUpIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Background ghost track */}
      <polyline
        points="1 18 8.5 10.5 13.5 15.5 23 6"
        stroke="currentColor"
        opacity="0.25"
        strokeDasharray="2 2"
      />

      {/* Graph line that draws from start (bottom-left) to end (top-right) continuously */}
      <motion.path
        d="M1 18 L8.5 10.5 L13.5 15.5 L23 6"
        stroke="currentColor"
        strokeWidth="2.6"
        animate={{
          pathLength: [0, 1, 1, 0],
          pathOffset: [0, 0, 0, 1],
          opacity: [0.35, 1, 1, 0.35],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.65, 0.85, 1],
        }}
      />

      {/* Glowing tracer dot racing along the graph path */}
      <motion.circle
        r="2.2"
        fill="#FFFFFF"
        stroke="currentColor"
        strokeWidth="1"
        animate={{
          cx: [1, 8.5, 13.5, 23, 1],
          cy: [18, 10.5, 15.5, 6, 18],
          opacity: [0, 1, 1, 1, 0],
          scale: [0.8, 1.2, 1, 1.3, 0.8],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.45, 0.65, 1],
        }}
      />

      {/* Arrowhead at peak (23, 6) that pulses on arrival */}
      <motion.polyline
        points="17 6 23 6 23 12"
        stroke="currentColor"
        strokeWidth="2.6"
        animate={{
          scale: [0.85, 1.25, 0.85],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "23px 6px", transformBox: "view-box" }}
      />
    </svg>
  );
}

/**
 * 3. Animated Boxes Icon - 3D isometric inventory cubes with top box floating/settling
 */
function AnimatedBoxesIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Bottom Left Cube */}
      <g>
        <path d="M2.5 13.5L7 11L11.5 13.5L7 16L2.5 13.5Z" />
        <path d="M2.5 13.5V18.5L7 21V16" />
        <path d="M11.5 13.5V18.5L7 21" />
      </g>
      {/* Bottom Right Cube */}
      <g>
        <path d="M12.5 13.5L17 11L21.5 13.5L17 16L12.5 13.5Z" />
        <path d="M12.5 13.5V18.5L17 21V16" />
        <path d="M21.5 13.5V18.5L17 21" />
      </g>
      {/* Top 3D Cube that hovers up and down onto the stack */}
      <motion.g
        animate={{
          y: [0, -3.5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <path d="M7.5 4.5L12 2L16.5 4.5L12 7L7.5 4.5Z" fill="currentColor" fillOpacity="0.3" />
        <path d="M7.5 4.5V9.5L12 12V7" />
        <path d="M16.5 4.5V9.5L12 12" />
      </motion.g>
    </svg>
  );
}

/**
 * 4. Animated Package Icon - Delivery box with 3D isometric wobble and pulsing tape
 */
function AnimatedPackageIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.g
        animate={{
          rotateY: [0, 8, -8, 0],
          y: [0, -2, 0],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <path d="M16.5 9.4 7.55 4.24" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />

        {/* Isometric 3D Flap / tape line with breathing glow */}
        <motion.path
          d="M8.5 7.5L12 9.5L15.5 7.5"
          strokeWidth="2.5"
          animate={{
            opacity: [0.4, 1, 0.4],
            y: [0, -1, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.g>
    </svg>
  );
}

/**
 * 5. Animated BarChart3 Icon - Equalizer style rising and falling data bars
 */
function AnimatedBarChartIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Ghost base track */}
      <line x1="18" y1="20" x2="18" y2="10" strokeOpacity="0.25" />
      <line x1="12" y1="20" x2="12" y2="4" strokeOpacity="0.25" />
      <line x1="6" y1="20" x2="6" y2="14" strokeOpacity="0.25" />

      {/* Bar 1 */}
      <motion.line
        x1="6"
        y1="20"
        x2="6"
        y2="14"
        style={{ originY: "20px" }}
        animate={{ scaleY: [0.35, 1, 0.35] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />
      {/* Bar 2 (Tall) */}
      <motion.line
        x1="12"
        y1="20"
        x2="12"
        y2="4"
        style={{ originY: "20px" }}
        animate={{ scaleY: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Bar 3 */}
      <motion.line
        x1="18"
        y1="20"
        x2="18"
        y2="10"
        style={{ originY: "20px" }}
        animate={{ scaleY: [0.3, 1, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
    </svg>
  );
}

/**
 * 6. Animated ShoppingBag Icon - Bag with swinging handle and item shimmer
 */
function AnimatedShoppingBagIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />

      {/* Handle swaying side to side */}
      <motion.path
        d="M16 10a4 4 0 0 1-8 0"
        style={{ originX: "12px", originY: "10px" }}
        animate={{
          rotate: [-12, 12, -12],
          scaleY: [1, 1.1, 1],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
}

/**
 * 7. Animated FileText Icon - Document whose invoice lines write sequentially
 */
function AnimatedFileTextIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />

      {/* Line 1 writing across */}
      <motion.line
        x1="8"
        y1="13"
        x2="16"
        y2="13"
        animate={{
          pathLength: [0, 1, 1, 0],
          opacity: [0.3, 1, 1, 0.3],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />
      {/* Line 2 writing across */}
      <motion.line
        x1="8"
        y1="17"
        x2="13"
        y2="17"
        animate={{
          pathLength: [0, 1, 1, 0],
          opacity: [0.3, 1, 1, 0.3],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
      />
    </svg>
  );
}

/**
 * 8. Animated AlertTriangle Icon - Warning triangle with pulsing hazard beacon
 */
function AnimatedAlertTriangleIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      {/* Exclamation stem pulsing */}
      <motion.line
        x1="12"
        y1="9"
        x2="12"
        y2="13"
        animate={{
          scaleY: [1, 1.25, 1],
          strokeWidth: [2, 2.8, 2],
        }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originY: "11px" }}
      />
      {/* Exclamation dot pulsing */}
      <motion.circle
        cx="12"
        cy="17"
        r="1"
        fill="currentColor"
        stroke="none"
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/**
 * 9. Animated Layers Icon - Multilevel stock layers floating in perspective
 */
function AnimatedLayersIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      {/* Middle Layer */}
      <motion.path
        d="m2 12 8.58 3.91a2 2 0 0 0 1.66 0L21 12"
        animate={{ y: [0, 1.6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom Layer */}
      <motion.path
        d="m2 17 8.58 3.91a2 2 0 0 0 1.66 0L21 17"
        animate={{ y: [0, 2.6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
    </svg>
  );
}

/**
 * 10. Animated Truck Icon - Delivery van with spinning wheels
 */
function AnimatedTruckIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Truck Body with subtle road suspension bounce */}
      <motion.g
        animate={{ y: [0, -0.6, 0] }}
        transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      </motion.g>

      {/* Spinning Front Wheel */}
      <g className="animate-wheel-front" style={{ transformOrigin: "7px 18px", transformBox: "view-box" }}>
        <circle cx="7" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 2" />
        <circle cx="7" cy="18" r="0.6" fill="currentColor" stroke="none" />
      </g>
      {/* Spinning Rear Wheel */}
      <g className="animate-wheel-rear" style={{ transformOrigin: "17px 18px", transformBox: "view-box" }}>
        <circle cx="17" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 2" />
        <circle cx="17" cy="18" r="0.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/**
 * 11. Animated CheckCircle2 Icon - Checkmark that draws in with satisfaction pulse
 */
function AnimatedCheckCircleIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <motion.path
        d="m9 12 2 2 4-4"
        animate={{
          pathLength: [0, 1, 1, 0],
          opacity: [0.4, 1, 1, 0.4],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/**
 * 12. Animated MoreHorizontal Icon - 3 rhythmically bouncing dots
 */
function AnimatedMoreIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.circle
        cx="5"
        cy="12"
        r="1.5"
        fill="currentColor"
        animate={{ y: [0, -2.5, 0], scale: [1, 1.25, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="1.5"
        fill="currentColor"
        animate={{ y: [0, -2.5, 0], scale: [1, 1.25, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.circle
        cx="19"
        cy="12"
        r="1.5"
        fill="currentColor"
        animate={{ y: [0, -2.5, 0], scale: [1, 1.25, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
    </svg>
  );
}

/**
 * 13. Animated Activity Icon - Live pulse wave tracking across
 */
function AnimatedActivityIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.path
        d="M22 12h-4l-3 9L9 3l-3 9H2"
        animate={{
          pathLength: [0, 1, 1, 0],
          pathOffset: [0, 0, 0, 1],
          opacity: [0.35, 1, 1, 0.35],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/**
 * 14. Animated RotateCcw Icon - Smooth circulating reset loop
 */
function AnimatedRotateCcwIcon({ className }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      animate={{ rotate: -360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </motion.svg>
  );
}

/**
 * 15. Animated CreditCard Icon - Chip glow and swipe shimmer
 */
function AnimatedCreditCardIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
      {/* Shimmering magnetic strip / chip */}
      <motion.line
        x1="6"
        y1="14"
        x2="10"
        y2="14"
        strokeWidth="2.5"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/**
 * 16. Animated Users Icon - Customer avatars with subtle synchronized wave
 */
function AnimatedUsersIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <motion.circle
        cx="9"
        cy="7"
        r="4"
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M22 21v-2a4 4 0 0 0-3-3.87"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M16 3.13a4 4 0 0 1 0 7.75"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/**
 * 17. Animated Dashboard Icon - Quadrant tiles popping in rhythm
 */
function AnimatedDashboardIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.rect
        width="7"
        height="9"
        x="3"
        y="3"
        rx="1"
        animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
        style={{ originX: "6.5px", originY: "7.5px" }}
      />
      <motion.rect
        width="7"
        height="5"
        x="14"
        y="3"
        rx="1"
        animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        style={{ originX: "17.5px", originY: "5.5px" }}
      />
      <motion.rect
        width="7"
        height="9"
        x="14"
        y="12"
        rx="1"
        animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        style={{ originX: "17.5px", originY: "16.5px" }}
      />
      <motion.rect
        width="7"
        height="5"
        x="3"
        y="16"
        rx="1"
        animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        style={{ originX: "6.5px", originY: "18.5px" }}
      />
    </svg>
  );
}

/**
 * Premium 3D Bevelled Icon with Specular Gloss, Layered Depth, and Continuous Internal Motion
 */
export function Icon3D({
  icon: Icon,
  iconName,
  variant = "primary", // 'primary' | 'teal' | 'emerald' | 'amber' | 'rose' | 'slate'
  size = "md", // 'sm' | 'md' | 'lg' | 'xl' | 'orb'
  shape = "circle", // 'circle' | 'squircle'
  animate = true, // Continuous gentle 3D float & breathing animation
  glow = true,
  className,
  iconClassName,
  badge,
  onClick,
  ...props
}) {
  const variantStyles = {
    primary: {
      gradient: "bg-gradient-to-b from-[#706BFA] via-[#5B5BF0] to-[#4542D8]",
      shadow: "shadow-[0_10px_22px_-3px_rgba(91,91,240,0.48),inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2.5px_3.5px_rgba(0,0,0,0.28)]",
      glowColor: "bg-[#5B5BF0]/30",
    },
    teal: {
      gradient: "bg-gradient-to-b from-[#2DD4BF] via-[#14B8A6] to-[#0D9488]",
      shadow: "shadow-[0_10px_22px_-3px_rgba(20,184,166,0.48),inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2.5px_3.5px_rgba(0,0,0,0.28)]",
      glowColor: "bg-[#14B8A6]/30",
    },
    emerald: {
      gradient: "bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#059669]",
      shadow: "shadow-[0_10px_22px_-3px_rgba(16,185,129,0.48),inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2.5px_3.5px_rgba(0,0,0,0.28)]",
      glowColor: "bg-[#10B981]/30",
    },
    amber: {
      gradient: "bg-gradient-to-b from-[#FBBF24] via-[#F59E0B] to-[#D97706]",
      shadow: "shadow-[0_10px_22px_-3px_rgba(245,158,11,0.48),inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2.5px_3.5px_rgba(0,0,0,0.28)]",
      glowColor: "bg-[#F59E0B]/30",
    },
    rose: {
      gradient: "bg-gradient-to-b from-[#F87171] via-[#EF4444] to-[#DC2626]",
      shadow: "shadow-[0_10px_22px_-3px_rgba(239,68,68,0.48),inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-2.5px_3.5px_rgba(0,0,0,0.28)]",
      glowColor: "bg-[#EF4444]/30",
    },
    slate: {
      gradient: "bg-gradient-to-b from-[#94A3B8] via-[#64748B] to-[#475569]",
      shadow: "shadow-[0_10px_22px_-3px_rgba(100,116,139,0.48),inset_0_2px_2px_rgba(255,255,255,0.5),inset_0_-2.5px_3.5px_rgba(0,0,0,0.28)]",
      glowColor: "bg-[#64748B]/30",
    },
  };

  const sizeStyles = {
    sm: {
      container: "w-8 h-8",
      icon: "w-4 h-4",
      highlight: "before:h-3.5 after:w-1.5 after:h-1.5",
    },
    md: {
      container: "w-10 h-10",
      icon: "w-5 h-5",
      highlight: "before:h-4 after:w-2 after:h-2",
    },
    lg: {
      container: "w-12 h-12",
      icon: "w-6 h-6",
      highlight: "before:h-5 after:w-2.5 after:h-2.5",
    },
    xl: {
      container: "w-14 h-14",
      icon: "w-7 h-7",
      highlight: "before:h-6 after:w-3 after:h-3",
    },
    orb: {
      container: "w-10 h-10",
      icon: "w-5 h-5",
      highlight: "before:h-4 after:w-2 after:h-2",
    },
  };

  const v = variantStyles[variant] || variantStyles.primary;
  const s = sizeStyles[size] || sizeStyles.md;
  const roundedClass = shape === "circle" ? "rounded-full" : "rounded-2xl";

  const motionProps = animate
    ? {
        animate: {
          y: [0, -3.5, 0],
          rotate: [0, 1.2, -1.2, 0],
        },
        transition: {
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }
    : {};

  const iconClass = cn(
    "relative z-10 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.38)]",
    s.icon,
    iconClassName
  );

  // Match icon component or name to specialized continuous animated SVG
  const renderAnimatedIcon = () => {
    const rawTargetName = iconName || Icon?.displayName || Icon?.name || "";
    const targetName = typeof rawTargetName === "string" ? rawTargetName.toLowerCase() : "";

    if (
      Icon === Clock ||
      targetName === "clock" ||
      targetName === "watch" ||
      targetName.includes("clock") ||
      targetName.includes("watch")
    ) {
      return <AnimatedClockIcon className={iconClass} />;
    }
    if (Icon === TrendingUp || targetName === "trendingup" || targetName.includes("trending")) {
      return <AnimatedTrendingUpIcon className={iconClass} />;
    }
    if (Icon === Boxes || targetName === "boxes") {
      return <AnimatedBoxesIcon className={iconClass} />;
    }
    if (Icon === Package || targetName === "package") {
      return <AnimatedPackageIcon className={iconClass} />;
    }
    if (Icon === BarChart3 || targetName === "barchart3" || targetName.includes("chart")) {
      return <AnimatedBarChartIcon className={iconClass} />;
    }
    if (Icon === ShoppingBag || targetName === "shoppingbag" || targetName.includes("bag")) {
      return <AnimatedShoppingBagIcon className={iconClass} />;
    }
    if (Icon === FileText || targetName === "filetext" || targetName.includes("file")) {
      return <AnimatedFileTextIcon className={iconClass} />;
    }
    if (Icon === AlertTriangle || targetName === "alerttriangle" || targetName.includes("alert")) {
      return <AnimatedAlertTriangleIcon className={iconClass} />;
    }
    if (Icon === Layers || targetName === "layers") {
      return <AnimatedLayersIcon className={iconClass} />;
    }
    if (Icon === Truck || targetName === "truck") {
      return <AnimatedTruckIcon className={iconClass} />;
    }
    if (Icon === CheckCircle2 || targetName === "checkcircle2" || targetName.includes("check")) {
      return <AnimatedCheckCircleIcon className={iconClass} />;
    }
    if (Icon === MoreHorizontal || targetName === "morehorizontal" || targetName.includes("more")) {
      return <AnimatedMoreIcon className={iconClass} />;
    }
    if (Icon === Activity || targetName === "activity") {
      return <AnimatedActivityIcon className={iconClass} />;
    }
    if (Icon === RotateCcw || targetName === "rotateccw" || targetName.includes("rotate")) {
      return <AnimatedRotateCcwIcon className={iconClass} />;
    }
    if (Icon === CreditCard || targetName === "creditcard" || targetName.includes("credit")) {
      return <AnimatedCreditCardIcon className={iconClass} />;
    }
    if (Icon === Users || targetName === "users") {
      return <AnimatedUsersIcon className={iconClass} />;
    }
    if (Icon === LayoutDashboard || targetName === "layoutdashboard" || targetName.includes("dashboard")) {
      return <AnimatedDashboardIcon className={iconClass} />;
    }
    if (Icon === Sun || targetName === "sun") {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <Icon className={iconClass} />
        </motion.div>
      );
    }
    if (Icon === Moon || targetName === "moon") {
      return (
        <motion.div
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className={iconClass} />
        </motion.div>
      );
    }

    // Default fallback with continuous 3D breathing pulse
    if (Icon) {
      return (
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon className={iconClass} />
        </motion.div>
      );
    }

    return null;
  };

  return (
    <motion.div
      {...motionProps}
      onClick={onClick}
      className={cn("relative inline-flex items-center justify-center shrink-0 select-none", className)}
      {...props}
    >
      {/* Ambient Pulsing Glow Halo */}
      {glow && (
        <div
          className={cn(
            "absolute -inset-1 rounded-full blur-md opacity-70 pointer-events-none animate-pulse",
            v.glowColor
          )}
        />
      )}

      {/* Main 3D Sphere / Squircle Body */}
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden border border-white/25",
          roundedClass,
          s.container,
          v.gradient,
          v.shadow,
          "before:absolute before:inset-x-1.5 before:top-0.5 before:rounded-t-full before:bg-gradient-to-b before:from-white/60 before:to-transparent before:pointer-events-none",
          "after:absolute after:top-1.5 after:left-2 after:rounded-full after:bg-white/70 after:blur-[0.5px] after:pointer-events-none",
          s.highlight
        )}
      >
        {/* Subtle diagonal specular shine layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Dynamic 3D Animated Icon */}
        {renderAnimatedIcon()}
      </div>

      {/* Optional Badge (e.g. Low Stock Count) */}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 z-20 px-1.5 py-0.2 min-w-[18px] text-center text-[10px] font-black rounded-full bg-rose-500 text-white shadow-[0_2px_6px_rgba(239,68,68,0.6)] border-2 border-white dark:border-[#12152A]">
          {badge}
        </span>
      )}
    </motion.div>
  );
}
