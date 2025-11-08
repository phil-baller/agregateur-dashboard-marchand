import { apiGet } from "@/lib/api/base";
import type {
  AnalyticsOverviewResponseDto,
  AnalyticsGraphDataResponseDto,
  AnalyticsTopBeneficiariesResponseDto,
} from "@/types/api";

export const analyticsController = {
  getOverview: async (): Promise<AnalyticsOverviewResponseDto> => {
    return apiGet<AnalyticsOverviewResponseDto>("/api/analytics/overview");
  },

  getGraphData: async (): Promise<AnalyticsGraphDataResponseDto> => {
    return apiGet<AnalyticsGraphDataResponseDto>("/api/analytics/graph");
  },

  getTopBeneficiaries: async (): Promise<AnalyticsTopBeneficiariesResponseDto> => {
    return apiGet<AnalyticsTopBeneficiariesResponseDto>(
      "/api/analytics/top-beneficiaries"
    );
  },
};

