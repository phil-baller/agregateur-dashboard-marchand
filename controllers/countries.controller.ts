import { apiGet, apiPatch, apiDelete } from "@/lib/api/base";
import type { CountryResponseDto } from "@/types/api";

interface CountriesResponse {
  countries: CountryResponseDto[];
}

export const countriesController = {
  getAllCountries: async (): Promise<CountryResponseDto[]> => {
    const response = await apiGet<CountriesResponse | CountryResponseDto[]>("/country");
    // Handle both wrapped response { countries: [...] } and direct array
    if (Array.isArray(response)) {
      return response;
    }
    if (response && typeof response === "object" && "countries" in response) {
      return (response as CountriesResponse).countries;
    }
    return [];
  },

  enableTransactions: async (id: string): Promise<{ message: string }> => {
    return apiPatch(`/country/${id}/enable-transactions`);
  },

  disableTransactions: async (id: string): Promise<{ message: string }> => {
    return apiPatch(`/country/${id}/disable-transactions`);
  },

  deleteCountry: async (id: string): Promise<{ message: string }> => {
    return apiDelete(`/country/${id}`);
  },
};

