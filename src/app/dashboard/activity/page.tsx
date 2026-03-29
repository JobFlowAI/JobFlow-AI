"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Search, 
  Filter, 
  Check, 
  Clock, 
  Briefcase, 
  FileText, 
  Shield, 
  ChevronRight,
  TrendingUp,
  Zap,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const initialActivities = [
  {
    id: 1,
    title: "Resume parsed successfully",
    description: "Your resume 'Software_Engineer_v2.pdf' has been parsed and added to your workspace.",
    time: "2 mins ago",
    date: "Mar 28, 2026",
    unread: true,
    category: "Credits",
    credits: -2,
    type: "success"
  },
  {
    id: 2,
    title: "New Job Match found",
    description: "We found a new match for your profile: 'Senior Frontend Engineer' at Vercel.",
    time: "1 hour ago",
    date: "Mar 28, 2026",
    unread: true,
    category: "Jobs",
    type: "info"
  },
  {
    id: 3,
    title: "ATS Analysis complete",
    description: "Your ATS score for the 'Google' application is 85%. Review details to improve.",
    time: "5 hours ago",
    date: "Mar 28, 2026",
    unread: false,
    category: "Credits",
    credits: -2,
    type: "success"
  },
  {
    id: 4,
    title: "Credits Topped Up",
    description: "Successfully added 50 credits to your account via Pro Plan renewal.",
    time: "Yesterday",
    date: "Mar 27, 2026",
    unread: false,
    category: "Credits",
    credits: 50,
    type: "success"
  },
  {
    id: 5,
    title: "Account Security update",
    description: "Your password was changed successfully from a recognized device.",
    time: "Yesterday",
    date: "Mar 27, 2026",
    unread: false,
    category: "Security",
    type: "info"
  },
  {
    id: 6,
    title: "Outreach Email Sent",
    description: "Personalized outreach email sent to Sarah Jenkins at Stripe via LinkedIn.",
    time: "Yesterday",
    date: "Mar 27, 2026",
    unread: false,
    category: "Credits",
    credits: -1,
    type: "success"
  },
  {
    id: 7,
    title: "Profile Viewed",
    description: "A recruiter from Meta viewed your optimized resume profile.",
    time: "2 days ago",
    date: "Mar 26, 2026",
    unread: false,
    category: "Jobs",
    type: "info"
  }
];

const archivedActivities = [
  {
    id: 8,
    title: "Subscription Renewed",
    description: "Your Pro Plan has been renewed for another month.",
    time: "3 days ago",
    date: "Mar 25, 2026",
    unread: false,
    category: "Security",
    type: "success"
  },
  {
    id: 9,
    title: "ATS Keyword Optimization",
    description: "Revised keywords 'Cloud Architecture' and 'System Design' for enhanced visibility.",
    time: "4 days ago",
    date: "Mar 24, 2026",
    unread: false,
    category: "Resume",
    type: "info"
  },
  {
    id: 10,
    title: "Bulk Outreach Completed",
    description: "Outreach campaign to 5 technical recruiters completed successfully.",
    time: "5 days ago",
    date: "Mar 23, 2026",
    unread: false,
    category: "Credits",
    credits: -5,
    type: "success"
  }
];

const categories = ["All", "Credits", "Resume", "Jobs", "Outreach", "Security"];

const creditStats = [
  { label: "Remaining", value: "145", sub: "out of 200", icon: CreditCard, color: "text-primary" },
  { label: "Used Week", value: "12", sub: "credits spent", icon: TrendingUp, color: "text-destructive" },
  { label: "Last Top-up", value: "50", sub: "Mar 24, 2026", icon: Zap, color: "text-gold" },
];

export default function ActivityPage() {
  const [activities, setActivities] = useState(initialActivities);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || activity.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (hasMore && activities.length < initialActivities.length + archivedActivities.length) {
      setActivities(prev => [...prev, ...archivedActivities]);
      setHasMore(false);
      toast.success("Older activities loaded successfully");
    } else {
      toast.info("No older activity found");
    }
    
    setIsLoadingMore(false);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "Resume": return <FileText className="w-4 h-4" />;
      case "Jobs": return <Briefcase className="w-4 h-4" />;
      case "Outreach": return <Zap className="w-4 h-4" />;
      case "Security": return <Shield className="w-4 h-4" />;
      case "Credits": return <CreditCard className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Activity History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed log of your activities and credit consumption.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl h-10 self-start md:self-auto border-border/50">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Credit Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {creditStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-xl bg-card border border-border/40 hover:border-border/60 hover:shadow-sm transition-all flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.sub}</span>
              </div>
            </div>
            <div className={cn("w-8 h-8 rounded-lg bg-muted flex items-center justify-center", stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search transactions, activities, keywords..." 
            className="pl-11 h-11 rounded-xl bg-muted/30 border-border/50 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                activeCategory === cat
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted/50 border border-border/30 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "group relative p-5 rounded-xl bg-card border border-border/40 hover:border-border/60 hover:shadow-sm transition-all",
                  activity.unread && "border-primary/30"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    activity.type === "success" 
                      ? "bg-success/10 text-success" 
                      : "bg-primary/10 text-primary"
                  )}>
                    {getIcon(activity.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-semibold text-sm", activity.unread ? "text-foreground" : "text-muted-foreground")}>
                          {activity.title}
                        </h3>
                        {activity.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {activity.credits !== undefined && (
                          <div className={cn(
                            "flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-lg",
                            activity.credits > 0 
                              ? "bg-success/10 text-success" 
                              : "bg-destructive/10 text-destructive"
                          )}>
                            {activity.credits > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(activity.credits)}
                          </div>
                        )}
                        <span className="text-[11px] text-muted-foreground hidden sm:block">
                          {activity.date}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded">
                        {activity.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="py-16 flex flex-col items-center justify-center text-center bg-muted/20 rounded-xl border border-dashed border-border/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-muted-foreground/30" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No records found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-2">
                We couldn't find any activities matching your selection.
              </p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-xl border-border/50"
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-3 pt-4">
        <p className="text-xs text-muted-foreground">Showing {filteredActivities.length} logs</p>
        <Button 
          variant="ghost" 
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="text-primary font-medium hover:bg-primary/10 rounded-xl px-8 h-10"
        >
          {isLoadingMore ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </div>
          ) : (
            "Load older activities"
          )}
        </Button>
      </div>
    </div>
  );
}
