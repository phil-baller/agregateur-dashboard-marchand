import axios, { type AxiosRequestConfig, type AxiosError } from "axios";
import { API_BASE_URL, getAuthHeaders, getAuthToken } from "./config";
import type { IAppErrorDto } from "@/types/api";

/**
 * Get the best error message from the error object
 * Prefers display_messages with language preference, falls back to message
 */
const getErrorMessage = (error: IAppErrorDto["error"]): string => {
  // Prefer display_messages if available
  if (error.display_messages && error.display_messages.length > 0) {
    // Try to find English message first
    const englishMessage = error.display_messages.find(
      (msg) => msg.lang === "en"
    );
    if (englishMessage) {
      return englishMessage.value;
    }
    // Fall back to first available message
    return error.display_messages[0].value;
  }
  
  // Fall back to the message field
  return error.message || "An error occurred";
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public error: IAppErrorDto["error"],
    message?: string
  ) {
    // Use the best error message (prefers display_messages)
    const errorMessage = getErrorMessage(error);
    super(message || errorMessage);
    this.name = "ApiError";
  }
}

/**
 * Show error toast notification and log to console
 * Only works on client-side
 */
const handleApiError = (error: IAppErrorDto["error"], status: number): void => {
  // Always log error to console with full details
  console.error("API Request Failed:", {
    status,
    code: error.code,
    message: error.message,
    display_messages: error.display_messages,
    details: error.details,
    url: error.url,
    fullError: error,
  });

  // Show toast notification (client-side only)
  if (typeof window === "undefined") return;

  try {
    // Dynamically import sonner to avoid SSR issues
    const { toast } = require("sonner");
    
    // Get the best error message (prefers display_messages with language preference)
    const errorMessage = getErrorMessage(error);

    // Show appropriate toast based on status code
    const statusCode = error.status_code || status;
    if (statusCode === 401) {
      toast.error("Authentication required", {
        description: errorMessage,
      });
    } else if (statusCode === 403) {
      toast.error("Access denied", {
        description: errorMessage,
      });
    } else if (statusCode === 404) {
      toast.error("Not found", {
        description: errorMessage,
      });
    } else if (statusCode && statusCode >= 500) {
      toast.error("Server error", {
        description: errorMessage || "An error occurred on the server",
      });
    } else {
      // For 4xx errors (like 400), show the error message directly
      toast.error(errorMessage);
    }
  } catch {
    // If sonner is not available, error is already logged to console above
  }
};

// Cache the auth store module to avoid repeated require() calls
let cachedAuthStore: typeof import("@/stores/auth.store") | null = null;

/**
 * Get the current auth token from the auth store (auth context)
 * This ensures the token is always fresh from the auth context/store
 * Falls back to localStorage if store is not available (SSR scenarios)
 * Caches the store module to prevent repeated require() calls
 */
const getTokenFromAuthStore = (): string | null => {
  // Server-side: return null (no token available)
  if (typeof window === "undefined") return null;
  
  try {
    // Client-side: get token from auth store
    // Cache the module to avoid repeated require() calls which can cause issues
    if (!cachedAuthStore) {
      cachedAuthStore = require("@/stores/auth.store");
    }
    // TypeScript guard: ensure cachedAuthStore is not null
    if (!cachedAuthStore) {
      return getAuthToken();
    }
    const state = cachedAuthStore.useAuthStore.getState();
    return state.token;
  } catch (error) {
    // Fallback to localStorage if store is not available or not initialized
    // Only log warning in development to avoid console spam
    if (process.env.NODE_ENV === "development") {
      console.warn("Auth store not available, falling back to localStorage:", error);
    }
    return getAuthToken();
  }
};

export const apiRequest = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from auth store (auth context)
  const token = getTokenFromAuthStore();
  
  // Build headers with token from auth store
  const authHeaders = getAuthHeaders(token);

  try {
    const response = await axios.request<T>({
      url,
      ...options,
      headers: {
        ...authHeaders,
        ...(options.headers as Record<string, string> || {}),
      } as Record<string, string>,
    });

    return response.data;
  } catch (error) {
    // Handle axios errors
    const axiosError = error as AxiosError<IAppErrorDto | unknown>;
    
    let errorData: IAppErrorDto["error"] | null = null;
    const status = axiosError.response?.status || 500;

    // Try to extract error from response data
    const responseData = axiosError.response?.data;
    
    if (responseData) {
      // Check if response follows IAppErrorDto format (has error property)
      if (
        typeof responseData === "object" &&
        responseData !== null &&
        "error" in responseData
      ) {
        const errorDto = responseData as IAppErrorDto;
        if (errorDto.error) {
          errorData = errorDto.error;
        }
      }
      // If response data itself is an error object (direct error format)
      else if (
        typeof responseData === "object" &&
        responseData !== null &&
        "code" in responseData &&
        "message" in responseData
      ) {
        errorData = responseData as IAppErrorDto["error"];
      }
    }

    // If no error data found, create a generic error
    const finalError = errorData || {
      code: "UNKNOWN_ERROR",
      message: axiosError.message || axiosError.response?.statusText || "An unknown error occurred",
      status_code: status,
    };

    // Handle error: show toast and log to console (non-blocking)
    handleApiError(finalError, status);

    // Return a rejected promise instead of throwing
    // This allows calling code to catch it, but prevents Next.js error overlay
    // The error is already handled (toast shown, logged to console)
    return Promise.reject(new ApiError(status, finalError));
  }
};

export const apiGet = <T>(endpoint: string, params?: Record<string, unknown>): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "GET",
    params,
  });
};

export const apiPost = <T>(endpoint: string, data?: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "POST",
    data,
  });
};

export const apiPatch = <T>(endpoint: string, data?: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    data,
  });
};

export const apiDelete = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: "DELETE" });
};

