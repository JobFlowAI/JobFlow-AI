"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, Mail, Settings, CreditCard, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Use absolute paths to prevent any nested routing 404 errors.
const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/resume-workspace", label: "Resume AI", icon: FileText },
  { path: "/dashboard/outreach", label: "Outreach Hub", icon: Mail },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }} // silky apple-like ease
      className="fixed left-0 top-0 h-screen bg-background/60 backdrop-blur-xl border-r border-border/50 flex flex-col z-50 shadow-sm"
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border/30">
        <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0 shadow-sm">
          <Zap className="w-4 h-4 text-background" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
              className="text-foreground font-bold text-lg tracking-tight whitespace-nowrap"
            >
              JobFlow AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          // Exact match for dashboard home, prefix match for nested routes
          const active = item.path === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname.startsWith(item.path);
            
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active 
                  ? "bg-foreground/5 text-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Credit Summary Box */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary border border-border/50 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-foreground/70" />
              <span className="text-sm font-semibold text-foreground/70">Credits</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">145</span>
              <span className="text-xs font-medium text-muted-foreground">/ 200</span>
            </div>
            {/* Minimal Progress Bar */}
            <div className="w-full h-1.5 bg-foreground/10 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-foreground rounded-full" style={{ width: "72%" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse Toggle Handle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-14 border-t border-border/30 text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
        aria-label="Toggle Sidebar"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
