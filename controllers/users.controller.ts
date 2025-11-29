import { apiGet, apiDelete, apiPost, apiPatch, apiRequest } from "@/lib/api/base";
import { getCurrentOrganisationId } from "@/lib/api/config";
import type { UserDto, LoginResponseDto, VerifyIdentityDto } from "@/types/api";

export const usersController = {
  getCurrentUser: async (): Promise<UserDto> => {
    return apiGet<UserDto>("/users/me");
  },

  getUserById: async (id: string): Promise<UserDto> => {
    return apiGet<UserDto>(`/users/${id}`);
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    return apiDelete(`/users/${id}`);
  },

  sendNotification: async (): Promise<void> => {
    await apiGet("/users/send-notif");
  },

  updateNotificationToken: async (): Promise<void> => {
    await apiPatch("/users/notification");
  },

  verifyIdentity: async (data: FormData, organisationId?: string): Promise<LoginResponseDto> => {
    const orgId = organisationId || getCurrentOrganisationId();
    if (orgId) {
      data.append("organisation_id", orgId);
    }
    return apiRequest<LoginResponseDto>("/users/verify-identity", {
      method: "POST",
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

