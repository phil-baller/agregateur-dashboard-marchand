"use client";

import React, { useRef } from "react";
import {
  Zap,
  Shield,
  UserX,
  Smartphone,
  CreditCard,
  Store,
  Globe,
  Code2,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Marquee } from "@/components/ui/marquee";
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { BorderBeam } from "@/components/ui/border-beam";
import { Input } from "@/components/ui/input";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const INSTANT_ITEMS = [
  { icon: Zap, label: "Fast", desc: "Real-time" },
  { icon: Shield, label: "Safe", desc: "Secure" },
  { icon: UserX, label: "Anonymous", desc: "Private" },
];

export function InstantPaymentsContent() {
  return (
    <div className="absolute inset-0 overflow-hidden h-64 top-10 ">
      <Marquee pauseOnHover repeat={6} className="[--duration:25s] [--gap:1.5rem]">
        {INSTANT_ITEMS.map((item, i) => (
          <div
            key={i}
            className="flex flex-col shrink-0 items-start justify-center gap-2 h-24 rounded-lg border border-border/60 bg-card/80 px-3 py-2"
          >
            <item.icon className="size-5 text-primary" />
            <div>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span className="ml-1 text-xs text-muted-foreground">— {item.desc}</span>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

const PAYMENT_ITEMS = [
  { icon: Smartphone, label: "MTN Mobile Money", key: "momo" },
  { icon: Smartphone, label: "Orange Money", key: "orange" },
  { icon: CreditCard, label: "Card payments", key: "card" },
];

export function PaymentMethodsContent() {
  return (
    <div className="absolute left-2 right-2 flex flex-col gap-2 mask-[linear-gradient(to_bottom,transparent_10%,#000_90%)]">
      <AnimatedList delay={1500} className="gap-2">
        {PAYMENT_ITEMS.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-2 rounded-md border border-border/60 bg-card/80 px-3 py-2"
          >
            <item.icon className="size-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{item.label}</span>
          </div>
        ))}
      </AnimatedList>
    </div>
  );
}

const ANALYTICS_DATA = [
  { name: "Mon", value: 140 },
  { name: "Tue", value: 200 },
  { name: "Wed", value: 180 },
  { name: "Thu", value: 240 },
  { name: "Fri", value: 190 },
];

const analyticsConfig = {
  value: {
    label: "Volume",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function ApiIntegrationsContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const r1Ref = useRef<HTMLDivElement>(null);
  const r2Ref = useRef<HTMLDivElement>(null);
  const r3Ref = useRef<HTMLDivElement>(null);
  const r4Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden mask-[linear-gradient(to_bottom,transparent_5%,#000_95%)]"
    >
      <div
        ref={centerRef}
        className="absolute left-1/2 top-1/3 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/50 bg-primary/20 text-xs font-medium text-foreground"
      >
        API
      </div>
      <div
        ref={r1Ref}
        className="absolute left-2 top-2 flex size-8 items-center justify-center rounded-md border border-primary/40 bg-card"
      >
        <Store className="size-4 text-primary" />
      </div>
      <div
        ref={r2Ref}
        className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-md border border-primary/40 bg-card"
      >
        <Smartphone className="size-4 text-primary" />
      </div>
      <div
        ref={r3Ref}
        className="absolute bottom-2 left-2 flex size-8 items-center justify-center rounded-md border border-primary/40 bg-card"
      >
        <Globe className="size-4 text-primary" />
      </div>
      <div
        ref={r4Ref}
        className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-md border border-primary/40 bg-card"
      >
        <Code2 className="size-4 text-primary" />
      </div>
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={r1Ref}
        curvature={-30}
        gradientStartColor="hsl(var(--primary))"
        gradientStopColor="hsl(var(--primary) / 0.5)"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={r2Ref}
        curvature={-30}
        gradientStartColor="hsl(var(--primary))"
        gradientStopColor="hsl(var(--primary) / 0.5)"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={r3Ref}
        curvature={30}
        gradientStartColor="hsl(var(--primary))"
        gradientStopColor="hsl(var(--primary) / 0.5)"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={r4Ref}
        curvature={30}
        gradientStartColor="hsl(var(--primary))"
        gradientStopColor="hsl(var(--primary) / 0.5)"
      />
    </div>
  );
}

export function AnalyticsContent() {
  return (
    <div className="absolute inset-0 p-2 mask-[linear-gradient(to_bottom,transparent_20%,#000_90%)]">
      <ChartContainer config={analyticsConfig} className="h-full w-full">
        <BarChart data={ANALYTICS_DATA} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export function SupportContent() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 mask-[linear-gradient(to_bottom,transparent_30%,#000_90%)]">
      <div className="relative w-full max-w-[200px] rounded-lg">
        <BorderBeam
          size={60}
          duration={8}
          colorFrom="hsl(var(--primary))"
          colorTo="hsl(var(--primary) / 0.5)"
          borderWidth={1}
        />
        <Input
          placeholder="Ask for help..."
          className="relative z-10 border-border/60 bg-card/80"
          readOnly
          aria-label="Support search placeholder"
        />
      </div>
    </div>
  );
}
