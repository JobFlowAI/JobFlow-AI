"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Mail,
  Settings,
  Zap,
  History,
  User,
  LogOut,
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

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) =>
    path === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      {/* Logo Section */}
      <SidebarHeader className="h-16 border-b border-border/30 flex items-center px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </div>
          {state !== "collapsed" && (
            <span className="text-foreground font-bold text-base tracking-tight whitespace-nowrap">
              JobFlow AI
            </span>
          )}
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {mainNav.map((item) => {
            const active = isActive(item.path);
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    active
                      ? "bg-muted text-foreground font-semibold shadow-sm border border-border/50"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium border border-transparent"
                  }`}
                >
                  <Link href={item.path}>
                    <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Bottom section */}
      <SidebarFooter className="px-3 pb-3 border-t border-border/30 pt-3">
        <SidebarMenu>
          {bottomNav.map((item) => {
            const active = isActive(item.path);
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    active
                      ? "bg-muted text-foreground font-semibold shadow-sm border border-border/50"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium border border-transparent"
                  }`}
                >
                  <Link href={item.path}>
                    <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          {/* Sign out */}
          <SidebarMenuItem>
            <form action="/auth/signout" method="POST" onSubmit={async (e) => {
              e.preventDefault();
              toast.info("Signing out...");
              const { logout } = await import("@/app/(auth)/actions");
              await logout();
            }} className="w-full">
              <SidebarMenuButton
                tooltip="Sign Out"
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
              >
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
