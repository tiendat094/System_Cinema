// Auth Service - Handles authentication & authorization

import { apiClient, API_ENDPOINTS, USE_MOCK_DATA } from "./api/client";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ChangePasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth.types";
import { ApiResponse } from "@/types/common.types";

// Mock Data for Development
const mockUser: User = {
  id: "user-001",
  email: "user@systemcinema.com",
  fullName: "Nguyễn Văn A",
  phoneNumber: "0901234567",
  avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A",
  role: "user" as any,
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockLoginResponse: LoginResponse = {
  accessToken: "mock-access-token-123456",
  refreshToken: "mock-refresh-token-123456",
  // expiresIn: 3600,
  // user: mockUser,
};
const isClient = typeof window !== 'undefined';
class AuthService {
  async login(data: LoginRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    console.log("Login response:", response.data);
    return {
      success: true,
      datas: response.data
    };
  }

  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    console.log("Register response:", response.data);
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        datas: undefined as any,
        message: "Đổi mật khẩu thành công",
      };
    }

    const response = await apiClient.post<ApiResponse<void>>(
      "/auth/change-password",
      data
    );
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        datas: undefined as any,
        message: "Email khôi phục mật khẩu đã được gửi",
      };
    }

    const response = await apiClient.post<ApiResponse<void>>(
      "/auth/reset-password",
      data
    );
    return response.data;
  }

  // Helper methods
  saveTokens(accessToken: string, refreshToken: string): void {
 if (isClient) { 
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("isLoggedIn", "true");
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
