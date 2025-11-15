"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()

  const getIsActive = (url: string, currentIndex: number) => {
    // Exact match
    if (pathname === url) {
      return true
    }
    
    // Check if pathname is a child of this URL
    if (pathname?.startsWith(url + "/")) {
      // Check if there's a more specific route in the items array that also matches
      // If so, don't highlight this parent route
      const hasMoreSpecificMatch = items.some((otherItem, otherIndex) => {
        if (otherIndex === currentIndex) return false
        // Check if otherItem.url is more specific (longer) and also matches
        if (
          otherItem.url.startsWith(url + "/") &&
          pathname?.startsWith(otherItem.url)
        ) {
          return true
        }
        return false
      })
      
      // Only highlight if there's no more specific match
      return !hasMoreSpecificMatch
    }
    
    return false
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            const isActive = getIsActive(item.url, index)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                  className={cn(
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground duration-200 ease-linear"
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
