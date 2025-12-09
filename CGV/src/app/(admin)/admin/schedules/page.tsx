"use client";

import { useEffect, useState } from "react";
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Edit, Trash2, Filter } from "lucide-react";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import Modal from "@/components/shared/Modal";
import Input from "@/components/shared/Input";
import { movieService } from "@/services/movie.service";
import { Movie, Showtime, MovieStatus } from "@/types/movie.types";
import { formatDate, formatTime, cn } from "@/lib/utils";

export default function AdminSchedulesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [formData, setFormData] = useState({
    movieId: "",
    cinemaId: "cinema-1",
    cinemaName: "CGV Vincom Center",
    roomId: "room-1",
    roomName: "Phòng 1",
    startTime: "",
    endTime: "",
    price: 80000,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load movies
      const moviesResponse = await movieService.getMovies({page: 1, pageSize: 10},[
        { fieldName: "MovieStatus", value: MovieStatus.NowShowing , operator: "eq" }
      ]);
   
        setMovies(moviesResponse.items);
      

      // Load showtimes (mock data)
      // const mockShowtimes: Showtime[] = movies.flatMap(movie => 
      //   Array.from({ length: 3 }, (_, i) => ({
      //     id: `showtime-${movie.id}-${i}`,
      //     movieId: movie.id,
      //     cinemaId: `cinema-${i + 1}`,
      //     cinemaName: `CGV Cinema ${i + 1}`,
      //     roomId: `room-${i + 1}`,
      //     roomName: `Phòng ${i + 1}`,
      //     startTime: new Date(Date.now() + (i + 1) * 3600000 * 3).toISOString(),
      //     endTime: new Date(Date.now() + (i + 1) * 3600000 * 3 + movie.duration * 60000).toISOString(),
      //     price: 80000 + i * 10000,
      //     availableSeats: 96,
      //     totalSeats: 96,
      //   }))
      // );
     // setShowtimes(mockShowtimes);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      movieId: "",
      cinemaId: "cinema-1",
      cinemaName: "CGV Vincom Center",
      roomId: "room-1",
      roomName: "Phòng 1",
      startTime: "",
      endTime: "",
      price: 80000,
    });
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    try {
      // In production, call API to create showtime
      alert("Thêm lịch chiếu thành công!");
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error("Failed to save showtime:", error);
      alert("Lưu lịch chiếu thất bại. Vui lòng thử lại");
    }
  };

  const handleDelete = async (showtimeId: string) => {
    if (!confirm("Bạn có chắc muốn xóa lịch chiếu này?")) return;

    try {
      alert("Xóa lịch chiếu thành công!");
      loadData();
    } catch (error) {
      console.error("Failed to delete showtime:", error);
      alert("Xóa lịch chiếu thất bại. Vui lòng thử lại");
    }
  };

  const filteredShowtimes = showtimes.filter(showtime => {
    const showtimeDate = new Date(showtime.startTime).toISOString().split("T")[0];
    return showtimeDate === selectedDate;
  });

  // Group showtimes by movie
  const showtimesByMovie = filteredShowtimes.reduce((acc, showtime) => {
    const movie = movies.find(m => m.id === showtime.movieId);
    if (!movie) return acc;

    if (!acc[movie.id]) {
      acc[movie.id] = { movie, showtimes: [] };
    }
    acc[movie.id].showtimes.push(showtime);
    return acc;
  }, {} as Record<string, { movie: Movie; showtimes: Showtime[] }>);

  if (loading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Quản lý lịch chiếu</span>
          </h1>
          <p className="text-gray-400">Quản lý suất chiếu phim trong hệ thống</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus className="w-5 h-5 mr-2" />
          Thêm lịch chiếu
        </Button>
      </div>

      {/* Date Filter */}
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-5 h-5 text-primary-500" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="max-w-xs"
          />
          <span className="text-gray-400">
            {filteredShowtimes.length} suất chiếu
          </span>
        </div>
      </div>

      {/* Showtimes by Movie */}
      {Object.keys(showtimesByMovie).length === 0 ? (
        <div className="card p-12 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Chưa có lịch chiếu</h3>
          <p className="text-gray-400 mb-6">Chưa có suất chiếu nào trong ngày này</p>
          <Button variant="primary" onClick={handleCreate}>
            Thêm lịch chiếu
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(showtimesByMovie).map(({ movie, showtimes }) => (
            <div key={movie.id} className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-16 h-24 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {movie.genres.map(g => g.name).join(", ")} • {movie.duration} phút • {movie.ageRating}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Đạo diễn: {movie.director}</span>
                  </div>
                </div>
              </div>

              {/* Showtimes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {showtimes.map((showtime) => (
                  <div
                    key={showtime.id}
                    className="p-4 bg-dark-800/50 rounded-lg hover:bg-dark-800 transition-colors border border-dark-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>{showtime.cinemaName}</span>
                        </div>
                        <div className="text-xs text-gray-500">{showtime.roomName}</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(showtime.id)}
                          className="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span className="font-semibold text-lg">{formatTime(showtime.startTime)}</span>
                      <span className="text-gray-400 text-sm">- {formatTime(showtime.endTime)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Còn {showtime.availableSeats}/{showtime.totalSeats} ghế
                      </span>
                      <span className="font-semibold text-primary-500">
                        {showtime.price.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Thêm lịch chiếu mới"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phim *</label>
            <select
              value={formData.movieId}
              onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            >
              <option value="">Chọn phim</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rạp *</label>
              <select
                value={formData.cinemaId}
                onChange={(e) => {
                  const cinema = e.target.value;
                  setFormData({ 
                    ...formData, 
                    cinemaId: cinema,
                    cinemaName: `CGV Cinema ${cinema.split('-')[1]}`
                  });
                }}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              >
                <option value="cinema-1">CGV Vincom Center</option>
                <option value="cinema-2">CGV Aeon Mall</option>
                <option value="cinema-3">CGV Landmark</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phòng *</label>
              <select
                value={formData.roomId}
                onChange={(e) => {
                  const room = e.target.value;
                  setFormData({ 
                    ...formData, 
                    roomId: room,
                    roomName: `Phòng ${room.split('-')[1]}`
                  });
                }}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              >
                <option value="room-1">Phòng 1</option>
                <option value="room-2">Phòng 2</option>
                <option value="room-3">Phòng 3</option>
                <option value="room-4">Phòng 4</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Giờ bắt đầu *</label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Giờ kết thúc *</label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Giá vé *</label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              placeholder="80000"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-dark-700">
            <Button variant="primary" onClick={handleSave} className="flex-1">
              Thêm lịch chiếu
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
