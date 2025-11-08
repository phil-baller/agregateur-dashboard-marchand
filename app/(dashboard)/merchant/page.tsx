"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRight, Zap, DollarSign } from "lucide-react";
import Link from "next/link";

export default function MerchantPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Merchant Dashboard</h1>
        <p className="text-muted-foreground">
          Manage payments, transfers, and quick links
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-green-100">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle>Payments</CardTitle>
            <CardDescription>
              Create payment links and manage transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/merchant/payments">
                Manage Payments
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-blue-100">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle>Transfers</CardTitle>
            <CardDescription>
              Transfer funds to bank or mobile money accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/merchant/transfers">
                Manage Transfers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-purple-100">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Create shareable payment links in seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/merchant/quick">
                Create Quick Links
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

