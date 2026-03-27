import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

export default function TopBar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search jobs, resumes..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
        />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
          JD
        </div>
      </div>
    </header>
  );
}
