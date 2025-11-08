import { apiGet, apiPost } from "@/lib/api/base";
import type { CreateTransfertDto } from "@/types/api";

export const transfersController = {
  initializeTransfer: async (
    data: CreateTransfertDto
  ): Promise<{ message: string }> => {
    return apiPost("/api/transferts/initialise", data);
  },

  getAllTransfers: async (params?: {
    page?: number;
    size?: number;
  }): Promise<unknown> => {
    return apiGet("/api/transferts", params);
  },

  getTransferById: async (id: string): Promise<unknown> => {
    return apiGet(`/api/transferts/${id}`);
  },
};

