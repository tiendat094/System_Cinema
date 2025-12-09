"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MovieCard from "@/components/client/MovieCard";
import Loading from "@/components/shared/Loading";
import Button from "@/components/shared/Button";
import { movieService } from "@/services/movie.service";
import { Movie, MovieStatus } from "@/types/movie.types";
import { Search, Filter } from "lucide-react";

export default function MoviesClient() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as MovieStatus | null;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<MovieStatus | "">((statusParam as MovieStatus) || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    console.log("Check1");
    fetchMovies();
  }, [selectedStatus, page]);

  const fetchMovies = async () => {
    setLoading(true);
    console.log("Chek");
    try {
      const response = await movieService.getMovies(
        {page, pageSize: 12},
        [
         { fieldName: "MovieStatus", value: selectedStatus , operator: "eq" },
         { fieldName: "Title", value: searchQuery , operator: "like" },
        ]    
      );
        console.log("Fetched movies:", response);

        console.log("Movies data:", movies);
         console.log("Movies data:", totalPages);
        setMovies(response.items );
        setTotalPages(response.totalPages);
      
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchMovies();
  };

  const statusTabs = [
    { value: "", label: "Tất cả" },
    { value: MovieStatus.NowShowing, label: "Đang chiếu" },
    { value: MovieStatus.ComingSoon, label: "Sắp chiếu" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Danh sách phim</span>
        </h1>
        <p className="text-gray-400">Khám phá những bộ phim mới nhất</p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap">
          {statusTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={selectedStatus === tab.value ? "primary" : "secondary"}
              onClick={() => {
                setSelectedStatus(tab.value as MovieStatus | "");
                setPage(1);
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button variant="primary" onClick={handleSearch}>
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Movie Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loading size="lg" text="Đang tải phim..." />
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20">
          <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Không tìm thấy phim</h3>
          <p className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Trước
              </Button>
              
              <div className="flex items-center gap-2 px-4">
                <span className="text-gray-400">
                  Trang {page} / {totalPages}
                </span>
              </div>

              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
