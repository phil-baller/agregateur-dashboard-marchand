"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

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
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 bg-green-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div>
          <h2 className="mb-8 text-2xl font-bold text-white">
            They trust us
          </h2>
          <div className="flex gap-8">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                <span className="text-xl font-bold">G</span>
              </div>
              <span>Genuka</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-500">
                <span className="text-xl">🛒</span>
              </div>
              <span>Laravel Shopper</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-red-500">
                <span className="text-xl">L</span>
              </div>
              <span>Laravel CAMEROON</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Our customers and their experience
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-4 italic">
                "Integration was very straightforward, and customer support is
                exceptional. Notch Pay is truly a partner for growth."
              </p>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <span>SK</span>
                </div>
                <div>
                  <div className="font-semibold">Sarah Kamdem</div>
                  <div className="text-sm text-muted-foreground">
                    Fondatrice, Digital Academy
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-green-600">
              <span className="text-xl font-bold text-white">N</span>
            </div>
            <span className="text-xl font-bold text-green-600">Notch Pay</span>
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
                      className="text-sm text-green-600 hover:underline"
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
                  className="w-full bg-green-600 hover:bg-green-700"
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
                  className="text-green-600 hover:underline"
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

