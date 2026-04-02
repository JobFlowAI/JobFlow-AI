"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Mail,
  Settings,
  History,
  User,
  LogOut,
  Zap,
  FolderOpen,
  Loader2,
  Search,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mainNav = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/profile", label: "My Profile", icon: User },
  { path: "/dashboard/resumes", label: "My Resumes", icon: FolderOpen },
  { path: "/dashboard/jobs", label: "Find Jobs", icon: Search },
  { path: "/dashboard/resume-workspace", label: "Resume AI", icon: FileText },
  { path: "/dashboard/outreach", label: "Outreach", icon: Mail },
  { path: "/dashboard/activity", label: "Activity", icon: History },
];

const bottomNav = [
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isActive = (path: string) =>
    path === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(path);

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-transparent lg:border-border/10 bg-sidebar/50 backdrop-blur-sm">
      {/* Logo Section */}
      <SidebarHeader className="h-16 flex items-center px-4 pt-2">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-lg gradient-premium text-white flex items-center justify-center shrink-0 shadow-md">
            <Zap className="w-4 h-4" fill="currentColor" />
          </div>
          {state !== "collapsed" && (
            <span className="text-foreground font-semibold text-lg tracking-tight whitespace-nowrap">
              JobFlow AI
            </span>
          )}
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-3 py-6 gap-2">
        <SidebarMenu className="gap-1.5">
          {mainNav.map((item) => {
            const active = isActive(item.path);
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.label}
                  className={cn(
                    "flex items-center gap-3 px-3 py-5 rounded-lg transition-all duration-300 group font-medium text-[14px]",
                    active
                      ? "bg-foreground text-background shadow-md hover:bg-foreground/90 hover:text-background data-[active=true]:bg-foreground data-[active=true]:text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Link href={item.path}>
                    <item.icon
                      className={cn(
                        "w-[18px] h-[18px] shrink-0 transition-colors",
                        active ? "text-background" : "group-hover:text-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Bottom section */}
      <SidebarFooter className="px-3 pb-6 pt-2">
        <SidebarMenu className="gap-1.5">
          {bottomNav.map((item) => {
            const active = isActive(item.path);
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.label}
                  className={cn(
                    "flex items-center gap-3 px-3 py-5 rounded-lg transition-all duration-300 group font-medium text-[14px]",
                    active
                      ? "bg-foreground text-background shadow-md data-[active=true]:bg-foreground data-[active=true]:text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Link href={item.path}>
                    <item.icon
                      className={cn(
                        "w-[18px] h-[18px] shrink-0 transition-colors",
                        active ? "text-background" : "group-hover:text-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          {/* Sign out */}
          <SidebarMenuItem className="mt-2">
            <form
              action="/auth/signout"
              method="POST"
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSigningOut(true);
                try {
                  const { logout } = await import("@/app/(auth)/actions");
                  await logout();
                } catch (error) {
                  setIsSigningOut(false);
                  toast.error("Failed to sign out");
                }
              }}
              className="w-full"
            >
              <SidebarMenuButton
                tooltip="Sign Out"
                type="submit"
                disabled={isSigningOut}
                className="w-full flex items-center gap-3 px-3 py-5 rounded-lg text-[14px] font-medium text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 cursor-pointer group"
              >
                {isSigningOut ? (
                  <Loader2 className="w-[18px] h-[18px] shrink-0 animate-spin" />
                ) : (
                  <LogOut className="w-[18px] h-[18px] shrink-0 transition-colors group-hover:text-destructive-foreground" />
                )}
                <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />

      {/* Full screen sign-out loader */}
      <AnimatePresence>
        {isSigningOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-5 bg-card p-8 rounded-2xl shadow-xl border border-border/50"
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-lg font-medium text-foreground">Signing out securely...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
