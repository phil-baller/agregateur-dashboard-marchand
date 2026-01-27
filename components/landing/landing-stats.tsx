"use client";

import { motion } from "motion/react";

const STATS = [
  { value: "20k+", label: "Companies", delay: 0 },
  { value: "99.9%", label: "Uptime", delay: 0.08 },
  { value: "24/7", label: "Support", delay: 0.16 },
];

export function LandingStats() {
  return (
    <section
      id="stats"
      className="relative border-b bg-muted/30 py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: stat.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="group"
            >
              <div className="text-3xl font-bold text-primary transition-transform duration-300 group-hover:scale-105 md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
