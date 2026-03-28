"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Briefcase, TrendingUp, Zap, ArrowRight, 
  ChevronRight, Filter, Search, ArrowUpRight, CheckCircle2,
  Clock, XCircle, LayoutGrid
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data based on the "Schedules" reference image
const trackingHistory = [
  { id: 1, company: "Hyperrise", role: "Senior Frontend Engineer", strategy: "ATS Optimized", status: "Active", date: "1 Aug 2024", score: 92 },
  { id: 2, company: "Hyperrise", role: "Full Stack Developer", strategy: "Creative Edge", status: "Active", date: "1 Aug 2024", score: 88 },
  { id: 3, company: "Vercel", role: "React Developer", strategy: "ATS Optimized", status: "Draft", date: "28 Jul 2024", score: null },
  { id: 4, company: "Stripe", role: "Product Designer", strategy: "Dark Designer", status: "Complete", date: "15 Jul 2024", score: 95 },
  { id: 5, company: "Linear", role: "Software Engineer II", strategy: "ATS Optimized", status: "Active", date: "10 Jul 2024", score: 85 },
];

export default function Dashboard() {
  const router = useRouter();
  const { profile, isHydrated } = useProfile();

  if (!isHydrated) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;

  const requiresOnboarding = !profile.personal.firstName;

  if (requiresOnboarding) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 -z-10 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-background/80 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-[2rem] p-10 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-primary/20">
            <UserIcon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-4 text-foreground">Welcome to JobFlow AI</h1>
          <p className="text-muted-foreground mb-10 leading-relaxed max-w-md mx-auto">
            To generate highly optimized, tailored resumes, we first need to build your Master Profile. This happens only once.
          </p>
          <Button 
            size="lg" 
            className="w-full text-base font-bold rounded-2xl h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all"
            onClick={() => router.push("/dashboard/settings")}
          >
            Create Master Profile <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 md:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30 -z-10 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground">Overview</h1>
            <p className="text-muted-foreground text-lg tracking-tight">Welcome back, {profile.personal.firstName}. Your job search performance.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl font-bold bg-background shadow-sm border-border/50">
               <FileText className="w-4 h-4 mr-2" /> Export Data
             </Button>
             <Button className="rounded-xl font-bold shadow-lg shadow-primary/20" onClick={() => router.push('/dashboard/resume-workspace')}>
               <Zap className="w-4 h-4 mr-2" /> Generate Resume
             </Button>
          </div>
        </motion.div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Resumes Generated" value="24" trend="+3 this week" icon={FileText} color="text-blue-500" bg="bg-blue-500/10" border="border-blue-500/20" />
          <StatCard title="Avg. ATS Match Rate" value="89%" trend="+5% improvement" icon={TrendingUp} color="text-success" bg="bg-success/10" border="border-success/20" />
          <StatCard title="AI Credits Remaining" value="145" trend="Renews in 12 days" icon={Zap} color="text-gold" bg="bg-gold/10" border="border-gold/20" />
        </div>

        {/* Data Table replacing the dummy matches */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-sm rounded-3xl overflow-hidden"
        >
           <div className="p-6 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="rounded-lg h-9 bg-secondary/50 font-semibold border-border/50 text-foreground">All</Button>
               <Button variant="ghost" size="sm" className="rounded-lg h-9 font-medium text-muted-foreground hover:text-foreground">Active</Button>
               <Button variant="ghost" size="sm" className="rounded-lg h-9 font-medium text-muted-foreground hover:text-foreground">Complete</Button>
             </div>
             
             <div className="flex items-center gap-3">
               <Button variant="outline" size="sm" className="rounded-lg h-9 gap-2 text-muted-foreground border-border/50">
                 <Filter className="w-4 h-4" /> Filters
               </Button>
               <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <Input className="w-[200px] h-9 pl-9 rounded-lg bg-background border-border/50 text-sm focus-visible:ring-1" placeholder="Search..." />
               </div>
             </div>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-secondary/20 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                 <tr>
                   <th className="px-6 py-4 rounded-tl-3xl"><LayoutGrid className="w-4 h-4" /></th>
                   <th className="px-6 py-4">Target Company</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Role & Strategy</th>
                   <th className="px-6 py-4">ATS Fit</th>
                   <th className="px-6 py-4">Date Generated</th>
                   <th className="px-6 py-4 rounded-tr-3xl"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/30">
                 {trackingHistory.map((item) => (
                   <tr key={item.id} className="hover:bg-secondary/20 transition-colors group">
                     <td className="px-6 py-4">
                       <input type="checkbox" className="rounded border-muted-foreground/30 text-primary focus:ring-primary shadow-sm" />
                     </td>
                     <td className="px-6 py-4 font-bold text-foreground flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center shadow-sm">
                         <span className="font-black text-sm">{item.company.charAt(0)}</span>
                       </div>
                       {item.company}
                     </td>
                     <td className="px-6 py-4">
                       <StatusBadge status={item.status} />
                     </td>
                     <td className="px-6 py-4">
                       <p className="font-semibold text-foreground">{item.role}</p>
                       <p className="text-xs text-muted-foreground">{item.strategy}</p>
                     </td>
                     <td className="px-6 py-4 font-semibold">
                       {item.score ? (
                         <span className="text-success bg-success/10 px-2.5 py-1 rounded-md border border-success/20">{item.score}% Match</span>
                       ) : (
                         <span className="text-muted-foreground">—</span>
                       )}
                     </td>
                     <td className="px-6 py-4 text-muted-foreground font-medium">{item.date}</td>
                     <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground group-hover:text-foreground">
                         <span className="sr-only">Open menu</span>
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                       </Button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           
           <div className="p-4 border-t border-border/40 flex items-center justify-between text-sm text-muted-foreground">
             <div className="flex items-center gap-2">
               1-5 of 240 <span className="hidden sm:inline">• Results per page</span>
               <select className="bg-background border border-border/50 rounded-md px-2 py-1 ml-1 text-foreground focus:outline-none focus:ring-1">
                 <option>10</option>
                 <option>20</option>
                 <option>50</option>
               </select>
             </div>
             <div className="flex gap-1">
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-md border-border/50 text-foreground" disabled><ChevronRight className="w-4 h-4 rotate-180" /></Button>
                <div className="flex items-center justify-center px-4 font-semibold text-foreground">1/9</div>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-md border-border/50 text-foreground"><ChevronRight className="w-4 h-4" /></Button>
             </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color, bg, border }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-background/80 backdrop-blur-xl border border-border/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center border ${border}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold text-success bg-success/10 border border-success/20 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-black tracking-tight text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Active
      </span>
    );
  }
  if (status === "Draft") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border/50">
        <Clock className="w-3 h-3" /> Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">
      <CheckCircle2 className="w-3 h-3" /> Complete
    </span>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
