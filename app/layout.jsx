import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { MobileTabBar } from "@/components/shared/MobileTabBar";
import { ToastContainer } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "StockFlow — Modern Inventory Management System",
  description:
    "StockFlow is a modern, high-precision inventory management SaaS platform with live tracking, stock history, order workflows, and analytics.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-slate-900 dark:text-slate-100 antialiased selection:bg-[#5B5BF0] selection:text-white">
        <div className="flex min-h-screen">
          {/* Collapsible Left Sidebar for Desktop */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 pb-24 sm:pb-28 md:pb-8">
            {/* Soft Glass Top Header */}
            <Navbar />

            {/* Page View with generous padding */}
            <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>

        {/* Mobile Fixed Bottom Tab Bar */}
        <MobileTabBar />

        {/* Global Toast Notification System */}
        <ToastContainer />
      </body>
    </html>
  );
}
