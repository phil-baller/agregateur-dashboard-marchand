"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import Link from "next/link";

const words = [
  "growth",
  "services",
  "scale",
  "team",
  "business",
  "needs",
  "success",
  "vision",
];

const AnimatedText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex flex-wrap items-center justify-start gap-2">
        <span>The payment solution</span>
        <span>that adapts to your</span>
        <div className="relative h-[1.2em] inline-flex items-center min-w-[180px] justify-start">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 30, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 2 }}
              exit={{ opacity: 0, y: -30, scale: 0.8, rotate: 5 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1]
              }}
              className="absolute left-0 inline-block text-primary-foreground px-4 py-2"
            >
              {/* Background gradient with glow effect */}
              <span className="absolute inset-0 bg-linear-to-r from-primary-foreground/20 via-primary-foreground/10 to-primary-foreground/20 rounded-lg blur-xl -z-10" />
              <span className="absolute inset-0 bg-linear-to-r from-primary-foreground/15 to-transparent rounded-lg -z-10" />
              {/* Text with slight glow */}
              <span className="relative inline-block drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {words[currentIndex]}
              </span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success("Login successful");
      // Get user role from store and navigate to appropriate route
      const { getRoleRoute } = useAuthStore.getState();
      const route = getRoleRoute();
      router.push(route);
    } catch (error) {
      // Error is already handled by API base (toast shown, logged to console)
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Animated Background */}
      <div className="hidden w-1/2 bg-primary lg:flex lg:items-center lg:justify-center lg:relative lg:overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/90 to-primary/80 animate-pulse" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl animate-[float_7s_ease-in-out_infinite]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[50px_50px] opacity-50" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-12 animate-fade-in">
          <div className="mb-8 flex justify-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 animate-scale-in">
              <span className="text-3xl font-bold text-primary-foreground">FP</span>
            </div>
          </div>

          <AnimatedText />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
              <span className="text-xl font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xl font-bold text-primary">FastPay</span>
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Log in to manage your payments
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Your email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Your password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in to your account"}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  No account yet?{" "}
                </span>
                <Link
                  href="/register"
                  className="text-primary hover:underline"
                >
                  Create a free account
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/help" className="hover:underline">
              Help center
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of use
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

