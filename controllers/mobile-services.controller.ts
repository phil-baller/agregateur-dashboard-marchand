import { apiGet, apiPatch } from "@/lib/api/base";
import type { ServiceMobileResponseDto } from "@/types/api";

export const mobileServicesController = {
  getAllServices: async (): Promise<ServiceMobileResponseDto[]> => {
    return apiGet<ServiceMobileResponseDto[]>("/api/services-mobile");
  },

  enableOrDisableService: async (
    id: string
  ): Promise<{ message: string }> => {
    return apiPatch(`/api/services-mobile/enable-or-disable/${id}`);
  },
};

