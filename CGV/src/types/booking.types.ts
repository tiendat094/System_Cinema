import { BaseEntity } from "./common.types";
import { Showtime } from "./movie.types";

export interface Booking extends BaseEntity {
  bookingId: string;
  userId: string;
  showtimeId: string;
  showtime: Showtime;
  seats: Seat[];
  totalAmount: number;
  status: BookingStatus;
  paymentId?: string;
  qrCode?: string;
  movieTitle: string;
  cinemaName: string;
  roomName: string;
}

export enum BookingStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Cancelled = "cancelled",
  Completed = "completed",
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: SeatType;
  price: number;
  status: SeatStatus;
}

export enum SeatType {
  Normal = "normal",
  VIP = "vip",
  Couple = "couple",
}

export enum SeatStatus {
  Available = "available",
  Selected = "selected",
  Booked = "booked",
  Broken = "broken",
}

export interface SeatLayout {
  rows: number;
  columns: number;
  seats: Seat[];
}

export interface CreateBookingRequest {
  showtimeId: string;
  seatIds: string[];
}

export interface BookingConfirmation {
  bookingId: string;
  qrCode: string;
  totalAmount: number;
  seats: Seat[];
  showtime: {
    movieTitle: string;
    cinemaName: string;
    roomName: string;
    startTime: string;
  };
}
