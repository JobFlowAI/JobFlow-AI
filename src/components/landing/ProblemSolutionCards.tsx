import { motion } from "framer-motion";
import { AlertTriangle, Brain, Rocket } from "lucide-react";

const cards = [
  {
    icon: AlertTriangle,
    title: "The ATS Gap",
    description: "Most resumes lack the right keywords and formatting. ATS systems silently reject 75% of applicants before a recruiter even sees them.",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: Brain,
    title: "AI Optimization",
    description: "Our AI analyzes job descriptions, identifies missing keywords, and restructures your resume to pass any ATS with a high fit score.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Rocket,
    title: "Personalized Outreach",
    description: "Go beyond applying. Generate tailored emails to recruiters that highlight exactly why you're the perfect fit for the role.",
    color: "text-success",
    bg: "bg-success/10",
  },
];

export default function ProblemSolutionCards() {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three steps to transform your job search from frustrating to frictionless.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card-elevated card-hover p-8"
            >
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-5`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
