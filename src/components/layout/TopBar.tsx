"use client";

import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

export default function TopBar() {
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
        <button className="relative p-2.5 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors group">
          <Bell className="w-5 h-5 group-hover:scale-105 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full"></span>
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          JD
        </div>
      </div>
    </header>
  );
}
