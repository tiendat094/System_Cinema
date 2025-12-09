// Movie Types - Mapping to MoviesService

import { BaseEntity, Status } from "./common.types";

export interface Movie extends BaseEntity {
  title: string;
  originalTitle?: string;
  description: string;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  duration: number; // in minutes
  releaseDate: string;
  rating: number; // 0-10
  genres: Genre[];
  director: string;
  cast: string[];
  language: string;
  subtitles: string;
  ageRating: AgeRating;
  status: MovieStatus;
  country: string;
}

export interface Genre {
  id: string;
  name: string;
}

export enum AgeRating {
  P = "0", // Phổ biến - All ages
  K = "1", // Dưới 13 tuổi + parent
  T13 = "2", // 13+
  T16 = "3", // 16+
  T18 = "4", // 18+
}

export enum MovieStatus {
  ComingSoon = "1",
  NowShowing = "0",
  Ended = "ended",
}

export interface MovieDetailResponse extends Movie {
  showtimes: Showtime[];
}

export interface Showtime {
  id: string;
  movieId: string;
  cinemaId: string;
  cinemaName: string;
  roomId: string;
  roomName: string;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
}

export interface CreateMovieRequest {
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl?: string;
  duration: number;
  releaseDate: string;
  genreIds: string[];
  director: string;
  cast: string;
  language: string;
  ageRating: AgeRating;
}


