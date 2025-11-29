"use client";

import { useEffect, useRef } from "react";
import { useAuthStore, type UserRole } from "@/stores/auth.store";
import { useOrganisationsStore } from "@/stores/organisations.store";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { OrganizationOverlay } from "@/components/organization-overlay";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { PageLoader } from "@/components/ui/page-loader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const {
    organisations,
    organisation,
    hasOrganisation,
    fetchMyOrganisations,
    isLoading: orgLoading,
  } = useOrganisationsStore();
  const role = user?.role as UserRole | undefined;

  // Fetch organizations for merchant users only if no persisted data exists
  useEffect(() => {
    // Only fetch if: user is authenticated merchant, no organisations in store (no persisted data), and not loading
    if (isAuthenticated && role === "MERCHANT" && organisations.length === 0 && !orgLoading) {
      // fetchMyOrganisations will check if data exists and skip if it does
      fetchMyOrganisations();
    }
  }, [isAuthenticated, role]);

  // Show loading state while fetching organization
  if (role === "MERCHANT" && orgLoading && !organisation && organisations.length === 0) {
    return <PageLoader text="Loading dashboard..." />;
  }

  // Check if merchant user has organization
  // Show overlay if: user is merchant, not loading, and has no organizations
  const isMerchant = role === "MERCHANT";
  const showOverlay = isMerchant && !orgLoading && organisations.length === 0 && !organisation && !hasOrganisation();

  // AuthProvider handles routing, so if we reach here, user is authenticated
  // and has access to the current route

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className={`flex flex-1 flex-col ${showOverlay ? "pointer-events-none opacity-50" : ""}`}>
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      {showOverlay && <OrganizationOverlay />}
    </>
  );
}

