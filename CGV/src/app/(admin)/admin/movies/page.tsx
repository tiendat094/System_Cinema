"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Loading from "@/components/shared/Loading";
import Modal from "@/components/shared/Modal";
import { movieService } from "@/services/movie.service";
import { Movie, MovieStatus, AgeRating , Genre} from "@/types/movie.types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import Image from "next/image";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genre, setGenre] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MovieStatus | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
    director: string;
    cast: string;
    genres: string;
    language: string;
    ageRating: AgeRating;
    posterUrl: string;
    trailerUrl: string;
    status: MovieStatus;
  }>({
    title: "",
    description: "",
    duration: 120,
    releaseDate: "",
    director: "",
    cast: "",
    genres: "",
    language: "Tiếng Việt",
    ageRating: "P" as AgeRating,
    posterUrl: "",
    trailerUrl: "",
    status: "now_showing" as MovieStatus,
  });

  useEffect(() => {
    loadMovies();
    loadGenre();
  }, []);

  const loadMovies = async () => {
    try {
       const response = await movieService.getMovies(
        {page: 1, pageSize: 12},    
      );
     console.log("Fetched movies:", response);

        console.log("Movies data:", movies);

        setMovies(response.items );  
    } catch (error) {
      console.error("Failed to load movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadGenre = async () =>{
      const response = await movieService.getGenres();
      setGenre(response.datas);
  }
  const handleCreate = () => {
    setEditingMovie(null);
    setFormData({
      title: "",
      description: "",
      duration: 120,
      releaseDate: new Date().toISOString().split("T")[0],
      director: "",
      cast: "",
      genres: "",
      language: "Tiếng Việt",
      ageRating: AgeRating.P,
      posterUrl: "",
      trailerUrl: "",
      status: MovieStatus.NowShowing,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      releaseDate: movie.releaseDate.split("T")[0],
      director: movie.director,
      cast: movie.cast.join(", "),
      genres: movie.genres.map(g => g.name).join(", "),
      language: movie.language,
      ageRating: movie.ageRating,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl || "",
      status: movie.status,
    });
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    try {
      const movieData: any = {
        ...formData,
        cast: formData.cast.split(",").map(s => s.trim()),
        genreIds: formData.genres.split(",").map(s => s.trim()),
      };

      if (editingMovie) {
        await movieService.updateMovie(editingMovie.id, movieData);
        alert("Cập nhật phim thành công!");
      } else {
        await movieService.createMovie(movieData);
        alert("Thêm phim thành công!");
      }

      setShowCreateModal(false);
      loadMovies();
    } catch (error) {
      console.error("Failed to save movie:", error);
      alert("Lưu phim thất bại. Vui lòng thử lại");
    }
  };

  const handleDelete = async (movieId: string) => {
    if (!confirm("Bạn có chắc muốn xóa phim này?")) return;

    try {
      await movieService.deleteMovie(movieId);
      alert("Xóa phim thành công!");
      loadMovies();
    } catch (error) {
      console.error("Failed to delete movie:", error);
      alert("Xóa phim thất bại. Vui lòng thử lại");
    }
  };

  const getStatusBadge = (status: MovieStatus) => {
    const styles: Record<string, string> = {
      now_showing: "bg-green-500/20 text-green-500",
      coming_soon: "bg-blue-500/20 text-blue-500",
      ended: "bg-gray-500/20 text-gray-500",
    };

    const labels: Record<string, string> = {
      now_showing: "Đang chiếu",
      coming_soon: "Sắp chiếu",
      ended: "Đã kết thúc",
    };

    return (
      <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", styles[status])}>
        {labels[status]}
      </span>
    );
  };

  const filteredMovies = movies
    .filter((movie) => {
      const matchSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || movie.status === statusFilter;
      return matchSearch && matchStatus;
    });

  if (loading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Quản lý phim</span>
          </h1>
          <p className="text-gray-400">Quản lý danh sách phim trong hệ thống</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus className="w-5 h-5 mr-2" />
          Thêm phim
        </Button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                statusFilter === "all"
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter(MovieStatus.NowShowing)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                statusFilter === MovieStatus.NowShowing
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Đang chiếu
            </button>
            <button
              onClick={() => setStatusFilter(MovieStatus.ComingSoon)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                statusFilter === MovieStatus.ComingSoon
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Sắp chiếu
            </button>
          </div>
        </div>
      </div>

      {/* Movies Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-800">
              <tr>
                <th className="text-left p-4 font-semibold">Phim</th>
                <th className="text-left p-4 font-semibold">Thể loại</th>
                <th className="text-left p-4 font-semibold">Thời lượng</th>
                <th className="text-left p-4 font-semibold">Ngày phát hành</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-left p-4 font-semibold">Rating</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={movie.posterUrl}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{movie.title}</p>
                        <p className="text-sm text-gray-400">{movie.director}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.slice(0, 2).map((genre) => (
                        <span key={genre.id} className="px-2 py-1 bg-dark-700 rounded text-xs">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{movie.duration} phút</td>
                  <td className="p-4 text-gray-400">{formatDate(movie.releaseDate)}</td>
                  <td className="p-4">{getStatusBadge(movie.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{movie.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(`/movies/${movie.id}`, "_blank")}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                        title="Xem"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(movie)}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={editingMovie ? "Chỉnh sửa phim" : "Thêm phim mới"}
        size="xl"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Tên phim *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tên phim"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Mô tả *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả phim"
                rows={4}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Đạo diễn *</label>
              <Input
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                placeholder="Nhập tên đạo diễn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thời lượng (phút) *</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ngày phát hành *</label>
              <Input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
              <Input
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                placeholder="Tiếng Việt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Độ tuổi</label>
              <select
                value={formData.ageRating}
                onChange={(e) => setFormData({ ...formData, ageRating: e.target.value as AgeRating })}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              >
                <option value="0">P - Phổ biến</option>
                <option value="2">T13 - Trên 13 tuổi</option>
                <option value="3">T16 - Trên 16 tuổi</option>
                <option value="4">T18 - Trên 18 tuổi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MovieStatus })}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              >
                <option value="showing">Đang chiếu</option>
                <option value="coming_soon">Sắp chiếu</option>
                <option value="ended">Đã kết thúc</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Diễn viên (phân cách bằng dấu phẩy)</label>
              <Input
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                placeholder="Tom Holland, Zendaya, Benedict Cumberbatch"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Thể loại (phân cách bằng dấu phẩy)</label>
              <Input
                value={formData.genres}
                onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                placeholder="Action, Adventure, Sci-Fi"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">URL Poster</label>
              <Input
                value={formData.posterUrl}
                onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">URL Trailer</label>
              <Input
                value={formData.trailerUrl}
                onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-dark-700">
            <Button variant="primary" onClick={handleSave} className="flex-1">
              {editingMovie ? "Cập nhật" : "Thêm phim"}
            </Button>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
