import { API_BASE_URL, getAuthHeaders } from "./config";
import type { IAppErrorDto } from "@/types/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    public error: IAppErrorDto["error"],
    message?: string
  ) {
    super(message || error.message);
    this.name = "ApiError";
  }
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: IAppErrorDto["error"] | null = null;
    try {
      const errorResponse = await response.json();
      if (errorResponse.error) {
        errorData = errorResponse.error;
      }
    } catch {
      // If JSON parsing fails, create a generic error
      errorData = {
        code: "UNKNOWN_ERROR",
        message: response.statusText || "An unknown error occurred",
        status_code: response.status,
      };
    }

    throw new ApiError(
      response.status,
      errorData || {
        code: "UNKNOWN_ERROR",
        message: response.statusText || "An unknown error occurred",
        status_code: response.status,
      }
    );
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return {} as T;
  }

  return response.json();
};

export const apiGet = <T>(endpoint: string, params?: Record<string, unknown>): Promise<T> => {
  const queryString = params
    ? `?${new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString()}`
    : "";
  return apiRequest<T>(`${endpoint}${queryString}`, { method: "GET" });
};

export const apiPost = <T>(endpoint: string, data?: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiPatch = <T>(endpoint: string, data?: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiDelete = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: "DELETE" });
};

