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
  Hexagon,
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

  const isActive = (path: string) =>
    path === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(path);

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-transparent lg:border-border/10 bg-sidebar/50 backdrop-blur-sm">
      {/* Logo Section */}
      <SidebarHeader className="h-16 flex items-center px-4 pt-2">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shrink-0">
            <Hexagon className="w-5 h-5 text-background fill-background" />
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
                toast.info("Signing out...");
                const { logout } = await import("@/app/(auth)/actions");
                await logout();
              }}
              className="w-full"
            >
              <SidebarMenuButton
                tooltip="Sign Out"
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-5 rounded-lg text-[14px] font-medium text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 cursor-pointer group"
              >
                <LogOut className="w-[18px] h-[18px] shrink-0 transition-colors group-hover:text-destructive-foreground" />
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
