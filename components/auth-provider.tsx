"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, type UserRole, getRoleRoute } from "@/stores/auth.store";
import { PageLoader } from "@/components/ui/page-loader";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider handles authentication state and role-based routing
 * It ensures users are redirected to the correct dashboard based on their role
 * and prevents unauthorized access to protected routes
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const role = user?.role as UserRole | undefined;

  useEffect(() => {
    // Wait for store to hydrate from localStorage before making routing decisions
    if (!isHydrated) {
      return;
    }

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/login", "/register"];
    const isPublicRoute = publicRoutes.includes(pathname || "");

    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated || !user) {
      if (!isPublicRoute) {
        router.push("/login");
      }
      return;
    }

    // If user is authenticated and on a public route, redirect to their dashboard
    if (isAuthenticated && user && isPublicRoute) {
      const route = getRoleRoute(role || "CLIENT");
      router.push(route);
      return;
    }

    // Role-based route protection
    if (pathname?.startsWith("/admin")) {
      if (role !== "ADMIN") {
        // Redirect to user's appropriate dashboard
        const route = getRoleRoute(role || "CLIENT");
        router.push(route);
        return;
      }
    } else if (pathname?.startsWith("/merchant")) {
      if (role !== "MERCHANT") {
        // Redirect to user's appropriate dashboard
        const route = getRoleRoute(role || "CLIENT");
        router.push(route);
        return;
      }
    } else if (pathname?.startsWith("/dashboard")) {
      if (role !== "CLIENT") {
        // Redirect to user's appropriate dashboard
        const route = getRoleRoute(role || "CLIENT");
        router.push(route);
        return;
      }
    }
  }, [isHydrated, isAuthenticated, user, role, pathname, router]);

  // Show loading state while hydrating
  if (!isHydrated) {
    return <PageLoader text="Loading..." />;
  }

  return <>{children}</>;
};

