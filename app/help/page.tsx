"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Send, Headphones, Mail, FileText, HelpCircle } from "lucide-react";
import { config } from "@/lib/config";

export default function HelpPage() {
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

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b bg-linear-to-b from-primary/5 to-background py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Headphones className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold">How can we help you?</h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Get in touch with our support team through your preferred channel.
                        We&apos;re here to help you 24/7.
                    </p>
                </div>
            </section>

            {/* Support Channels */}
            <main className="container mx-auto max-w-4xl px-4 py-12">
                <h2 className="mb-8 text-center text-2xl font-semibold">Contact Support</h2>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Telegram */}
                    <Card className="group transition-all hover:border-primary/50 hover:shadow-lg">
                        <CardHeader>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0088cc]/10">
                                <Send className="h-7 w-7 text-[#0088cc]" />
                            </div>
                            <CardTitle className="text-xl">Join Telegram Group</CardTitle>
                            <CardDescription>
                                Get instant support and connect with our community on Telegram
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full bg-[#0088cc] hover:bg-[#0088cc]/90">
                                <a href={config.telegramUrl} target="_blank" rel="noopener noreferrer">
                                    <Send className="mr-2 h-4 w-4" />
                                    Join Telegram
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* WhatsApp */}
                    <Card className="group transition-all hover:border-primary/50 hover:shadow-lg">
                        <CardHeader>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#25D366]/10">
                                <MessageCircle className="h-7 w-7 text-[#25D366]" />
                            </div>
                            <CardTitle className="text-xl">Join WhatsApp Group</CardTitle>
                            <CardDescription>
                                Chat with our support team directly on WhatsApp
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full bg-[#25D366] hover:bg-[#25D366]/90">
                                <a href={config.whatsappUrl} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Join WhatsApp
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Resources */}
                <div className="mt-12">
                    <h2 className="mb-6 text-center text-2xl font-semibold">Other Resources</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="transition-all hover:border-primary/50">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium">API Documentation</h3>
                                    <a
                                        href={config.docsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        View docs →
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:border-primary/50">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <HelpCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium">FAQ</h3>
                                    <p className="text-sm text-muted-foreground">Common questions</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:border-primary/50">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Email Support</h3>
                                    <a
                                        href="mailto:support@fastpay.com"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        support@fastpay.com
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
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
