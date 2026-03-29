"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  animationType?: "fade-up" | "fade-in" | "slide-left" | "slide-right";
}

export const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(
  ({ children, animationType = "fade-up", className, ...props }, ref) => {
    
    let initial = {};
    let animate = {};
    let whileInView = {};

    switch (animationType) {
      case "fade-up":
        initial = { opacity: 0, y: 20 };
        whileInView = { opacity: 1, y: 0 };
        break;
      case "fade-in":
        initial = { opacity: 0 };
        whileInView = { opacity: 1 };
        break;
      case "slide-left":
        initial = { opacity: 0, x: -20 };
        whileInView = { opacity: 1, x: 0 };
        break;
      case "slide-right":
        initial = { opacity: 0, x: 20 };
        whileInView = { opacity: 1, x: 0 };
        break;
    }

    return (
      <motion.div
        ref={ref}
        initial={initial}
        whileInView={whileInView}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ...props.transition }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollReveal.displayName = "ScrollReveal";
