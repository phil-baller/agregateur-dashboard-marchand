import { apiGet, apiDelete, apiPost, apiPatch } from "@/lib/api/base";
import type { UserDto, LoginResponseDto } from "@/types/api";

export const usersController = {
  getCurrentUser: async (): Promise<UserDto> => {
    return apiGet<UserDto>("/api/users/me");
  },

  getUserById: async (id: string): Promise<UserDto> => {
    return apiGet<UserDto>(`/api/users/${id}`);
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    return apiDelete(`/api/users/${id}`);
  },

  sendNotification: async (): Promise<void> => {
    await apiGet("/api/users/send-notif");
  },

  updateNotificationToken: async (): Promise<void> => {
    await apiPatch("/api/users/notification");
  },

  verifyIdentity: async (): Promise<LoginResponseDto> => {
    return apiPost<LoginResponseDto>("/api/users/verify-identity");
  },
};

