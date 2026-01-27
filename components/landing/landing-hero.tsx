"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import WorldMap from "@/components/ui/world-map";
import type { WorldMapDot } from "@/components/ui/world-map";
import { CirclePlay } from "lucide-react";
import { cn } from "@/lib/utils";
import { config } from "@/lib/config";

/** Arcs across Africa: connections redistributing across the continent */
const AFRICA_ARCS: WorldMapDot[] = [
  { start: { lat: 6.45, lng: 3.39 }, end: { lat: -1.29, lng: 36.82 } },    // Lagos → Nairobi (West → East)
  { start: { lat: -1.29, lng: 36.82 }, end: { lat: -26.2, lng: 28.04 } },   // Nairobi → Johannesburg (East → South)
  { start: { lat: 9.03, lng: 38.74 }, end: { lat: 6.45, lng: 3.39 } },     // Addis Ababa → Lagos (East → West)
  { start: { lat: -6.17, lng: 39.28 }, end: { lat: -33.92, lng: 18.42 } },  // Dar es Salaam → Cape Town (East → South)
  { start: { lat: 5.6, lng: -0.19 }, end: { lat: -4.32, lng: 15.31 } },    // Accra → Kinshasa (West → Central)
];

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 * i },
  }),
};

const child = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, bounce: 0.3, duration: 0.5 },
  },
};

export function LandingHero() {
  return (
    <section
      id="hero"
      className={cn(
        "relative overflow-hidden border-b",
        "bg-linear-to-b from-background to-muted",
      )}
    >
      <div className="relative pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
        <div className="relative order-2 mx-auto flex max-w-6xl flex-col px-6 lg:order-1 lg:block">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="relative z-10 order-2 mx-auto max-w-lg text-center lg:order-1 lg:ml-0 lg:w-1/2 lg:text-left"
          >
            <motion.h1
              variants={child}
              className="mt-8 max-w-2xl text-balance text-5xl font-semibold text-foreground md:text-6xl lg:mt-16 xl:text-7xl"
            >
              The payment solution that{" "}
              <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                adapts to your growth
              </span>
            </motion.h1>
            <motion.p
              variants={child}
              className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground"
            >
              One platform that does it all. Instant payments, multiple payment
              methods, API-first integration, and real-time analytics—right
              inside FastPay.
            </motion.p>

            <motion.div
              variants={child}
              className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start"
            >
              <Button asChild size="lg" className="px-5 text-base">
                <Link href="/register">
                  <span className="text-nowrap">Get started free</span>
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="px-5 text-base"
              >
                <Link
                  href={config.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CirclePlay className="mr-2 size-4 fill-primary/25 stroke-primary" />
                  <span className="text-nowrap">Developer docs</span>
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={child} className="mt-10">
              <p className="text-sm font-medium text-muted-foreground">
                Trusted by businesses worldwide
              </p>
            </motion.div>
          </motion.div>
        </div>
        <div className="relative order-first h-56 w-full sm:h-80 lg:absolute lg:inset-y-0 lg:left-[40vw] lg:order-last lg:h-full lg:w-[55vw]">
          <WorldMap
            dots={AFRICA_ARCS}
            lineColor="var(--primary)"
            focus={{ lat: 1.37, lng: 16.35 }}
            zoom={6}
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}
