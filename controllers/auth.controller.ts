import {
  apiPost,
  apiPatch,
} from "@/lib/api/base";
import type {
  LoginRequestDto,
  LoginResponseDto,
  CreateUserDto,
  CompleteUserDto,
  UserAuthenticationOtpDto,
  UserVerifyOtpDto,
  NewPasswordDto,
} from "@/types/api";

export const authController = {
  login: async (data: LoginRequestDto): Promise<LoginResponseDto> => {
    return apiPost<LoginResponseDto>("/api/auth/login", data);
  },

  logout: async (): Promise<void> => {
    await apiPost("/api/auth/logout");
  },

  register: async (data: CreateUserDto): Promise<LoginResponseDto> => {
    return apiPost<LoginResponseDto>("/api/auth/register", data);
  },

  completeUserProfile: async (
    id: string,
    data: CompleteUserDto
  ): Promise<LoginResponseDto> => {
    return apiPost<LoginResponseDto>(`/api/auth/${id}/update`, data);
  },

  forgotPassword: async (
    data: UserAuthenticationOtpDto
  ): Promise<LoginResponseDto> => {
    return apiPost<LoginResponseDto>(
      "/api/auth/forgot-password/send-otp",
      data
    );
  },

  verifyPasswordOtp: async (data: UserVerifyOtpDto): Promise<void> => {
    await apiPost("/api/auth/forgot-password/verify-otp", data);
  },

  resetPassword: async (
    id: string,
    data: NewPasswordDto
  ): Promise<LoginResponseDto> => {
    return apiPatch<LoginResponseDto>(
      `/api/auth/forgot-password/reset-password/${id}`,
      data
    );
  },
};

