"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search, LogOut, Settings, User, Mail, Shield, Check, Clock, Trash2 } from "lucide-react";
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

const initialNotifications = [
  {
    id: 1,
    title: "Resume parsed successfully",
    description: "Your resume 'Software_Engineer_v2.pdf' has been parsed and added to your workspace.",
    time: "2 mins ago",
    unread: true,
    type: "success"
  },
  {
    id: 2,
    title: "New Job Match found",
    description: "We found a new match for your profile: 'Senior Frontend Engineer' at Vercel.",
    time: "1 hour ago",
    unread: true,
    type: "info"
  },
  {
    id: 3,
    title: "ATS Analysis complete",
    description: "Your ATS score for the 'Google' application is 85%. View details to improve.",
    time: "5 hours ago",
    unread: false,
    type: "success"
  },
  {
    id: 4,
    title: "Account Security update",
    description: "Your password was changed successfully.",
    time: "Yesterday",
    unread: false,
    type: "info"
  }
];

export default function TopBar() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.success("Notifications cleared");
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border/50 bg-background/60 backdrop-blur-xl flex items-center justify-between px-8">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search jobs, resumes..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground border border-transparent focus:bg-background outline-none focus:ring-2 focus:ring-foreground/10 focus:border-border transition-all shadow-sm"
        />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2.5 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all group outline-none">
              <Bell className={cn("w-5 h-5 transition-transform group-hover:scale-110", unreadCount > 0 && "animate-pulse")} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full"></span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96 p-0 mt-2 rounded-2xl overflow-hidden shadow-2xl border-border/50" align="end">
            <div className="flex items-center justify-between px-5 py-4 bg-secondary/30 border-b border-border/50">
              <div className="flex items-center gap-2">
                <DropdownMenuLabel className="p-0 font-bold text-base">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
                >
                  <Check className="w-3 h-3" />
                  Read all
                </button>
                <button 
                  onClick={clearNotifications}
                  className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors text-muted-foreground"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto py-2">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <DropdownMenuItem 
                    key={n.id}
                    className="flex items-start gap-4 px-5 py-4 cursor-pointer focus:bg-secondary/50 border-b border-border/10 last:border-0 relative h-auto block"
                  >
                    <div className={cn(
                      "mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      n.type === "success" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                    )}>
                      {n.type === "success" ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 space-y-1 pr-6">
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm font-semibold", n.unread ? "text-foreground" : "text-muted-foreground")}>
                          {n.title}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {n.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1 font-medium pt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {n.time}
                      </p>
                    </div>
                    {n.unread && (
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]"></span>
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                    <Bell className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                  <p className="font-semibold text-foreground mb-1">All caught up!</p>
                  <p className="text-xs text-muted-foreground">No new notifications at the moment.</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-secondary/10 border-t border-border/50 text-center">
              <Link href="/dashboard/activity" className="text-xs font-semibold text-primary hover:underline">
                View all activity
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none">
              <Avatar className="h-9 w-9 cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-sm border border-border/50">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-tr from-primary to-primary/60 text-primary-foreground font-semibold text-sm">
                  SI
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-2 mt-2" align="end" forceMount>
            <div className="flex flex-col items-center p-6 bg-secondary/30 rounded-xl mb-2">
              <Avatar className="h-16 w-16 mb-3 border-2 border-background shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-tr from-primary to-primary/60 text-primary-foreground text-xl font-bold">
                  SI
                </AvatarFallback>
              </Avatar>
              <h3 className="text-base font-semibold text-foreground">Shahroz Imran</h3>
              <p className="text-sm text-muted-foreground mb-4">shahroz@jobflow.ai</p>
              
              <Link href="/dashboard/settings" className="w-full">
                <button className="w-full py-2.5 px-4 bg-background hover:bg-secondary border border-border rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Settings className="w-4 h-4" />
                  Manage your profile
                </button>
              </Link>
            </div>

            <div className="px-1 py-1">
              <DropdownMenuItem className="py-3 px-4 rounded-xl cursor-pointer group flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Account Security</div>
                  <div className="text-xs text-muted-foreground">Privacy & protection</div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 mx-1" />

              <DropdownMenuItem 
                onClick={() => toast.info("Signing out...")}
                className="py-3 px-4 rounded-xl cursor-pointer group flex items-center gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Sign out</span>
              </DropdownMenuItem>
            </div>

            <div className="p-3 border-t border-border mt-1 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
