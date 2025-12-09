"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, Ticket, X, QrCode, AlertCircle } from "lucide-react";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import Modal from "@/components/shared/Modal";
import { bookingService } from "@/services/booking.service";
import { Booking, BookingStatus } from "@/types/booking.types";
import { formatCurrency, formatDate, formatTime, cn } from "@/lib/utils";

export default function BookingHistoryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingService.getBookings();
      if (response.success && response.datas) {
        setBookings(response.datas.items || []);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Bạn có chắc muốn hủy vé này?")) return;

    try {
      const response = await bookingService.cancelBooking(bookingId);
      if (response.success) {
        // Update local state
        setBookings(bookings.map(b => 
          b.bookingId === bookingId 
            ? { ...b, status: "cancelled" as BookingStatus }
            : b
        ));
        alert("Hủy vé thành công!");
      } else {
        alert(response.message || "Không thể hủy vé");
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-500",
      confirmed: "bg-green-500/20 text-green-500",
      completed: "bg-blue-500/20 text-blue-500",
      cancelled: "bg-red-500/20 text-red-500",
    };

    const labels = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };

    return (
      <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", styles[status])}>
        {labels[status]}
      </span>
    );
  };

  const filteredBookings = filterStatus === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  if (loading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">Lịch sử đặt vé</span>
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/profile")}
          >
            Quay lại
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors",
              filterStatus === "all"
                ? "bg-primary-500 text-white"
                : "bg-dark-800 text-gray-400 hover:bg-dark-700"
            )}
          >
            Tất cả ({bookings.length})
          </button>
          <button
            onClick={() => setFilterStatus(BookingStatus.Pending)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors",
              filterStatus === BookingStatus.Pending
                ? "bg-primary-500 text-white"
                : "bg-dark-800 text-gray-400 hover:bg-dark-700"
            )}
          >
            Chờ xác nhận ({bookings.filter(b => b.status === "pending").length})
          </button>
          <button
            onClick={() => setFilterStatus(BookingStatus.Confirmed)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors",
              filterStatus === BookingStatus.Confirmed
                ? "bg-primary-500 text-white"
                : "bg-dark-800 text-gray-400 hover:bg-dark-700"
            )}
          >
            Đã xác nhận ({bookings.filter(b => b.status === "confirmed").length})
          </button>
          <button
            onClick={() => setFilterStatus(BookingStatus.Cancelled)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors",
              filterStatus === BookingStatus.Cancelled
                ? "bg-primary-500 text-white"
                : "bg-dark-800 text-gray-400 hover:bg-dark-700"
            )}
          >
            Đã hủy ({bookings.filter(b => b.status === "cancelled").length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="card p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có vé nào</h3>
            <p className="text-gray-400 mb-6">Bạn chưa đặt vé nào trong danh mục này</p>
            <Button variant="primary" onClick={() => router.push("/movies")}>
              Đặt vé ngay
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.bookingId} className="card p-6 hover:border-primary-500/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Status & ID */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {getStatusBadge(booking.status)}
                      <span className="text-sm text-gray-500">
                        Mã: <span className="font-mono">{booking.bookingId}</span>
                      </span>
                    </div>

                    {/* Cinema & Room */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {booking.showtime.cinemaName} - {booking.showtime.roomName}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(booking.showtime.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(booking.showtime.startTime)}</span>
                      </div>
                    </div>

                    {/* Seats */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Ghế:</span>
                      <div className="flex flex-wrap gap-2">
                        {booking.seats.map((seat) => (
                          <span
                            key={seat.id}
                            className="px-2 py-1 bg-primary-500/20 text-primary-500 rounded text-xs font-semibold"
                          >
                            {seat.row}{seat.number}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-lg font-bold text-primary-500">
                      {formatCurrency(booking.totalAmount)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:min-w-[180px]">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetail(true);
                      }}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(booking.bookingId)}
                        className="text-red-500 hover:bg-red-500/10 hover:border-red-500"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hủy vé
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <Modal
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          title="Chi tiết đặt vé"
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
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Mã đặt vé:</span>
                <span className="font-mono font-semibold">{selectedBooking.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trạng thái:</span>
                {getStatusBadge(selectedBooking.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rạp chiếu:</span>
                <span className="font-semibold">{selectedBooking.showtime.cinemaName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phòng chiếu:</span>
                <span className="font-semibold">{selectedBooking.showtime.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ngày chiếu:</span>
                <span className="font-semibold">{formatDate(selectedBooking.showtime.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Giờ chiếu:</span>
                <span className="font-semibold">{formatTime(selectedBooking.showtime.startTime)}</span>
              </div>
              <div className="pt-4 border-t border-dark-700">
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng thanh toán:</span>
                  <span className="text-primary-500">{formatCurrency(selectedBooking.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") && (
              <div className="flex items-start gap-2 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg text-sm text-yellow-500">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>Vui lòng đến quầy trước giờ chiếu 15 phút với mã QR để nhận vé</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
