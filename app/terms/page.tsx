"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
                <h1 className="mb-8 text-4xl font-bold">Terms & Conditions</h1>

                <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                    <p className="text-lg text-muted-foreground">
                        Last updated: January 2026
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using FastPay&apos;s services, you agree to be bound by these
                            Terms and Conditions. If you do not agree to all the terms, you may not
                            access or use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">2. Description of Services</h2>
                        <p>
                            FastPay provides payment processing services including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Online payment collection and processing</li>
                            <li>Mobile money transactions</li>
                            <li>Bank transfers and withdrawals</li>
                            <li>Payment API integration for businesses</li>
                            <li>Transaction reporting and analytics</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">3. Account Registration</h2>
                        <p>
                            To use our services, you must create an account and provide accurate,
                            complete information. You are responsible for maintaining the confidentiality
                            of your account credentials and for all activities under your account.
                        </p>
                        <p>
                            You must be at least 18 years old and have the legal capacity to enter
                            into binding contracts to use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">4. User Obligations</h2>
                        <p>As a user of our services, you agree to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide accurate and truthful information</li>
                            <li>Comply with all applicable laws and regulations</li>
                            <li>Not use our services for illegal or unauthorized purposes</li>
                            <li>Not attempt to interfere with or disrupt our services</li>
                            <li>Complete KYC verification as required</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">5. Fees and Payments</h2>
                        <p>
                            Transaction fees and charges are disclosed before you confirm any
                            transaction. By proceeding with a transaction, you agree to pay all
                            applicable fees. Fee schedules may be updated from time to time with
                            prior notice.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">6. Transaction Processing</h2>
                        <p>
                            We strive to process all transactions promptly. However, processing times
                            may vary depending on the payment method, destination, and other factors.
                            We are not liable for delays caused by third-party services or
                            circumstances beyond our control.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">7. Intellectual Property</h2>
                        <p>
                            All content, trademarks, and intellectual property on our platform are
                            owned by FastPay or its licensors. You may not copy, modify, distribute,
                            or use our intellectual property without prior written consent.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
                        <p>
                            FastPay shall not be liable for any indirect, incidental, special,
                            consequential, or punitive damages arising from your use of our services.
                            Our liability is limited to the amount of fees you paid for the specific
                            transaction in question.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">9. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your account if you violate
                            these terms or engage in fraudulent or illegal activities. You may also
                            terminate your account at any time by contacting our support team.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">10. Changes to Terms</h2>
                        <p>
                            We may modify these Terms and Conditions at any time. We will notify you
                            of any material changes by email or through our platform. Your continued
                            use of our services after such modifications constitutes your acceptance
                            of the updated terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">11. Contact Information</h2>
                        <p>
                            For questions or concerns about these Terms and Conditions, please contact
                            us through our support channels or email us at legal@fastpay.com.
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
