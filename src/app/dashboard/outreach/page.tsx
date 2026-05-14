"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  X,
  Briefcase,
  Users,
  Clock,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  Globe,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Languages,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface JobListing {
  id: string;
  source: string;
  title: string;
  company: string;
  location: string | null;
  employment_type: string | null;
  description: string;
  salary: string | null;
  apply_url: string | null;
  posted_at: string | null;
  deadline: string | null;
  country: string | null;
  category: string | null;
  subcategory: string | null;
  contact_email: string | null;
  is_translated: boolean;
  translated_from: string | null;
}

interface OutreachLog {
  id: string;
  user_id: string;
  company: string;
  target_role: string;
  contact_email: string | null;
  subject: string;
  body: string;
  status: "draft" | "sent";
  created_at: string;
  sent_at: string | null;
}

const CATEGORIES = [
  "Technology", "Healthcare", "Finance", "Marketing", "Design", "Education", 
  "Engineering", "Sales", "Operations", "Legal", "HR & Recruiting", 
  "Customer Support", "Construction", "Hospitality", "Media & Entertainment", 
  "Science & Research", "Nonprofit", "Government"
];

const SUBCATEGORIES: Record<string, string[]> = {
  "Technology": ["Frontend", "Backend", "Fullstack", "DevOps", "AI/ML", "Mobile", "Data Science", "Cybersecurity", "Quality Assurance"],
  "Marketing": ["Digital Marketing", "SEO/SEM", "Content", "Social Media", "Brand Management"],
  "Healthcare": ["Nursing", "Medicine", "Pharmacy", "Dentistry", "Mental Health"],
  "Finance": ["Accounting", "Banking", "Investment", "Fintech"],
  "Design": ["UI/UX", "Graphic Design", "Product Design", "Motion Graphics"],
  "Engineering": ["Mechanical", "Civil", "Electrical", "Chemical", "Aerospace"],
};

export default function OutreachPage() {
  const supabase = createClient();

  // Job Board State
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Outreach Stats State
  const [logs, setLogs] = useState<OutreachLog[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState(true);

  // Modal / Generation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Draft Data State
  const [draftId, setDraftId] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [company, setCompany] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Job Detail Modal State
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<JobListing | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchJobs = useCallback(async (page = 1, append = false) => {
    setIsJobsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        country: selectedCountry,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        page: page.toString(),
      });
      
      const res = await fetch(`/api/jobs/search?${params}`);
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setJobs(prev => append ? [...prev, ...data.jobs] : data.jobs);
      setHasMore(data.hasMore);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages || 0);
      setTotalResults(data.totalResults || 0);

      // Scroll to job count header if not appending
      if (!append) {
        const header = document.getElementById("job-board-header");
        if (header) header.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      toast.error("Failed to load job listings.");
    } finally {
      setIsJobsLoading(false);
    }
  }, [searchQuery, selectedCountry, selectedCategory, selectedSubcategory]);

  const fetchLogs = useCallback(async () => {
    setIsLogsLoading(true);
    try {
      const { data, error } = await supabase
        .from("outreach_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      toast.error("Failed to load outreach history.");
    } finally {
      setIsLogsLoading(false);
    }
  }, [supabase]);

  const generateOutreach = useCallback(async (
    targetCompany: string,
    role: string,
    jobDescription?: string,
    resumeContent?: string,
    email?: string | null
  ) => {
    setIsGenerating(true);
    setContactEmail(email || "");
    setCompany(targetCompany);
    setTargetRole(role);
    setIsModalOpen(true);
    
    try {
      const res = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: targetCompany,
          targetRole: role,
          jobDescription,
          resumeContent,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate outreach");

      const data = await res.json();
      
      setEmailSubject(data.subject);
      setEmailBody(data.body);
      
      if (data.contact_email && !contactEmail) {
        setContactEmail(data.contact_email);
      }
      if (data.id) {
        setDraftId(data.id);
        fetchLogs(); 
      }
      
      toast.success("Outreach email drafted successfully!");
    } catch (error) {
      toast.error("Failed to generate outreach email.");
    } finally {
      setIsGenerating(false);
    }
  }, [contactEmail, fetchLogs]);

  useEffect(() => {
    fetchLogs();
    fetchJobs(1, false);
    
    // Check if coming from Resume Workspace
    const storedContext = sessionStorage.getItem("jobflow_outreach_context");
    if (storedContext) {
      try {
        const { targetRole, company, jobDescription, resumeContent } = JSON.parse(storedContext);
        setTargetRole(targetRole || "");
        setCompany(company || "");
        
        // Open modal and immediately start generation
        setIsModalOpen(true);
        generateOutreach(company, targetRole, jobDescription, resumeContent);
        
        sessionStorage.removeItem("jobflow_outreach_context");
      } catch (e) {
        console.error("Context parse error", e);
      }
    }
  }, [fetchJobs, fetchLogs, generateOutreach]);

  // Refresh jobs when filters change (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(1, false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCountry, selectedCategory, selectedSubcategory, fetchJobs]);


  const handleMarkAsSent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("outreach_logs")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      fetchLogs();
      setIsModalOpen(false);
      toast.success("Marked as sent!");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const openDraft = (log: OutreachLog) => {
    setDraftId(log.id);
    setCompany(log.company);
    setTargetRole(log.target_role);
    setContactEmail(log.contact_email || "");
    setEmailSubject(log.subject);
    setEmailBody(log.body);
    setIsModalOpen(true);
  };

  const sendWithGmail = () => {
    if (!contactEmail.trim()) {
      toast.error("Please enter a contact email address first.");
      return;
    }

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      contactEmail
    )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
      emailBody
    )}`;
    
    window.open(url, "_blank");
    toast.success("Opened in Gmail! Once you send it, mark it as sent here.");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Worldwide Outreach <Globe className="w-6 h-6 text-primary animate-pulse" />
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Find global jobs in any industry, auto-translated to English, and reach out to recruiters instantly.
          </p>
        </div>
        <div className="flex gap-3">
             <button
                onClick={() => {
                    setDraftId(null);
                    setCompany("");
                    setTargetRole("");
                    setContactEmail("");
                    setEmailSubject("");
                    setEmailBody("");
                    setIsModalOpen(true);
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all gap-2 flex items-center"
                >
                <Mail className="w-5 h-5" /> Manual Outreach
            </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search jobs, titles, or industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Country */}
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-2xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Countries</option>
              <option value="USA">USA</option>
              <option value="Germany">Germany</option>
              <option value="UK">UK</option>
              <option value="Remote">Remote</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="India">India</option>
            </select>
          </div>

          {/* Category */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
              }}
              className="w-full pl-10 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-2xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Industries</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Subcategories */}
        {selectedCategory && SUBCATEGORIES[selectedCategory] && (
            <div className="flex flex-wrap gap-2 pt-2 animate-in slide-in-from-top-2 duration-300">
                <button
                    onClick={() => setSelectedSubcategory("")}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${!selectedSubcategory ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}
                >
                    All {selectedCategory}
                </button>
                {SUBCATEGORIES[selectedCategory].map(sub => (
                    <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedSubcategory === sub ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted hover:bg-muted/70'}`}
                    >
                        {sub}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Main Job Board Content */}
      <div className="space-y-6">
        <h3 id="job-board-header" className="text-xl font-bold flex items-center gap-2">
            Global Job Postings <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-muted rounded-full">{totalResults.toLocaleString()} found</span>
        </h3>

        {isJobsLoading && jobs.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 rounded-3xl bg-muted/20 animate-pulse border border-border/40" />
                ))}
            </div>
        ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-card border border-dashed border-border/60 rounded-3xl">
                <Globe className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, i) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (i % 9) * 0.05 }}
                        onClick={() => {
                            setSelectedJobForDetail(job);
                            setIsDetailModalOpen(true);
                        }}
                        className="group relative bg-card border border-border/50 rounded-3xl p-6 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all flex flex-col h-full overflow-hidden cursor-pointer"
                    >
                        {/* Translation Badge */}
                        {job.is_translated && (
                            <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-bl-3xl text-[10px] font-black flex items-center gap-2 border-b border-l border-amber-500/20 shadow-sm backdrop-blur-md">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                >
                                    <Languages className="w-3.5 h-3.5" />
                                </motion.div>
                                <span className="uppercase tracking-wider">Translated from {job.translated_from || "Auto"}</span>
                            </div>
                        )}

                        <div className="flex items-start gap-4 mb-5">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-2xl flex-shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-12">
                                {job.company.charAt(0)}
                            </div>
                            <div className="min-w-0 pr-12">
                                <h4 className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 group-hover:from-primary group-hover:to-primary/70 transition-all duration-300 leading-tight">
                                    {job.title}
                                </h4>
                                <p className="text-sm font-semibold text-muted-foreground/80 mt-1">{job.company}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6 flex-1">
                            <p className="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed italic border-l-4 border-primary/20 pl-4 py-1">
                                "{job.description.replace(/<[^>]+>/g, '').slice(0, 160)}..."
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                                {job.location && (
                                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-xl border border-border/40">
                                        <MapPin className="w-3 h-3 text-primary/60" /> {job.location}
                                    </span>
                                )}
                                {job.category && (
                                    <span className="flex items-center gap-1.5 text-[11px] font-black text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10">
                                        {job.category}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Posted At</p>
                                    <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3 text-emerald-500" /> {formatDate(job.posted_at)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Deadline</p>
                                    <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-rose-500" /> {formatDate(job.deadline)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    generateOutreach(job.company, job.title, job.description, undefined, job.contact_email);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-2xl text-xs font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                            >
                                <Sparkles className="w-4 h-4" /> Reach Out
                            </button>
                            {job.apply_url && (
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-3.5 h-full aspect-square flex items-center justify-center bg-card text-muted-foreground rounded-2xl hover:bg-muted hover:text-primary transition-all border border-border/60"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        )}

        {totalPages > 1 && (
            <div className="flex flex-col items-center justify-center pt-16 pb-12 space-y-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchJobs(currentPage - 1, false)}
                        disabled={currentPage === 1 || isJobsLoading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border/60 rounded-xl text-xs font-bold hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Previous
                    </button>
                    
                    <div className="flex items-center gap-2 p-1.5 bg-muted/20 backdrop-blur-md border border-border/40 rounded-2xl relative">
                        {[...Array(Math.min(7, totalPages))].map((_, i) => {
                            // Sliding window logic for 7 visible pages
                            let pageNum = currentPage;
                            const maxVisible = 7;
                            if (totalPages <= maxVisible) {
                                pageNum = i + 1;
                            } else {
                                if (currentPage <= 4) pageNum = i + 1;
                                else if (currentPage >= totalPages - 3) pageNum = totalPages - 6 + i;
                                else pageNum = currentPage - 3 + i;
                            }

                            if (pageNum < 1 || pageNum > totalPages) return null;

                            const isActive = currentPage === pageNum;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => fetchJobs(pageNum, false)}
                                    className="relative w-10 h-10 rounded-xl text-sm font-bold transition-all flex items-center justify-center overflow-hidden"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activePage"
                                            className="absolute inset-0 bg-primary shadow-lg shadow-primary/30"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                                        {pageNum}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => fetchJobs(currentPage + 1, false)}
                        disabled={currentPage === totalPages || isJobsLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        Next <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex flex-col items-center gap-1.5">
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">
                        JobFlow AI <span className="text-primary mx-1">/</span> Navigation
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        Displaying <span className="text-foreground font-bold">{(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, totalResults)}</span> of <span className="text-foreground font-bold">{totalResults.toLocaleString()}</span> global listings
                    </p>
                </div>
            </div>
        )}
      </div>

      {/* Outreach History Section (Simplified) */}
      <div className="pt-12 border-t border-border/60">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
                Recent Outreach Drafts <div className="px-2 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground">History</div>
            </h3>
        </div>

        {isLogsLoading ? (
            <div className="h-20 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        ) : logs.length === 0 ? (
            <div className="text-center py-10 bg-muted/10 rounded-3xl border border-dashed border-border/40">
                <p className="text-sm text-muted-foreground">Your recent outreach emails will appear here.</p>
            </div>
        ) : (
            <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                    <div
                        key={log.id}
                        className="p-4 bg-card border border-border/50 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${log.status === 'sent' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                <Send className="w-4 h-4" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-foreground">{log.target_role}</h5>
                                <p className="text-xs text-muted-foreground">{log.company} • {formatDate(log.created_at)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => openDraft(log)}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-xs font-bold hover:bg-muted transition-all"
                        >
                            Open
                        </button>
                    </div>
                ))}
                {logs.length > 5 && (
                    <p className="text-center text-xs text-muted-foreground pt-2">Veiw more in your outreach dashboard history.</p>
                )}
            </div>
        )}
      </div>

      {/* Outreach Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => !isGenerating && setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl bg-card border border-border/60 shadow-2xl rounded-[32px] flex flex-col z-10 overflow-hidden"
              style={{ maxHeight: "calc(100vh - 4rem)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-border/40 bg-muted/10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg">
                            {isGenerating ? "AI is Drafting..." : "Outreach Campaign"}
                        </h3>
                        {!isGenerating && <p className="text-xs text-muted-foreground">Personalize and send your message to {company}</p>}
                    </div>
                </div>
                {!isGenerating && (
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto space-y-6">
                {isGenerating ? (
                  <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-muted rounded-full border-t-primary animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Analyzing Job & Crafting Message</h3>
                      <p className="text-muted-foreground max-w-xs mx-auto">We're using AI to tailor this outreach based on the job requirements.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Target Role</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-muted/20 border border-border/50 rounded-2xl text-sm font-medium outline-none focus:border-primary/50 transition-all"
                            />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Company Name</label>
                        <div className="relative">
                            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-muted/20 border border-border/50 rounded-2xl text-sm font-medium outline-none focus:border-primary/50 transition-all"
                            />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Contact Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="Enter recruiter's email address..."
                            className={`w-full pl-10 pr-4 py-3 bg-muted/20 border ${!contactEmail ? 'border-amber-500/30' : 'border-border/50'} rounded-2xl text-sm font-medium outline-none focus:border-primary/50 transition-all`}
                        />
                      </div>
                      {!contactEmail && (
                        <p className="text-[10px] text-amber-600 font-medium px-1 flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" /> Required for direct sending via Gmail
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Email Subject</label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-muted/20 border border-border/50 rounded-2xl text-sm font-bold outline-none focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Message Body</label>
                        <span className="text-[10px] text-muted-foreground font-medium">{emailBody.length} characters</span>
                      </div>
                      <textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="w-full h-64 px-5 py-4 bg-muted/20 border border-border/50 rounded-3xl text-sm leading-relaxed outline-none focus:border-primary/50 resize-none transition-all scrollbar-hide"
                      />
                    </div>
                    
                    {!draftId && targetRole && company && (
                      <div className="flex justify-end pr-2">
                         <button
                           onClick={() => generateOutreach(company, targetRole)}
                           className="flex items-center gap-2 px-6 py-2 bg-secondary text-secondary-foreground rounded-xl text-[10px] font-bold hover:bg-muted transition-all uppercase tracking-wider"
                         >
                           <ArrowRight className="w-3 h-3" /> Re-generate AI Version
                         </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {!isGenerating && (
                <div className="px-8 py-6 border-t border-border/40 bg-muted/10 shrink-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {draftId && (
                      <button
                        onClick={() => handleMarkAsSent(draftId)}
                        className="px-6 py-3 text-xs font-bold rounded-2xl border border-border/50 bg-card hover:bg-muted transition-all flex items-center gap-2 text-foreground shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Mark as Sent
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-3 rounded-2xl font-bold text-sm hover:bg-muted transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={sendWithGmail}
                      disabled={!contactEmail.trim()}
                      className="flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
                    >
                      <ExternalLink className="w-5 h-5" /> Open in Gmail
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedJobForDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-card border border-border/60 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-primary/5 to-transparent shrink-0">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-3xl border border-primary/20 shadow-inner">
                    {selectedJobForDetail.company.charAt(0)}
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="p-3 bg-card border border-border/40 rounded-2xl hover:bg-muted transition-all shadow-sm"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60 leading-tight mb-2">
                  {selectedJobForDetail.title}
                </h2>
                <p className="text-lg font-bold text-primary/80">{selectedJobForDetail.company}</p>
              </div>

              <div className="px-8 pb-8 overflow-y-auto scrollbar-hide space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: MapPin, label: "Location", value: selectedJobForDetail.location || "Remote", color: "text-blue-500" },
                    { icon: Briefcase, label: "Category", value: selectedJobForDetail.category || "General", color: "text-purple-500" },
                    { icon: Clock, label: "Posted", value: formatDate(selectedJobForDetail.posted_at), color: "text-emerald-500" },
                    { icon: Languages, label: "Lang", value: selectedJobForDetail.translated_from || "English", color: "text-amber-500" }
                  ].map((stat, i) => (
                    <div key={i} className="p-3.5 bg-muted/20 border border-border/40 rounded-2xl space-y-1.5 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
                      </div>
                      <p className="text-xs font-bold truncate">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedJobForDetail.subcategory && (
                    <span className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-tighter">
                      {selectedJobForDetail.subcategory}
                    </span>
                  )}
                  {selectedJobForDetail.is_translated ? (
                      <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/10 rounded-full text-[10px] font-black text-amber-600 uppercase tracking-tighter flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> AI Translated to English
                      </span>
                  ) : (
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/10 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-tighter flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" /> English Verified
                      </span>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border/40 pb-2">Job Description</h3>
                  <div className="text-sm leading-relaxed text-muted-foreground/90 whitespace-pre-wrap font-medium">
                    {selectedJobForDetail.description.replace(/<[^>]+>/g, '')}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-border/40 bg-card/80 backdrop-blur-md shrink-0 flex gap-4">
                <button
                  onClick={() => {
                      setIsDetailModalOpen(false);
                      setIsModalOpen(true);
                      setCompany(selectedJobForDetail.company);
                      setTargetRole(selectedJobForDetail.title);
                      setContactEmail(selectedJobForDetail.contact_email || "");
                      generateOutreach(selectedJobForDetail.company, selectedJobForDetail.title, selectedJobForDetail.description, undefined, selectedJobForDetail.contact_email);
                  }}
                  className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                >
                  <Mail className="w-4 h-4" /> Start Outreach
                </button>
                {selectedJobForDetail.apply_url && (
                  <a
                    href={selectedJobForDetail.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-muted transition-all border border-border/60"
                  >
                    Apply Now <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
