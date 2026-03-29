"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Mail,
  Settings,
  Zap,
  ChevronLeft,
  History,
  User,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainNav = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/profile", label: "My Profile", icon: User },
  { path: "/dashboard/resume-workspace", label: "Resume AI", icon: FileText },
  { path: "/dashboard/outreach", label: "Outreach", icon: Mail },
  { path: "/dashboard/activity", label: "Activity", icon: History },
];

const bottomNav = [
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function AppSidebar({ collapsed, setCollapsed }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(path);

  const NavButton = ({
    item,
  }: {
    item: { path: string; label: string; icon: React.ComponentType<{ className?: string }> };
  }) => {
    const active = isActive(item.path);
    const button = (
      <Link
        href={item.path}
        prefetch={true}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 group relative outline-none no-underline ${
          active
            ? "bg-muted text-foreground font-semibold shadow-sm border border-border/50"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium border border-transparent"
        }`}
      >
        <item.icon
          className={`w-[18px] h-[18px] shrink-0 ${
            active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
          }`}
        />
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
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={12} className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider>
      <motion.aside
        animate={{ width: collapsed ? 72 : 252 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="fixed left-0 top-0 h-screen bg-card border-r border-border/40 flex flex-col z-50"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border/30 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8, transition: { duration: 0.1 } }}
                className="text-foreground font-bold text-base tracking-tight whitespace-nowrap"
              >
                JobFlow AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {mainNav.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-3 space-y-0.5 border-t border-border/30 pt-3">
          {bottomNav.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}

          {/* Sign out */}
          <form action="/auth/signout" method="POST" onSubmit={async (e) => {
            e.preventDefault();
            const { logout } = await import("@/app/(auth)/actions");
            await logout();
          }}>
            {collapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
                  >
                    <LogOut className="w-[18px] h-[18px] shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12} className="font-medium">
                  Sign Out
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
              >
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                <span>Sign Out</span>
              </button>
            )}
          </form>
        </div>

        {/* Floating collapse button - positioned on the edge */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all z-50"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </motion.aside>
    </TooltipProvider>
  );
}
