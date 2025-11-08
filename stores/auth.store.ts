import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authController } from "@/controllers/auth.controller";
import { setAuthToken, removeAuthToken } from "@/lib/api/config";
import type {
  LoginRequestDto,
  LoginResponseDto,
  UserDto,
} from "@/types/api";

export type UserRole = "ADMIN" | "MERCHANT" | "CLIENT";

// Dummy user data for each role
const dummyUsers: Record<UserRole, UserDto> = {
  ADMIN: {
    id: "admin-1",
    fullname: "Admin User",
    phone: "+1234567890",
    email: "admin@fastpay.com",
    country_code: "US",
    code_phone: "+1",
    status: "COMPLETE",
    firebaseNotificationToken: "",
    balance: 0,
    role: "ADMIN",
    kyc_status: "VERIFIED",
    name: "Admin",
    surname: "User",
    birth_day: 1,
  },
  MERCHANT: {
    id: "merchant-1",
    fullname: "Merchant User",
    phone: "+1234567891",
    email: "merchant@fastpay.com",
    country_code: "US",
    code_phone: "+1",
    status: "COMPLETE",
    firebaseNotificationToken: "",
    balance: 10000,
    role: "MERCHANT",
    kyc_status: "VERIFIED",
    name: "Merchant",
    surname: "User",
    birth_day: 1,
  },
  CLIENT: {
    id: "client-1",
    fullname: "Client User",
    phone: "+1234567892",
    email: "client@fastpay.com",
    country_code: "US",
    code_phone: "+1",
    status: "COMPLETE",
    firebaseNotificationToken: "",
    balance: 5000,
    role: "CLIENT",
    kyc_status: "VERIFIED",
    name: "Client",
    surname: "User",
    birth_day: 1,
  },
};

interface AuthState {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentRole: UserRole | null;
  login: (data: LoginRequestDto) => Promise<void>;
  register: (data: {
    fullname: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserDto | null) => void;
  clearError: () => void;
  switchRole: (role: UserRole) => void;
  initializeDummyUser: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      currentRole: null,

      login: async (data: LoginRequestDto) => {
        set({ isLoading: true, error: null });
        try {
          const response: LoginResponseDto = await authController.login(data);
          setAuthToken(response.auth_token);
          set({
            user: response.user,
            token: response.auth_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response: LoginResponseDto = await authController.register(data);
          setAuthToken(response.auth_token);
          set({
            user: response.user,
            token: response.auth_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Registration failed";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authController.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          removeAuthToken();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      setUser: (user: UserDto | null) => {
        set({ user, isAuthenticated: !!user });
      },

      clearError: () => {
        set({ error: null });
      },

      switchRole: (role: UserRole) => {
        const dummyUser = dummyUsers[role];
        set({
          currentRole: role,
          user: dummyUser,
          isAuthenticated: true,
        });
      },

      initializeDummyUser: (role: UserRole) => {
        const dummyUser = dummyUsers[role];
        set({
          currentRole: role,
          user: dummyUser,
          isAuthenticated: true,
          token: `dummy-token-${role.toLowerCase()}`,
        });
        setAuthToken(`dummy-token-${role.toLowerCase()}`);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        currentRole: state.currentRole,
      }),
    }
  )
);

