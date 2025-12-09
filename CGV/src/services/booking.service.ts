// Booking Service - Handles ticket booking operations

import { apiClient, API_ENDPOINTS, USE_MOCK_DATA } from "./api/client";
import {
  Booking,
  CreateBookingRequest,
  BookingConfirmation,
  SeatLayout,
  Seat,
  SeatType,
  SeatStatus,
  BookingStatus,
} from "@/types/booking.types";
import { ApiResponse, PaginatedResponse } from "@/types/common.types";

// Mock Data
const generateSeats = (showtimeId: string): Seat[] => {
  const seats: Seat[] = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const columns = 12;

  rows.forEach((row, rowIndex) => {
    for (let col = 1; col <= columns; col++) {
      const isVIP = rowIndex >= 4 && rowIndex <= 5;
      const isCouple = rowIndex === 7 && col % 2 === 1 && col < 11;
      
      // Randomly mark some seats as booked
      const isBooked = Math.random() < 0.3;

      seats.push({
        id: `${showtimeId}-${row}${col}`,
        row,
        number: col,
        type: isCouple ? SeatType.Couple : isVIP ? SeatType.VIP : SeatType.Normal,
        price: isCouple ? 200000 : isVIP ? 120000 : 85000,
        status: isBooked ? SeatStatus.Booked : SeatStatus.Available,
      });
    }
  });

  return seats;
};

const mockBookings: Booking[] = [
  {
    id: "booking-001",
    bookingId: "booking-001",
    userId: "user-001",
    showtimeId: "showtime-001",
    seats: [
      {
        id: "showtime-001-E5",
        row: "E",
        number: 5,
        type: SeatType.VIP,
        price: 120000,
        status: SeatStatus.Booked,
      },
      {
        id: "showtime-001-E6",
        row: "E",
        number: 6,
        type: SeatType.VIP,
        price: 120000,
        status: SeatStatus.Booked,
      },
    ],
    totalAmount: 240000,
    status: BookingStatus.Confirmed,
    paymentId: "payment-001",
    qrCode: "BOOKING001-QR-CODE",
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

class BookingService {
  async getSeats(showtimeId: string): Promise<ApiResponse<SeatLayout>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const seats = generateSeats(showtimeId);

      return {
        success: true,
        datas: {
          rows: 8,
          columns: 12,
          seats,
        },
      };
    }

    const response = await apiClient.get<ApiResponse<SeatLayout>>(
      API_ENDPOINTS.BOOKING.SEATS(showtimeId)
    );
    return response.data;
  }

  async createBooking(
    data: CreateBookingRequest
  ): Promise<ApiResponse<BookingConfirmation>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate booking creation
      const selectedSeats = generateSeats(data.showtimeId).filter((s) =>
        data.seatIds.includes(s.id)
      );

      const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

      const confirmation: BookingConfirmation = {
        bookingId: `booking-${Date.now()}`,
        qrCode: `QR-${Date.now()}`,
        totalAmount,
        seats: selectedSeats,
        showtime: {
          movieTitle: "Avatar: The Way of Water",
          cinemaName: "CGV Vincom Center",
          roomName: "Rạp 1 - IMAX",
          startTime: "2024-11-22T10:00:00Z",
        },
      };

      return {
        success: true,
        datas: confirmation,
        message: "Đặt vé thành công",
      };
    }

    const response = await apiClient.post<ApiResponse<BookingConfirmation>>(
      API_ENDPOINTS.BOOKING.CREATE,
      data
    );
    return response.data;
  }

  async getBookings(
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));

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
      API_ENDPOINTS.BOOKING.LIST,
      { params: { page, pageSize } }
    );
    return response.data;
  }

  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const booking = mockBookings.find((b) => b.id === id);
      if (!booking) {
        return {
          success: false,
          datas: null as any,
          message: "Không tìm thấy booking",
        };
      }

      return {
        success: true,
        datas: booking,
      };
    }

    const response = await apiClient.get<ApiResponse<Booking>>(
      API_ENDPOINTS.BOOKING.DETAIL(id)
    );
    return response.data;
  }

  async cancelBooking(id: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        datas: undefined as any,
        message: "Hủy vé thành công",
      };
    }

    const response = await apiClient.post<ApiResponse<void>>(
      API_ENDPOINTS.BOOKING.CANCEL(id)
    );
    return response.data;
  }

   // Update booking status (admin only)
  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        success: true,
        datas: {
          id: bookingId,
          bookingId: "BK" + Date.now(),
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
          seats: [],
          totalAmount: 160000,
          status: status,
          movieTitle: "Spider-Man: No Way Home",
          cinemaName: "CGV Vincom Center",
          roomName: "Phòng 1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          qrCode: "QR-" + bookingId,
        },
        message: "Cập nhật trạng thái thành công",
      };
    }

    const response = await apiClient.put<ApiResponse<Booking>>(
      `/bookings/${bookingId}/status`,
      { status }
    );
    return response.data;
  }
}

export const bookingService = new BookingService();
