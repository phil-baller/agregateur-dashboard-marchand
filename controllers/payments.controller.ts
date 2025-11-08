import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/base";
import type {
  NewCreatePaymentDto,
  NewCreateDirectPaymentDto,
  FilterDto,
  TransactionStatusResponseDto,
} from "@/types/api";

export const paymentsController = {
  createPayment: async (
    data: NewCreatePaymentDto
  ): Promise<{ message: string }> => {
    return apiPost("/api/paiements/new-paiement", data);
  },

  createDirectPayment: async (
    data: NewCreateDirectPaymentDto
  ): Promise<{ message: string }> => {
    return apiPost("/api/paiements/initialize-direct-paiement", data);
  },

  getAllPayments: async (params?: {
    page?: number;
    size?: number;
  }): Promise<unknown> => {
    return apiGet("/api/paiements", params);
  },

  filterPayments: async (
    data: FilterDto,
    params?: { page?: number; size?: number }
  ): Promise<unknown> => {
    const queryParams = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString()}`
      : "";
    return apiPost(`/api/paiements/filter${queryParams}`, data);
  },

  getPaymentByRef: async (reference: string): Promise<unknown> => {
    return apiGet(`/api/paiements/by-ref/${reference}`);
  },

  getPaymentById: async (id: string): Promise<unknown> => {
    return apiGet(`/api/paiements/${id}`);
  },

  deletePayment: async (id: string): Promise<{ message: string }> => {
    return apiDelete(`/api/paiements/${id}`);
  },

  startExecution: async (
    id: string
  ): Promise<TransactionStatusResponseDto> => {
    return apiPatch<TransactionStatusResponseDto>(
      `/api/paiements/${id}/start-execution`
    );
  },

  completeTransaction: async (
    id: string
  ): Promise<TransactionStatusResponseDto> => {
    return apiPatch<TransactionStatusResponseDto>(
      `/api/paiements/${id}/complete`
    );
  },

  failTransaction: async (
    id: string
  ): Promise<TransactionStatusResponseDto> => {
    return apiPatch<TransactionStatusResponseDto>(`/api/paiements/${id}/fail`);
  },
};

