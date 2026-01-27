"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingStats } from "@/components/landing/landing-stats";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { FocusCards } from "@/components/ui/focus-cards";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { motion } from "motion/react";
import {
  ArrowRight,
  Zap,
  CreditCard,
  Code2,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { config } from "@/lib/config";
import {
  InstantPaymentsContent,
  PaymentMethodsContent,
  ApiIntegrationsContent,
  AnalyticsContent,
  SupportContent,
} from "@/components/landing/bento-feature-contents";

/** Features from project-description: Instant payments, Multiple payment methods, API-first, Analytics, Support */
const BENTO_FEATURES = [
  {
    name: "Instant payments",
    description: "Real-time processing so you get paid as soon as your customers pay.",
    href: "/register",
    cta: "Get started",
    Icon: Zap,
    className: "col-span-3 lg:col-span-2",
    background: <InstantPaymentsContent />,
  },
  {
    name: "Multiple payment methods",
    description:
      "Mobile Money, cards, bank transfers, and digital wallets in one platform.",
    href: "/register",
    cta: "Learn more",
    Icon: CreditCard,
    className: "col-span-3 lg:col-span-1",
    background: <PaymentMethodsContent />,
  },
  {
    name: "API-first integration",
    description: "API keys, webhooks, and developer docs so you can integrate in hours.",
    href: config.docsUrl,
    cta: "View docs",
    Icon: Code2,
    className: "col-span-3 lg:col-span-1",
    background: <ApiIntegrationsContent />,
  },
  {
    name: "Support",
    description: "Help center, Telegram, WhatsApp, and documentation when you need it.",
    href: "/help",
    cta: "Get help",
    Icon: MessageCircle,
    className: "col-span-3 lg:col-span-2",
    background: <SupportContent />,
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
        <section
          className="relative z-10 -mt-24 -mb-16 h-40 w-full overflow-hidden bg-transparent"
          aria-hidden
        >
          <ProgressiveBlur position="bottom" height="100%" />
        </section>

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
              <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {BENTO_FEATURES.map((feature, idx) => (
                  <BentoCard key={feature.name} {...feature} />
                ))}
              </BentoGrid>
            </div>
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
