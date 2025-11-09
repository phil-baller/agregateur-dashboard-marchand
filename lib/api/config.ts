export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://agregateur-rest.onrender.com";

// Legacy localStorage functions for backward compatibility
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
};

export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
};

/**
 * Get current organization ID from organizations store or localStorage
 * @returns Organization ID if available, null otherwise
 */
export const getCurrentOrganisationId = (): string | null => {
  if (typeof window === "undefined") return null;
  
  try {
    // Try to get from organizations store
    const orgStoreModule = require("@/stores/organisations.store");
    const state = orgStoreModule.useOrganisationsStore.getState();
    return state.currentOrganisationId || state.organisation?.id || null;
  } catch {
    // Fallback to localStorage
    return localStorage.getItem("current_organisation_id");
  }
};

// Cache the auth store module to avoid repeated require() calls
let cachedAuthStoreModule: typeof import("@/stores/auth.store") | null = null;

/**
 * Get auth headers with token from auth store
 * @param token - Optional token to use. If not provided, will fetch from auth store
 * @returns Headers with Authorization Bearer token if available
 */
export const getAuthHeaders = (token?: string | null): HeadersInit => {
  let authToken: string | null = null;

  // If token is explicitly provided, use it
  if (token !== undefined) {
    authToken = token;
  } else {
    // Try to get token from auth store (client-side only)
    if (typeof window !== "undefined") {
      try {
        // Cache the module to avoid repeated require() calls
        if (!cachedAuthStoreModule) {
          cachedAuthStoreModule = require("@/stores/auth.store");
        }
        // TypeScript guard: ensure cachedAuthStoreModule is not null
        if (!cachedAuthStoreModule) {
          authToken = getAuthToken();
        } else {
          const state = cachedAuthStoreModule.useAuthStore.getState();
          authToken = state.token;
        }
      } catch {
        // Fallback to localStorage if store is not available
        authToken = getAuthToken();
      }
    }
  }

  return {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
};

