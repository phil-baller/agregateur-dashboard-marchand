"use client"

import * as React from "react"
import {
  IconDashboard,
  IconUsers,
  IconWorld,
  IconSettings,
  IconCreditCard,
  IconTransfer,
  IconBolt,
  IconHelp,
  IconSearch,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { useAuthStore, type UserRole } from "@/stores/auth.store"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const getNavigationForRole = (role: UserRole | null) => {
  const baseNavSecondary = [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ]

  switch (role) {
    case "ADMIN":
      return {
        navMain: [
          {
            title: "Dashboard",
            url: "/admin",
            icon: IconDashboard,
          },
          {
            title: "Users",
            url: "/admin/users",
            icon: IconUsers,
          },
          {
            title: "Countries",
            url: "/admin/countries",
            icon: IconWorld,
          },
          {
            title: "Services",
            url: "/admin/services",
            icon: IconSettings,
          },
        ],
        navSecondary: baseNavSecondary,
      }
    case "MERCHANT":
      return {
        navMain: [
          {
            title: "Dashboard",
            url: "/merchant",
            icon: IconDashboard,
          },
          {
            title: "Payments",
            url: "/merchant/payments",
            icon: IconCreditCard,
          },
          {
            title: "Transfers",
            url: "/merchant/transfers",
            icon: IconTransfer,
          },
          {
            title: "Quick Links",
            url: "/merchant/quick",
            icon: IconBolt,
          },
        ],
        navSecondary: baseNavSecondary,
      }
    case "CLIENT":
    default:
      return {
        navMain: [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
          },
        ],
        navSecondary: baseNavSecondary,
      }
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, currentRole } = useAuthStore()
  const role = currentRole || (user?.role as UserRole) || "CLIENT"
  const navigation = getNavigationForRole(role)

  const userData = user
    ? {
        name: user.fullname,
        email: user.email,
        avatar: "",
      }
    : {
        name: "Guest User",
        email: "guest@example.com",
        avatar: "",
      }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">FastPay</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.navMain} />
        <NavSecondary items={navigation.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
