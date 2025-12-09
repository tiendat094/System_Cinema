"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Play, 
  Clock, 
  Calendar, 
  Globe, 
  Star,
  Users,
  MapPin,
  ChevronRight 
} from "lucide-react";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import { movieService } from "@/services/movie.service";
import { MovieDetailResponse, Showtime } from "@/types/movie.types";
import { formatDate, formatDuration, formatTime, groupBy } from "@/lib/utils";
import { AGE_RATINGS } from "@/lib/constants";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<MovieDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    fetchMovieDetail();
  }, [movieId]);

  const fetchMovieDetail = async () => {
    setLoading(true);
    try {
      console.log("Check",movieId);
      const response = await movieService.getMovieById(movieId);
        setMovie(response);
        console.log("Movie detail:", response);
        // Auto select first date
        // if (response.showtimes.length > 0) {
        //   const firstDate = response.showtimes[0].startTime.split("T")[0];
        //   setSelectedDate(firstDate);
        // }    
    } catch (error) {
      console.error("Failed to fetch movie:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải thông tin phim..." />;
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy phim</h2>
        <Link href="/movies">
          <Button variant="primary">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  // Group showtimes by date and cinema
  // const showtimesByDate = groupBy(
  //   movie.showtimes.map((s) => ({
  //     ...s,
  //     date: s.startTime.split("T")[0],
  //   })),
  //   "date"
  // );

  const showtimesForSelectedDate = selectedDate 
    ? movie.showtimes.filter((s) => s.startTime.startsWith(selectedDate))
    : [];

  const showtimesByCinema = groupBy(showtimesForSelectedDate, "cinemaName");

  const ageRatingInfo = AGE_RATINGS[movie.ageRating];

  return (
    <div>
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-dark-950/40" />
        </div>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              {/* Poster */}
              <div className="relative w-48 h-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`${ageRatingInfo.color} px-3 py-1 rounded-md text-sm font-bold`}>
                    {movie.ageRating}
                  </span>
                  {movie.rating > 0 && (
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-md">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{movie.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-3">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(movie.releaseDate, "long")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{movie.language}</span>
                  </div>
                </div>
{/* 
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-dark-800/80 backdrop-blur-sm rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div> */}

                {movie.trailerUrl && (
                  <Button variant="primary" size="lg">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Xem Trailer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Nội dung phim</h2>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </section>

            {/* Showtimes */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Lịch chiếu</h2>
              
              {movie.showtimes.length === 0 ? (
                <div className="card p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Chưa có lịch chiếu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Date Selector
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {Object.keys(showtimesByDate).map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                          selectedDate === date
                            ? "bg-primary-600 text-white"
                            : "bg-dark-800 text-gray-300 hover:bg-dark-700"
                        }`}
                      >
                        {formatDate(date)}
                      </button>
                    ))}
                  </div> */}

                  {/* Showtimes by Cinema 
                  <div className="space-y-4">
                    {Object.entries(showtimesByCinema).map(([cinemaName, showtimes]) => (
                      <div key={cinemaName} className="card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5 text-primary-500" />
                          <h3 className="text-lg font-semibold">{cinemaName}</h3>
                        </div>
                        
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {showtimes.map((showtime) => (
                            <Link
                              key={showtime.id}
                              href={`/booking/${showtime.id}`}
                            >
                              <button className="w-full px-4 py-3 bg-dark-800 hover:bg-primary-600 rounded-lg transition-colors border border-dark-700 hover:border-primary-500">
                                <div className="font-semibold">
                                  {formatTime(showtime.startTime)}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {showtime.availableSeats}/{showtime.totalSeats} ghế
                                </div>
                              </button>
                            </Link>
                          ))}
                        </div> 
                      </div>
                    ))}
                  </div>*/}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Movie Info Card */}
            <div className="card p-6 space-y-4">
              <h3 className="text-xl font-bold mb-4">Thông tin phim</h3>
              
              <div>
                <div className="text-gray-400 text-sm mb-1">Đạo diễn</div>
                <div className="font-semibold">{movie.director}</div>
              </div>

              <div>
                <div className="text-gray-400 text-sm mb-1">Diễn viên</div>
                <div className="font-semibold">{movie.cast}</div>
              </div>

              <div>
                <div className="text-gray-400 text-sm mb-1">Quốc gia</div>
                <div className="font-semibold">{movie.country}</div>
              </div>

              <div>
                <div className="text-gray-400 text-sm mb-1">Ngôn ngữ</div>
                <div className="font-semibold">{movie.language}</div>
              </div>

              <div>
                <div className="text-gray-400 text-sm mb-1">Phụ đề</div>
                <div className="font-semibold">{movie.subtitles}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
