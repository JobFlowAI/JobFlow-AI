"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  X, Briefcase, FileText, Sparkles, CheckCircle2, ChevronRight, 
  ArrowRight, Layers, FileCheck, Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ResumeCreationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [jobDescription, setJobDescription] = useState("");
  const [optimizationType, setOptimizationType] = useState<"ats" | "creative" | null>(null);

  const handleNext = () => {
    if (step === 1 && jobDescription.trim().length > 20) {
      setStep(2);
    } else if (step === 2 && optimizationType) {
      setStep(3);
      // Simulate AI loading step
      setTimeout(() => {
        // Save preferences to pass to the workspace
        localStorage.setItem("currentJobDescription", jobDescription);
        localStorage.setItem("currentOptimizationType", optimizationType);
        router.push("/dashboard/resume-workspace");
      }, 2500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              if (step < 3) onClose();
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-background border border-border/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            {step < 3 && (
              <div className="flex items-center justify-between p-6 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      {step === 1 ? "Target Job Analysis" : "Choose Strategy"}
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">
                      Step {step} of 2
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-secondary/80 text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content Body */}
            <div className="p-8">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Paste the Job Description
                  </label>
                  <Textarea 
                    placeholder="Paste the full job description here. Our AI will extract key requirements, tools, and soft skills to optimize your master profile..."
                    className="min-h-[200px] bg-secondary/20 p-4 border-border/50 focus-visible:ring-primary/20 resize-none text-sm leading-relaxed"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <div className="mt-4 flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Minimum 20 characters required</span>
                    <span className={jobDescription.length > 20 ? "text-success font-medium" : "text-muted-foreground"}>
                      {jobDescription.length} chars
                    </span>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <p className="text-sm text-muted-foreground mb-6">Select the optimization engine based on how you are applying for this role.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ATS Mode */}
                    <div 
                      onClick={() => setOptimizationType("ats")}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 group flex flex-col items-start ${
                        optimizationType === "ats" 
                          ? "border-success bg-success/5 shadow-lg shadow-success/10" 
                          : "border-border/50 hover:border-success/50 bg-secondary/10 hover:bg-secondary/30"
                      }`}
                    >
                      {optimizationType === "ats" && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                        optimizationType === "ats" ? "bg-success/20 text-success" : "bg-background text-muted-foreground shadow-sm group-hover:text-success"
                      }`}>
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">ATS Optimized</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Strictly simple format, no tables, no graphics. Maximizes keyword density and system parsability.
                      </p>
                    </div>

                    {/* Creative Mode */}
                    <div 
                      onClick={() => setOptimizationType("creative")}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 group flex flex-col items-start ${
                        optimizationType === "creative" 
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                          : "border-border/50 hover:border-primary/50 bg-secondary/10 hover:bg-secondary/30"
                      }`}
                    >
                      {optimizationType === "creative" && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                        optimizationType === "creative" ? "bg-primary/20 text-primary" : "bg-background text-muted-foreground shadow-sm group-hover:text-primary"
                      }`}>
                        <Layers className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">Non-ATS (Visual)</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Graphically beautiful, visually striking resume templates for direct networking or creative roles.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-secondary rounded-full border-t-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">AI is Analyzing...</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Extracting semantic keywords, aligning with your master profile, and structuring the optimized output.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {step < 3 && (
              <div className="p-6 border-t border-border/30 bg-secondary/10 flex justify-end">
                <Button 
                  size="lg"
                  className="rounded-full px-8 shadow-md gap-2 transition-all hover:-translate-y-0.5"
                  onClick={handleNext}
                  disabled={(step === 1 && jobDescription.trim().length <= 20) || (step === 2 && !optimizationType)}
                >
                  {step === 1 ? "Next Step" : "Generate Resume"} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
