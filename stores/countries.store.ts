import { create } from "zustand";
import { countriesController } from "@/controllers/countries.controller";
import type { CountryResponseDto } from "@/types/api";

interface CountriesState {
  countries: CountryResponseDto[];
  isLoading: boolean;
  error: string | null;
  fetchCountries: () => Promise<void>;
  enableTransactions: (id: string) => Promise<void>;
  disableTransactions: (id: string) => Promise<void>;
  deleteCountry: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCountriesStore = create<CountriesState>((set, get) => ({
  countries: [],
  isLoading: false,
  error: null,

  fetchCountries: async () => {
    set({ isLoading: true, error: null });
    try {
      const countries = await countriesController.getAllCountries();
      // Ensure countries is always an array
      const countriesArray = Array.isArray(countries) ? countries : [];
      set({ countries: countriesArray, isLoading: false });
    } catch (error) {
      // Error is already handled by API base (toast shown, logged to console)
      // Set countries to empty array on error
      set({ countries: [], isLoading: false, error: null });
    }
  },

  enableTransactions: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await countriesController.enableTransactions(id);
      await get().fetchCountries();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to enable transactions";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  disableTransactions: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await countriesController.disableTransactions(id);
      await get().fetchCountries();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to disable transactions";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  deleteCountry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await countriesController.deleteCountry(id);
      set({
        countries: get().countries.filter((c) => c.id !== id),
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete country";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

