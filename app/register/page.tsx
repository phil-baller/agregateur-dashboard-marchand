"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Shield,
  Wallet,
  Headphones,
  Plug,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      return;
    }

    try {
      await register({ fullname, email, password });
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
      {/* Left Side - Registration Form */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
              <span className="text-xl font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xl font-bold text-primary">FastPay</span>
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">
              Create your FastPay account
            </h1>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullname">What should we call you?</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="e.g. Bonnie Green"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Please enter your personal name, not a company or project name.
                  </p>
                </div>

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
                  <Label htmlFor="password">Your password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={setAgreeToTerms}
                      required
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm font-normal cursor-pointer"
                    >
                      <span>By signing up, you agree</span>
                      <Link
                        href="/terms"
                        className="font-semibold text-primary hover:underline whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms of Use
                      </Link>
                      <span> </span>
                      <span className="text-muted-foreground">and</span>
                      <span> </span>
                      <Link
                        href="/privacy"
                        className="font-semibold text-primary hover:underline whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </Link>
                      <span>.</span>
                    </Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      id="email-updates"
                      checked={emailUpdates}
                      onCheckedChange={setEmailUpdates}
                    />
                    <Label
                      htmlFor="email-updates"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Email me about product updates and resources.
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !agreeToTerms}
                >
                  {isLoading ? "Creating account..." : "Create an account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Login here
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

      {/* Right Side - Marketing Content */}
      <div className="hidden w-1/2 bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="my-auto">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
            The payment solution that adapts to your growth
          </h2>
          <p className="mb-12 text-lg text-primary-foreground/90">
            More than 20k companies trust us to manage their online payments
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                <Plug className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary-foreground">
                  Easy integration
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  Select or pairs integrations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary-foreground">
                  Safe and reliable
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  Robust infrastructure with end-to-end encryption
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary-foreground">
                  Multiple payments
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  Mobile Money, Cards, Digital Wallets - all in one place
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                <Headphones className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary-foreground">
                  Local support 24/7
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  A dedicated team to support you every step of the way
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

