// Movie Service - Handles movie data operations

import { apiClient, API_ENDPOINTS, USE_MOCK_DATA } from "./api/client";
import {
  Movie,
  MovieDetailResponse,
  CreateMovieRequest,
  Showtime,
  MovieStatus,
  AgeRating,
  Genre,
} from "@/types/movie.types";
import { ApiResponse, FilterClause, PagedResultRequestDto, PaginatedResponse } from "@/types/common.types";
import { AxiosResponse } from "axios";

const mockMovies: Movie[] = [
  {
    id: "movie-001",
    title: "Avatar: The Way of Water",
    originalTitle: "Avatar: The Way of Water",
    description: "Jake Sully và gia đình của anh ấy khám phá vùng biển rộng lớn của Pandora.",
    posterUrl: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    duration: 192,
    releaseDate: "2024-12-16",
    rating: 8.5,
    genres: [],
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    language: "English",
    subtitles: "Vietnamese",
    ageRating: AgeRating.T13,
    status: MovieStatus.NowShowing,
    country: "USA",
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    id: "movie-002",
    title: "Mai",
    originalTitle: "Mai",
    description: "Câu chuyện về một người phụ nữ kiên cường vượt qua nghịch cảnh cuộc sống.",
    posterUrl: "https://image.tmdb.org/t/p/w500/yh64nC9iftkLK190K45cHB0yP4I.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/4woSOUD0equAYzvwhWBHIJDCM88.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example",
    duration: 125,
    releaseDate: "2024-02-10",
    rating: 7.8,
    genres: [],
    director: "Trấn Thành",
    cast: ["Phương Anh Đào", "Tuấn Trần", "Hồng Đào"],
    language: "Vietnamese",
    subtitles: "English",
    ageRating: AgeRating.T16,
    status: MovieStatus.NowShowing,
    country: "Vietnam",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "movie-003",
    title: "The Nun II",
    originalTitle: "The Nun II",
    description: "Sự trở lại đầy ám ảnh của ác quỷ Valak.",
    posterUrl: "https://image.tmdb.org/t/p/w500/5gzzkR7y3hnY8AD1wXjCnVlHba5.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/53z2fXEKfnNg2uSOPss2unPBGX1.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example2",
    duration: 110,
    releaseDate: "2024-09-08",
    rating: 6.9,
    genres: [],
    director: "Michael Chaves",
    cast: ["Taissa Farmiga", "Jonas Bloquet", "Storm Reid"],
    language: "English",
    subtitles: "Vietnamese",
    ageRating: AgeRating.T18,
    status: MovieStatus.NowShowing,
    country: "USA",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-09-01T00:00:00Z",
  },
  {
    id: "movie-004",
    title: "Deadpool & Wolverine",
    originalTitle: "Deadpool & Wolverine",
    description: "Wade Wilson và Logan hợp tác trong một cuộc phiêu lưu vượt thời gian.",
    posterUrl: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example3",
    duration: 128,
    releaseDate: "2025-07-26",
    rating: 0,
    genres: [],
    director: "Shawn Levy",
    cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin"],
    language: "English",
    subtitles: "Vietnamese",
    ageRating: AgeRating.T16,
    status: MovieStatus.ComingSoon,
    country: "USA",
    createdAt: "2024-11-15T00:00:00Z",
    updatedAt: "2024-11-15T00:00:00Z",
  },
];

const mockShowtimes: Showtime[] = [
  {
    id: "showtime-001",
    movieId: "movie-001",
    cinemaId: "cinema-001",
    cinemaName: "CGV Vincom Center",
    roomId: "room-001",
    roomName: "Rạp 1 - IMAX",
    startTime: "2024-11-22T10:00:00Z",
    endTime: "2024-11-22T13:15:00Z",
    price: 120000,
    availableSeats: 45,
    totalSeats: 100,
  },
  {
    id: "showtime-002",
    movieId: "movie-001",
    cinemaId: "cinema-001",
    cinemaName: "CGV Vincom Center",
    roomId: "room-002",
    roomName: "Rạp 2 - 2D",
    startTime: "2024-11-22T14:30:00Z",
    endTime: "2024-11-22T17:45:00Z",
    price: 85000,
    availableSeats: 72,
    totalSeats: 120,
  },
  {
    id: "showtime-003",
    movieId: "movie-001",
    cinemaId: "cinema-002",
    cinemaName: "CGV Aeon Mall",
    roomId: "room-003",
    roomName: "Rạp 3 - 3D",
    startTime: "2024-11-22T19:00:00Z",
    endTime: "2024-11-22T22:15:00Z",
    price: 95000,
    availableSeats: 30,
    totalSeats: 80,
  },
];

class MovieService {
  public async getMovies(
        paging: PagedResultRequestDto = { page: 1, pageSize: 10 },

        filters?: FilterClause[] 
    ) {
        const queryString = this.buildQueryString(paging);

        const apiPath = API_ENDPOINTS.MOVIES.LIST; 
                
        const response = await apiClient.post<any>(
            `${apiPath}?${queryString}`,
        );
        
        return response.data;
    }
buildQueryString = (pagination?: PagedResultRequestDto) => {
  let params = `page=${pagination?.page}&pageSize=${pagination?.pageSize}`;
  return params;
};
  async getMovieById(id: string) {
    const response = await apiClient.get<any>(
      API_ENDPOINTS.MOVIES.DETAIL(id)
    );
    console.log("data", response)
    return response.data;
  }

  async getShowtimes(movieId: string): Promise<ApiResponse<Showtime[]>> {
    const response = await apiClient.get<ApiResponse<Showtime[]>>(
      API_ENDPOINTS.MOVIES.SHOWTIMES(movieId)
    );
    return response.data;
  }

  async getGenres(): Promise<ApiResponse<Genre[]>> {
    const response = await apiClient.get<ApiResponse<Genre[]>>("/genre");
    console.log("Genres response:", response);
    return response.data;
  }

  // Admin methods
  async createMovie(data: CreateMovieRequest): Promise<ApiResponse<Movie>> {

    const response = await apiClient.post<ApiResponse<Movie>>(
      API_ENDPOINTS.MOVIES.CREATE,
      data
    );
    return response.data;
  }

  async updateMovie(id: string, data: Partial<CreateMovieRequest>): Promise<ApiResponse<Movie>> {
    const response = await apiClient.put<ApiResponse<Movie>>(
      API_ENDPOINTS.MOVIES.UPDATE(id),
      data
    );
    return response.data;
  }

  async deleteMovie(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.MOVIES.DELETE(id)
    );
    return response.data;
  }
}

export const movieService = new MovieService();





