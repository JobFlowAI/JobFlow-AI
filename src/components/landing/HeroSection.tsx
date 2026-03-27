import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-success/5 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Job Acquisition
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground leading-tight mb-6">
            Stop Getting <span className="text-primary">Ignored</span> by
            <br />ATS Systems
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            75% of resumes are rejected before a human ever sees them. Our AI optimizes your resume,
            matches you to jobs, and crafts personalized outreach — automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/features")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-card text-foreground font-semibold text-lg border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16"
        >
          {[
            { value: "93%", label: "ATS Pass Rate" },
            { value: "2.4x", label: "More Interviews" },
            { value: "10k+", label: "Users Hired" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
