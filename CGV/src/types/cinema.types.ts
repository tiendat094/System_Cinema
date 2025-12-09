// Cinema Types

import { BaseEntity } from "./common.types";

export interface Cinema extends BaseEntity {
  name: string;
  slug: string;
  address: string;
  city: string;
  district: string;
  phoneNumber: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  facilities: string[]; // ['IMAX', '4DX', 'Dolby Atmos', 'VIP Room']
  openingHours: string; // "08:00 - 23:00"
  images: string[];
  thumbnail: string;
  totalRooms: number;
  totalSeats: number;
  status: CinemaStatus;
}

export enum CinemaStatus {
  Active = "active",
  Inactive = "inactive",
  Maintenance = "maintenance",
}

export interface CinemaRoom extends BaseEntity {
  cinemaId: string;
  name: string;
  type: RoomType;
  totalSeats: number;
  features: string[]; // ['3D', 'Dolby Atmos', 'Recliner Seats']
  status: RoomStatus;
}

export enum RoomType {
  Standard = "standard",
  VIP = "vip",
  IMAX = "imax",
  FourDX = "4dx",
  Dolby = "dolby",
  Sweetbox = "sweetbox",
}

export enum RoomStatus {
  Active = "active",
  Inactive = "inactive",
  Maintenance = "maintenance",
}

export interface CinemaDetailResponse extends Cinema {
  rooms: CinemaRoom[];
  nearbyPlaces?: {
    name: string;
    distance: string;
    type: string; // 'mall', 'parking', 'restaurant', etc.
  }[];
}

export interface CinemaFilters {
  city?: string;
  district?: string;
  facilities?: string[];
  search?: string;
  status?: CinemaStatus;
}
