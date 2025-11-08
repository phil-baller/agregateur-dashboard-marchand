import { apiGet, apiPatch, apiDelete } from "@/lib/api/base";
import type { CountryResponseDto } from "@/types/api";

export const countriesController = {
  getAllCountries: async (): Promise<CountryResponseDto[]> => {
    return apiGet<CountryResponseDto[]>("/api/country");
  },

  enableTransactions: async (id: string): Promise<{ message: string }> => {
    return apiPatch(`/api/country/${id}/enable-transactions`);
  },

  disableTransactions: async (id: string): Promise<{ message: string }> => {
    return apiPatch(`/api/country/${id}/disable-transactions`);
  },

  deleteCountry: async (id: string): Promise<{ message: string }> => {
    return apiDelete(`/api/country/${id}`);
  },
};

