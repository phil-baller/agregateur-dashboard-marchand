"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingStats } from "@/components/landing/landing-stats";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { FocusCards } from "@/components/ui/focus-cards";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { config } from "@/lib/config";

const FEATURE_ITEMS = [
  {
    title: "Instant payments",
    description:
      "Receive payments in real time with our low-latency processing pipeline.",
    link: "/register",
  },
  {
    title: "Secure & reliable",
    description:
      "End-to-end encryption and robust infrastructure so your money stays safe.",
    link: "/register",
  },
  {
    title: "Multiple payment methods",
    description:
      "Mobile Money, cards, bank transfers, and digital wallets in one platform.",
    link: "/register",
  },
  {
    title: "API-first integration",
    description:
      "API keys, webhooks, and developer docs so you can integrate in hours.",
    link: config.docsUrl,
  },
  {
    title: "Real-time analytics",
    description:
      "Transaction and performance metrics to track growth and success.",
    link: "/register",
  },
  {
    title: "24/7 support",
    description:
      "Help center, Telegram, WhatsApp, and documentation when you need it.",
    link: "/help",
  },
];

const SHOWCASE_CARDS = [
  {
    title: "Instant payments",
    src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
  },
  {
    title: "Analytics & insights",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    title: "API & integrations",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
];

const PARALLAX_IMAGES = [
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80",
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
];

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    if (isAuthenticated && user) {
      hasRedirected.current = true;
      const { getRoleRoute } = useAuthStore.getState();
      router.push(getRoleRoute());
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingStats />

        <section
          id="features"
          className="relative border-b py-20 md:py-28"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Everything you need to accept payments
              </h2>
              <p className="text-lg text-muted-foreground">
                Powerful features designed to grow with your business.
              </p>
            </motion.div>
            <div className="mx-auto max-w-6xl pt-12">
              <HoverEffect items={FEATURE_ITEMS} className="max-w-5xl mx-auto" />
            </div>
          </div>
        </section>

        <section
          id="showcase"
          className="relative border-b bg-muted/20 py-20 md:py-28"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Built for modern businesses
              </h2>
              <p className="text-lg text-muted-foreground">
                Instant payments, analytics, and API-first tools in one place.
              </p>
            </motion.div>
            <div className="mx-auto max-w-5xl pt-12">
              <FocusCards cards={SHOWCASE_CARDS} />
            </div>
          </div>
        </section>

        <section className="relative border-b py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">
                Payment infrastructure at global scale
              </h2>
              <p className="text-muted-foreground">
                Trusted by businesses everywhere to move money reliably.
              </p>
            </motion.div>
            <div className="mx-auto max-w-5xl pt-8">
              <ParallaxScroll images={PARALLAX_IMAGES} className="rounded-xl" />
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="relative border-t bg-primary py-20 text-primary-foreground md:py-28"
        >
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Ready to get started?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/90">
                Join thousands of businesses using FastPay to accept payments and
                grow revenue.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="w-full rounded-lg sm:w-auto"
                >
                  <Link href="/register">
                    Create free account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-lg border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
                  asChild
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="border-t bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">F</span>
                </div>
                FastPay
              </Link>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <a
                  href={config.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Developer docs
                </a>
                <Link href="/help" className="transition-colors hover:text-foreground">
                  Help center
                </Link>
                <Link href="/privacy" className="transition-colors hover:text-foreground">
                  Privacy
                </Link>
                <Link href="/terms" className="transition-colors hover:text-foreground">
                  Terms
                </Link>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} FastPay. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
