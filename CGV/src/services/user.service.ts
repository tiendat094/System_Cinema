// User Service - Handles user profile & preferences

import { apiClient, API_ENDPOINTS, USE_MOCK_DATA } from "./api/client";
import { User } from "@/types/auth.types";
import { Booking } from "@/types/booking.types";
import { ApiResponse, PaginatedResponse } from "@/types/common.types";

interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
}

class UserService {
  async getProfile(): Promise<ApiResponse<User>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockUser: User = {
        id: "user-001",
        email: "user@systemcinema.com",
        fullName: "Nguyễn Văn A",
        phoneNumber: "0901234567",
        avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A",
        role: "user" as any,
        isEmailVerified: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        datas: mockUser,
      };
    }

    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USER.PROFILE
    );
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser: User = {
        id: "user-001",
        email: "user@systemcinema.com",
        ...data,
        fullName: data.fullName || "Nguyễn Văn A",
        role: "user" as any,
        isEmailVerified: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        datas: updatedUser,
        message: "Cập nhật thông tin thành công",
      };
    }

    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USER.UPDATE,
      data
    );
    return response.data;
  }

  async getUserBookings(
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const mockBookings: Booking[] = [
        {
    id: "booking-001",
    bookingId: "booking-001",
          userId: "user-001",
          showtimeId: "showtime-001",
          seats: [
            {
              id: "seat-e5",
              row: "E",
              number: 5,
              type: "vip" as any,
              price: 120000,
              status: "booked" as any,
            },
            {
              id: "seat-e6",
              row: "E",
              number: 6,
              type: "vip" as any,
              price: 120000,
              status: "booked" as any,
            },
          ],
          totalAmount: 240000,
          status: "confirmed" as any,
          paymentId: "payment-001",
          qrCode: "QR-BOOKING-001",
          movieTitle: "Avatar: The Way of Water",
          cinemaName: "CGV Vincom Center",
          roomName: "Rạp 1 - IMAX",
          showtime: {
            id: "showtime-001",
            movieId: "movie-001",
            cinemaId: "cinema-001",
            cinemaName: "CGV Vincom Center",
            roomId: "room-001",
            roomName: "Rạp 1 - IMAX",
            startTime: "2024-11-22T10:00:00Z",
            endTime: "2024-11-22T12:30:00Z",
            price: 120000,
            availableSeats: 50,
            totalSeats: 120,
          },
          createdAt: "2024-11-20T10:00:00Z",
          updatedAt: "2024-11-20T10:05:00Z",
        },
      ];

      return {
        success: true,
        datas: {
          items: mockBookings,
          page,
          pageSize,
          totalItems: mockBookings.length,
          totalPages: 1,
        },
      };
    }

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      API_ENDPOINTS.USER.BOOKINGS,
      { params: { page, pageSize } }
    );
    return response.data;
  }

   async getAllUsers(): Promise<ApiResponse<PaginatedResponse<User>>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const users: User[] = [
        {
          id: "user-1",
          email: "user@systemcinema.com",
          fullName: "Nguyễn Văn A",
          phoneNumber: "0123456789",
          role: "user" as any,
          isEmailVerified: true,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "admin-1",
          email: "admin@systemcinema.com",
          fullName: "Admin SystemCinema",
          phoneNumber: "0987654321",
          role: "admin" as any,
          isEmailVerified: true,
          createdAt: "2024-01-01T10:00:00Z",
          updatedAt: "2024-01-01T10:00:00Z",
        },
      ];

      return {
        success: true,
        datas: {
          items: users,
          totalItems: users.length,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      };
    }

    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>("/users");
    return response.data;
  }

  // Create user (admin only)
  async createUser(data: any): Promise<ApiResponse<User>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        datas: {
          id: "user-" + Date.now(),
          ...data,
          role: data.role as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }
    const response = await apiClient.post<ApiResponse<User>>("/users", data);
    return response.data;
  }

  // Update user (admin only)
  async updateUser(userId: string, data: any): Promise<ApiResponse<User>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        datas: {
          id: userId,
          email: "user@systemcinema.com",
          fullName: data.fullName || "Updated User",
          phoneNumber: data.phoneNumber,
          role: (data.role || "user") as any,
          isEmailVerified: true,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: new Date().toISOString(),
        },
      };
    }
    const response = await apiClient.put<ApiResponse<User>>(`/users/${userId}`, data);
    return response.data;
  }

  // Delete user (admin only)
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        datas: undefined as any,
        message: "Xóa người dùng thành công",
      };
    }
    const response = await apiClient.delete<ApiResponse<void>>(`/users/${userId}`);
    return response.data;
  }

  // Get all bookings (admin only)
  async getAllBookings(): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockBookings: Booking[] = [
        {
          id: "booking-1",
          bookingId: "BK001",
          userId: "user-1",
          showtimeId: "showtime-1",
          showtime: {
            id: "showtime-1",
            movieId: "movie-1",
            cinemaId: "cinema-1",
            cinemaName: "CGV Vincom Center",
            roomId: "room-1",
            roomName: "Phòng 1",
            startTime: "2024-11-26T14:00:00Z",
            endTime: "2024-11-26T16:00:00Z",
            price: 80000,
            availableSeats: 90,
            totalSeats: 96,
          },
          seats: [
            { id: "seat-1", row: "A", number: 1, type: "normal" as any, status: "booked" as any, price: 80000 },
            { id: "seat-2", row: "A", number: 2, type: "normal" as any, status: "booked" as any, price: 80000 },
          ],
          totalAmount: 160000,
          status: "confirmed" as any,
          movieTitle: "Spider-Man: No Way Home",
          cinemaName: "CGV Vincom Center",
          roomName: "Phòng 1",
          createdAt: "2024-11-25T10:00:00Z",
          updatedAt: "2024-11-25T10:00:00Z",
          qrCode: "QR-BK001",
        },
      ];
      return {
        success: true,
        datas: {
          items: mockBookings,
          totalItems: mockBookings.length,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      };
    }
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>("/bookings/all");
    return response.data;
  }
}

export const userService = new UserService();
