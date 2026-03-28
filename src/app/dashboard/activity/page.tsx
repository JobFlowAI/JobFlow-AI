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
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            Activity History
          </h1>
          <p className="text-muted-foreground mt-1">Detailed log of your activities and credit consumption.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl h-11 self-start md:self-auto border-border/50">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Credit Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {creditStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-background/60 backdrop-blur-xl border border-border/50 shadow-sm flex items-start justify-between"
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter text-foreground">{stat.value}</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase">{stat.sub}</span>
              </div>
            </div>
            <div className={cn("w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shadow-inner", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-6 sticky top-[4.5rem] z-30 py-2 -mx-2 px-2 bg-background/80 backdrop-blur-md rounded-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search transactions, activities, keywords..." 
            className="pl-12 h-14 rounded-2xl bg-background border-border/50 shadow-sm focus:ring-primary/20 text-base"
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
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                activeCategory === cat
                  ? "bg-foreground text-background shadow-[0_4px_12px_rgba(0,0,0,0.1)] scale-105"
                  : "bg-secondary/50 border border-border/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "group relative overflow-hidden p-6 rounded-3xl bg-background/60 backdrop-blur-xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-secondary/20",
                  activity.unread && "border-primary/40"
                )}
              >
                <div className="flex items-start gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
                    activity.type === "success" 
                      ? "bg-success/10 text-success border-success/20" 
                      : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {getIcon(activity.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-bold tracking-tight text-lg transition-colors", activity.unread ? "text-foreground" : "text-muted-foreground")}>
                          {activity.title}
                        </h3>
                        {activity.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {activity.credits !== undefined && (
                          <div className={cn(
                            "flex items-center gap-1 font-bold text-base px-3 py-1 rounded-xl shadow-sm border",
                            activity.credits > 0 
                              ? "bg-success/10 text-success border-success/20" 
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          )}>
                            {activity.credits > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {Math.abs(activity.credits)}
                          </div>
                        )}
                        <span className="text-xs font-bold text-muted-foreground/50 bg-secondary/50 px-3 py-1.5 rounded-xl hidden sm:block">
                          {activity.date}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground/90 leading-relaxed group-hover:text-foreground/80 mb-4 transition-colors">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60">
                        <Clock className="w-3.5 h-3.5" />
                        {activity.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.1em] text-foreground/40 bg-foreground/5 px-2.5 py-1 rounded-lg">
                        {activity.category}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="py-24 flex flex-col items-center justify-center text-center bg-secondary/10 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-border/50"
            >
              <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-6 shadow-xl">
                <Search className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">No records found</h3>
              <p className="text-muted-foreground max-w-sm mt-3 text-lg">
                We couldn't find any activities or credit logs matching your selection.
              </p>
              <Button 
                variant="outline" 
                className="mt-8 px-8 h-12 rounded-2xl hover:bg-primary hover:text-primary-foreground border-border/50"
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-4 pt-4">
        <p className="text-sm font-medium text-muted-foreground">Showing {filteredActivities.length} logs</p>
        <Button 
          variant="ghost" 
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="text-primary font-bold hover:bg-primary/10 rounded-2xl px-10 h-14 min-w-[200px]"
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
