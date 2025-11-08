import { create } from "zustand";
import { mobileServicesController } from "@/controllers/mobile-services.controller";
import type { ServiceMobileResponseDto } from "@/types/api";

interface MobileServicesState {
  services: ServiceMobileResponseDto[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  enableOrDisableService: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useMobileServicesStore = create<MobileServicesState>(
  (set, get) => ({
    services: [],
    isLoading: false,
    error: null,

    fetchServices: async () => {
      set({ isLoading: true, error: null });
      try {
        const services = await mobileServicesController.getAllServices();
        set({ services, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch mobile services";
        set({ isLoading: false, error: errorMessage });
      }
    },

    enableOrDisableService: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await mobileServicesController.enableOrDisableService(id);
        await get().fetchServices();
        set({ isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to toggle service";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    clearError: () => {
      set({ error: null });
    },
  })
);

