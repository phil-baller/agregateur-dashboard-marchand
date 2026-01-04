"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                            <span className="text-lg font-bold text-primary-foreground">N</span>
                        </div>
                        <span className="text-xl font-bold">FastPay</span>
                    </div>
                    <Button variant="ghost" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto max-w-4xl px-4 py-12">
                <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

                <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                    <p className="text-lg text-muted-foreground">
                        Last updated: January 2026
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">1. Introduction</h2>
                        <p>
                            FastPay (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your
                            information when you use our payment services and platform.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
                        <p>We may collect information about you in various ways, including:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Personal Data:</strong> Name, email address, phone number, and other
                                contact information you provide during registration.
                            </li>
                            <li>
                                <strong>Financial Data:</strong> Payment information, bank account details,
                                and mobile money account information necessary to process transactions.
                            </li>
                            <li>
                                <strong>Identity Verification:</strong> Government-issued identification
                                documents and photographs for KYC (Know Your Customer) compliance.
                            </li>
                            <li>
                                <strong>Usage Data:</strong> Information about how you interact with our
                                platform, including IP addresses, browser type, and access times.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Process and manage your payment transactions</li>
                            <li>Verify your identity and prevent fraud</li>
                            <li>Communicate with you about your account and our services</li>
                            <li>Comply with legal and regulatory requirements</li>
                            <li>Improve our services and develop new features</li>
                            <li>Provide customer support</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">4. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational security measures to
                            protect your personal information against unauthorized access, alteration,
                            disclosure, or destruction. This includes encryption, secure servers, and
                            regular security assessments.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">5. Data Sharing</h2>
                        <p>
                            We do not sell your personal information. We may share your data with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Payment processors and financial institutions to complete transactions</li>
                            <li>Service providers who assist in operating our platform</li>
                            <li>Law enforcement or regulatory authorities when required by law</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">6. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal information.
                            You may also request a copy of your data or object to certain processing
                            activities. To exercise these rights, please contact our support team.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us
                            through our support channels or email us at privacy@fastpay.com.
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/30 py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} FastPay. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
