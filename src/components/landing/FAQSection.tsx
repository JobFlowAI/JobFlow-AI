"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      q: "How does the AI Resume Optimization work?",
      a: "Our proprietary model takes your raw experience and crosses it with live job descriptions to find keyword gaps, rephrases passive language into active, metrics-driven bullet points, and generates a fully ATS-compliant PDF.",
    },
    {
      q: "Will this guarantee I get an interview?",
      a: "While we cannot guarantee an interview, our internal data shows a 93% ATS pass rate for optimized resumes, leading to a 2.4x increase in interview volume for our users.",
    },
    {
      q: "Can I use it for multiple different job roles?",
      a: "Yes. Pro users can generate unlimited tailor-made resumes for each specific job they apply to, ensuring maximum relevance and ATS scoring for every distinct application.",
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. We do not sell your personal data to third parties, and all resume parsing is done via secure, encrypted channels. You can delete your data at any time.",
    },
    {
      q: "What ATS platforms do you support?",
      a: "Our optimization engine is tested against all major ATS platforms including Workday, Greenhouse, Lever, iCIMS, Taleo, and BambooHR.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-muted/20 relative z-10 border-t border-border/30">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-5">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Everything you need to know about JobFlow AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border rounded-xl px-5 bg-card data-[state=open]:border-foreground/30 data-[state=open]:shadow-sm transition-all"
              >
                <AccordionTrigger className="text-left text-base font-medium py-5 hover:no-underline hover:text-foreground transition-colors data-[state=open]:text-foreground [&[data-state=open]>svg]:text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
