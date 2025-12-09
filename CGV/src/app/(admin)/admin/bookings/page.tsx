"use client";

import { useEffect, useState } from "react";
import { Search, Ticket, Eye, X, CheckCircle, Calendar, Clock, MapPin, User, DollarSign, Filter } from "lucide-react";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Loading from "@/components/shared/Loading";
import Modal from "@/components/shared/Modal";
import { bookingService } from "@/services/booking.service";
import { userService } from "@/services/user.service";
import { Booking, BookingStatus } from "@/types/booking.types";
import { formatCurrency, formatDate, formatTime, cn } from "@/lib/utils";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      // Load all users' bookings
      const response = await userService.getAllBookings();
      if (response.success && response.datas) {
        setBookings(response.datas.items);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const response = await bookingService.updateBookingStatus(bookingId, status);
      if (response.success) {
        alert("Cập nhật trạng thái thành công!");
        loadBookings();
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status });
        }
      } else {
        alert(response.message || "Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Bạn có chắc muốn hủy đặt vé này?")) return;

    try {
      const response = await bookingService.cancelBooking(bookingId);
      if (response.success) {
        alert("Hủy đặt vé thành công!");
        loadBookings();
      } else {
        alert(response.message || "Hủy đặt vé thất bại");
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const styles: Record<string, string> = {
      [BookingStatus.Pending]: "bg-yellow-500/20 text-yellow-500",
      [BookingStatus.Confirmed]: "bg-green-500/20 text-green-500",
      [BookingStatus.Completed]: "bg-blue-500/20 text-blue-500",
      [BookingStatus.Cancelled]: "bg-red-500/20 text-red-500",
    };

    const labels: Record<string, string> = {
      [BookingStatus.Pending]: "Chờ xác nhận",
      [BookingStatus.Confirmed]: "Đã xác nhận",
      [BookingStatus.Completed]: "Hoàn thành",
      [BookingStatus.Cancelled]: "Đã hủy",
    };

    return (
      <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", styles[status])}>
        {labels[status]}
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.movieTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Calculate statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === BookingStatus.Pending).length,
    confirmed: bookings.filter(b => b.status === BookingStatus.Confirmed).length,
    completed: bookings.filter(b => b.status === BookingStatus.Completed).length,
    cancelled: bookings.filter(b => b.status === BookingStatus.Cancelled).length,
    totalRevenue: bookings
      .filter(b => b.status !== BookingStatus.Cancelled)
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Quản lý đặt vé</span>
          </h1>
          <p className="text-gray-400">Quản lý tất cả đặt vé trong hệ thống</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card p-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Tổng đặt vé</p>
            <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Chờ xác nhận</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Đã xác nhận</p>
            <p className="text-2xl font-bold text-green-500">{stats.confirmed}</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Hoàn thành</p>
            <p className="text-2xl font-bold text-blue-500">{stats.completed}</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Đã hủy</p>
            <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Doanh thu</p>
            <p className="text-lg font-bold text-green-500">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo mã đặt vé, tên phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                statusFilter === "all"
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter(BookingStatus.Pending)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                statusFilter === BookingStatus.Pending
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Chờ xác nhận
            </button>
            <button
              onClick={() => setStatusFilter(BookingStatus.Confirmed)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                statusFilter === BookingStatus.Confirmed
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Đã xác nhận
            </button>
            <button
              onClick={() => setStatusFilter(BookingStatus.Completed)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                statusFilter === BookingStatus.Completed
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Hoàn thành
            </button>
            <button
              onClick={() => setStatusFilter(BookingStatus.Cancelled)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                statusFilter === BookingStatus.Cancelled
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Đã hủy
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-800">
              <tr>
                <th className="text-left p-4 font-semibold">Mã đặt vé</th>
                <th className="text-left p-4 font-semibold">Phim</th>
                <th className="text-left p-4 font-semibold">Rạp & Phòng</th>
                <th className="text-left p-4 font-semibold">Suất chiếu</th>
                <th className="text-left p-4 font-semibold">Ghế</th>
                <th className="text-left p-4 font-semibold">Tổng tiền</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    Không tìm thấy đặt vé nào
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-sm">
                        <p className="font-semibold text-primary-500">{booking.bookingId}</p>
                        <p className="text-xs text-gray-500">{formatDate(booking.createdAt)}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{booking.movieTitle}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{booking.cinemaName}</p>
                      <p className="text-xs text-gray-400">{booking.roomName}</p>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(booking.showtime.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(booking.showtime.startTime)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {booking.seats.slice(0, 3).map((seat) => (
                          <span
                            key={seat.id}
                            className="px-2 py-0.5 bg-primary-500/20 text-primary-500 rounded text-xs font-semibold"
                          >
                            {seat.row}{seat.number}
                          </span>
                        ))}
                        {booking.seats.length > 3 && (
                          <span className="px-2 py-0.5 bg-dark-700 text-gray-400 rounded text-xs">
                            +{booking.seats.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-green-500">{formatCurrency(booking.totalAmount)}</p>
                    </td>
                    <td className="p-4">{getStatusBadge(booking.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetail(true);
                          }}
                          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {booking.status === BookingStatus.Pending && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, BookingStatus.Confirmed)}
                            className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"
                            title="Xác nhận"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed) && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                            title="Hủy"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <Modal
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          title="Chi tiết đặt vé"
          size="lg"
        >
          <div className="space-y-6">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40 bg-white rounded-xl p-3 shadow-xl">
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-1">📱</div>
                    <div className="text-xs text-gray-600 font-mono">
                      {selectedBooking.bookingId.slice(0, 8)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Mã đặt vé</p>
                <p className="font-mono font-semibold">{selectedBooking.bookingId}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Trạng thái</p>
                {getStatusBadge(selectedBooking.status)}
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-1">Phim</p>
                <p className="font-semibold">{selectedBooking.movieTitle}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Rạp chiếu</p>
                <p className="font-semibold">{selectedBooking.cinemaName}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Phòng chiếu</p>
                <p className="font-semibold">{selectedBooking.roomName}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Ngày chiếu</p>
                <p className="font-semibold">{formatDate(selectedBooking.showtime.startTime)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Giờ chiếu</p>
                <p className="font-semibold">{formatTime(selectedBooking.showtime.startTime)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-2">Ghế đã đặt</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.seats.map((seat) => (
                    <span
                      key={seat.id}
                      className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded-lg font-semibold"
                    >
                      {seat.row}{seat.number}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-2 pt-4 border-t border-dark-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-400">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-primary-500">
                    {formatCurrency(selectedBooking.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-dark-700">
              {selectedBooking.status === BookingStatus.Pending && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdateStatus(selectedBooking.id, BookingStatus.Confirmed);
                    setShowDetail(false);
                  }}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Xác nhận đặt vé
                </Button>
              )}
              {selectedBooking.status === BookingStatus.Confirmed && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdateStatus(selectedBooking.id, BookingStatus.Completed);
                    setShowDetail(false);
                  }}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Hoàn thành
                </Button>
              )}
              {(selectedBooking.status === BookingStatus.Pending || 
                selectedBooking.status === BookingStatus.Confirmed) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleCancel(selectedBooking.id);
                    setShowDetail(false);
                  }}
                  className="text-red-500 hover:bg-red-500/10 hover:border-red-500"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy đặt vé
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
