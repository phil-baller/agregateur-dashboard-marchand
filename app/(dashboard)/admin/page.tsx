"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsStore } from "@/stores/analytics.store";
import {
  Users,
  Globe,
  Settings,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Receipt,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

export default function AdminPage() {
  const { overview, isLoading, fetchOverview } = useAnalyticsStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const analyticsCards = [
    {
      title: "Total Transactions",
      value: overview?.totalTransactions ?? 0,
      description: "All transactions processed",
      icon: Receipt,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      format: formatNumber,
    },
    {
      title: "Total Amount",
      value: overview?.totalAmount ?? 0,
      description: "Total revenue generated",
      icon: DollarSign,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      format: formatCurrency,
    },
    {
      title: "Successful Transactions",
      value: overview?.successfulTransactions ?? 0,
      description: "Completed transactions",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      format: formatNumber,
    },
    {
      title: "Failed Transactions",
      value: overview?.failedTransactions ?? 0,
      description: "Transactions that failed",
      icon: XCircle,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      format: formatNumber,
    },
    {
      title: "Commissions",
      value: overview?.commissions ?? 0,
      description: "Total commissions earned",
      icon: TrendingUp,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      format: formatCurrency,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 animate-fade-in">
      <div className="flex flex-col gap-2 animate-slide-up">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, countries, and mobile services
        </p>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="animate-slide-up"
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: "both",
              }}
            >
              <CardHeader>
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded ${card.bgColor}`}
                >
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <CardDescription>{card.title}</CardDescription>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {card.format(card.value)}
                  </CardTitle>
                )}
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Action Cards Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          className="animate-slide-up"
          style={{
            animationDelay: "0.05s",
            animationFillMode: "both",
          }}
        >
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage all users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/users">
                Manage Users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card
          className="animate-slide-up"
          style={{
            animationDelay: "0.1s",
            animationFillMode: "both",
          }}
        >
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-green-100">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle>Country Management</CardTitle>
            <CardDescription>
              Manage countries and their transaction settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/countries">
                Manage Countries
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card
          className="animate-slide-up"
          style={{
            animationDelay: "0.15s",
            animationFillMode: "both",
          }}
        >
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-purple-100">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle>Mobile Services</CardTitle>
            <CardDescription>
              Enable or disable mobile money services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/services">
                Manage Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

