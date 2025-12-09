// Cinema Service - Handles cinema and room data

import { apiClient, USE_MOCK_DATA } from "./api/client";
import {
  Cinema,
  CinemaDetailResponse,
  CinemaFilters,
  CinemaStatus,
  CinemaRoom,
  RoomType,
  RoomStatus,
} from "@/types/cinema.types";
import { ApiResponse, PaginatedResponse } from "@/types/common.types";

// Mock Data
const mockCinemas: Cinema[] = [
  {
    id: "cinema-001",
    name: "CGV Vincom Center",
    slug: "cgv-vincom-center",
    address: "72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1",
    city: "Hồ Chí Minh",
    district: "Quận 1",
    phoneNumber: "1900 6017",
    email: "vincomcenter@cgv.vn",
    latitude: 10.7769,
    longitude: 106.7009,
    facilities: ["IMAX", "Dolby Atmos", "4DX", "VIP Room", "Concession Stand", "Free WiFi"],
    openingHours: "08:00 - 23:30",
    images: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
    totalRooms: 8,
    totalSeats: 1200,
    status: CinemaStatus.Active,
    createdAt: "2020-01-15T00:00:00Z",
    updatedAt: "2024-11-20T00:00:00Z",
  },
];

const mockRooms: Record<string, CinemaRoom[]> = {
  "cinema-001": [
    {
      id: "room-001",
      cinemaId: "cinema-001",
      name: "Rạp IMAX 1",
      type: RoomType.IMAX,
      totalSeats: 300,
      features: ["IMAX", "Dolby Atmos"],
      status: RoomStatus.Active,
      createdAt: "2020-01-15T00:00:00Z",
      updatedAt: "2024-11-20T00:00:00Z",
    },
  ],
};

class CinemaService {
  // Get all cinemas with filters
  async getCinemas(
    filters: CinemaFilters = {}
  ): Promise<ApiResponse<PaginatedResponse<Cinema>>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));

      let filtered = [...mockCinemas];

      // Filter by city
      if (filters.city) {
        filtered = filtered.filter((c) => c.city === filters.city);
      }

      // Filter by district
      if (filters.district) {
        filtered = filtered.filter((c) => c.district === filters.district);
      }

      // Filter by facilities
      if (filters.facilities && filters.facilities.length > 0) {
        filtered = filtered.filter((c) =>
          filters.facilities!.some((f:any) => c.facilities.includes(f))
        );
      }

      // Search by name or address
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            c.address.toLowerCase().includes(search)
        );
      }

      // Filter by status
      if (filters.status) {
        filtered = filtered.filter((c) => c.status === filters.status);
      }

      return {
        success: true,
        datas: {
          items: filtered,
          totalItems: filtered.length,
          page: 1,
          pageSize: filtered.length,
          totalPages: 1,
        },
      };
    }

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Cinema>>>(
      "/cinemas",
      { params: filters }
    );
    return response.data;
  }

  // Get cinema by ID with rooms
  async getCinemaById(cinemaId: string): Promise<ApiResponse<CinemaDetailResponse>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const cinema = mockCinemas.find((c: Cinema) => c.id === cinemaId);
      if (!cinema) {
        return {
          success: false,
          datas: null as any,
          message: "Không tìm thấy rạp chiếu",
        };
      }

      const rooms = mockRooms[cinemaId] || [];

      const detailResponse: CinemaDetailResponse = {
        ...cinema,
        rooms,
        nearbyPlaces: [
          { name: "Vincom Center", distance: "0m", type: "mall" },
          { name: "Bãi đỗ xe B1", distance: "50m", type: "parking" },
          { name: "Starbucks Coffee", distance: "100m", type: "restaurant" },
          { name: "KFC", distance: "120m", type: "restaurant" },
        ],
      };

      return {
        success: true,
        datas: detailResponse,
      };
    }

    const response = await apiClient.get<ApiResponse<CinemaDetailResponse>>(
      `/cinemas/${cinemaId}`
    );
    return response.data;
  }

  // Get all cities (for filter)
  async getCities(): Promise<ApiResponse<string[]>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cities = Array.from(new Set(mockCinemas.map((c: Cinema) => c.city)));
      return {
        success: true,
        datas: cities as string[],
      };
    }

    const response = await apiClient.get<ApiResponse<string[]>>("/cinemas/cities");
    return response.data;
  }

  // Get districts by city (for filter)
  async getDistricts(city: string): Promise<ApiResponse<string[]>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const districts = mockCinemas
        .filter((c: Cinema) => c.city === city)
        .map((c: Cinema) => c.district);
      return {
        success: true,
        datas: Array.from(new Set(districts)),
      };
    }

    const response = await apiClient.get<ApiResponse<string[]>>(
      `/cinemas/districts?city=${city}`
    );
    return response.data;
  }
}

export const cinemaService = new CinemaService();
