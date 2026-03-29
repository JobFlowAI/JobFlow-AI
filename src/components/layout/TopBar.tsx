"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Bell,
  Search,
  LogOut,
  Settings,
  Shield,
  Check,
  Clock,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "../ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

const initialNotifications = [
  {
    id: 1,
    title: "Resume parsed successfully",
    description: "Your resume has been parsed and added to your workspace.",
    time: "2 mins ago",
    unread: true,
    type: "success",
  },
  {
    id: 2,
    title: "New Job Match found",
    description:
      "We found a new match: 'Senior Frontend Engineer' at Vercel.",
    time: "1 hour ago",
    unread: true,
    type: "info",
  },
  {
    id: 3,
    title: "ATS Analysis complete",
    description: "Your ATS score for the Google application is 85%.",
    time: "5 hours ago",
    unread: false,
    type: "success",
  },
];

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/profile": "My Profile",
  "/dashboard/resume-workspace": "Resume AI",
  "/dashboard/outreach": "Outreach",
  "/dashboard/activity": "Activity",
  "/dashboard/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
        setUserName(user.user_metadata?.full_name ?? "User");

        // Fetch avatar from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();

        if (profile?.avatar_url) {
          setUserAvatar(profile.avatar_url);
        } else if (user.user_metadata?.avatar_url) {
          setUserAvatar(user.user_metadata.avatar_url);
        }
      }
    }
    getUser();
  }, [supabase.auth]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.success("Notifications cleared");
  };

  // Build breadcrumbs
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];
  let currentPath = "";
  for (const seg of segments) {
    currentPath += `/${seg}`;
    const label = breadcrumbMap[currentPath] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
    breadcrumbs.push({ label, href: currentPath });
  }

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border/40 bg-card/80 backdrop-blur-xl flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
              )}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 pl-9 pr-10 py-2 rounded-xl bg-muted/30 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 border border-input hover:border-border focus:bg-background focus:border-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground/80 bg-background border border-border rounded px-1.5 py-0.5 shadow-sm">
            ⌘K
          </kbd>
        </div>

        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative p-2 rounded-xl hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary border-2 border-card rounded-full" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80 p-0 mt-1 rounded-xl overflow-hidden shadow-xl border-border/50"
            align="end"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/30">
              <div className="flex items-center gap-2">
                <DropdownMenuLabel className="p-0 font-semibold text-sm">
                  Notifications
                </DropdownMenuLabel>
                {unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
                >
                  <Check className="w-3 h-3" />
                  Read all
                </button>
                <button
                  onClick={clearNotifications}
                  className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors text-muted-foreground"
                  aria-label="Clear all notifications"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer focus:bg-muted/30 border-b border-border/10 last:border-0 h-auto"
                  >
                    <div
                      className={cn(
                        "mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                        n.type === "success"
                          ? "bg-success/10 text-success"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {n.type === "success" ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          n.unread ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {n.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 mt-1">
                        {n.time}
                      </p>
                    </div>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground/20 mb-3" />
                  <p className="font-medium text-foreground text-sm">
                    All caught up!
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    No new notifications.
                  </p>
                </div>
              )}
            </div>

            <div className="p-2 bg-muted/20 border-t border-border/30 text-center">
              <Link
                href="/dashboard/activity"
                className="text-xs font-medium text-primary hover:underline"
              >
                View all activity
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none" aria-label="User menu">
              <Avatar className="h-8 w-8 cursor-pointer transition-transform hover:scale-105 active:scale-95 border border-border/50">
                <AvatarImage src={userAvatar || ""} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-info/20 text-primary font-semibold text-xs uppercase">
                  {userName ? userName.slice(0, 2) : "US"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 p-1.5 mt-1 rounded-xl"
            align="end"
            forceMount
          >
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg mb-1">
              <Avatar className="h-10 w-10 border border-border/50">
                <AvatarImage src={userAvatar || ""} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-info/20 text-primary font-bold text-sm uppercase">
                  {userName ? userName.slice(0, 2) : "US"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {userName || "Dashboard User"}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {userEmail || "user@example.com"}
                </p>
              </div>
            </div>

            <Link href="/dashboard/settings">
              <DropdownMenuItem className="py-2.5 px-3 rounded-lg cursor-pointer gap-3 text-sm">
                <Settings className="w-4 h-4 text-muted-foreground" />
                Settings
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/settings?tab=security">
              <DropdownMenuItem className="py-2.5 px-3 rounded-lg cursor-pointer gap-3 text-sm">
                <Shield className="w-4 h-4 text-muted-foreground" />
                Security
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator className="my-1" />

            <form action="/auth/signout" method="POST" onSubmit={async (e) => {
              e.preventDefault();
              toast.info("Signing out...");
              const { logout } = await import("@/app/(auth)/actions");
              await logout();
            }}>
              <button 
                type="submit" 
                className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 py-2.5 px-3 cursor-pointer gap-3 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </form>

            <div className="p-2 border-t border-border/30 mt-1 flex items-center justify-center gap-3 text-[10px] text-muted-foreground/60">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
