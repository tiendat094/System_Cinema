"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import SeatMatrix from "@/components/client/SeatMatrix";
import SeatLegend from "@/components/client/SeatLegend";
import { bookingService } from "@/services/booking.service";
import { movieService } from "@/services/movie.service";
import { SeatLayout, Seat } from "@/types/booking.types";
import { Showtime } from "@/types/movie.types";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const showtimeId = params.showtimeId as string;

  const [seatLayout, setSeatLayout] = useState<SeatLayout | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [showtimeId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch seat layout
      const seatResponse = await bookingService.getSeats(showtimeId);
      if (seatResponse.success) {
        setSeatLayout(seatResponse.datas);
        
        // Get showtime info from first seat (mock data contains showtime info)
        // In real app, fetch from showtime endpoint
        const mockShowtime: Showtime = {
          id: showtimeId,
          movieId: "movie-001",
          cinemaId: "cinema-001",
          cinemaName: "CGV Vincom Center",
          roomId: "room-001",
          roomName: "Rạp 1 - IMAX",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          price: 85000,
          availableSeats: seatResponse.datas.seats.filter(s => s.status === "available").length,
          totalSeats: seatResponse.datas.seats.length,
        };
        setShowtime(mockShowtime);
      }
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin ghế");
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      
      // Limit to 10 seats per booking
      if (prev.length >= 10) {
        alert("Bạn chỉ có thể chọn tối đa 10 ghế");
        return prev;
      }
      
      return [...prev, seatId];
    });
  };

  const getSelectedSeatsInfo = (): Seat[] => {
    if (!seatLayout) return [];
    return seatLayout.seats.filter((seat) => selectedSeats.includes(seat.id));
  };

  const calculateTotal = (): number => {
    return getSelectedSeatsInfo().reduce((sum, seat) => sum + seat.price, 0);
  };

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế");
      return;
    }

    // Save selected seats to sessionStorage for payment page
    sessionStorage.setItem("selectedSeats", JSON.stringify({
      showtimeId,
      seatIds: selectedSeats,
      seats: getSelectedSeatsInfo(),
      showtime,
      totalAmount: calculateTotal(),
    }));

    router.push(`/booking/${showtimeId}/payment`);
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải sơ đồ ghế..." />;
  }

  if (error || !seatLayout || !showtime) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Không thể tải thông tin đặt vé</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button variant="primary" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    );
  }

  const selectedSeatsInfo = getSelectedSeatsInfo();
  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen bg-dark-950 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <h1 className="text-3xl font-bold mb-8">
          <span className="gradient-text">Chọn ghế ngồi</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Selection Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Showtime Info */}
            <div className="card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-gray-400">Rạp chiếu</div>
                    <div className="font-semibold">{showtime.cinemaName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-gray-400">Phòng chiếu</div>
                    <div className="font-semibold">{showtime.roomName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-gray-400">Ngày chiếu</div>
                    <div className="font-semibold">{formatDate(showtime.startTime)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-gray-400">Giờ chiếu</div>
                    <div className="font-semibold">{formatTime(showtime.startTime)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cinema Screen */}
            <div className="card p-8">
              <div className="mb-8 text-center">
                <div className="inline-block px-12 py-3 bg-gradient-to-b from-dark-700 to-dark-800 rounded-t-2xl border-t-2 border-primary-500 shadow-lg">
                  <span className="text-lg font-semibold text-gray-300">MÀN HÌNH</span>
                </div>
              </div>

              {/* Seat Matrix */}
              <div className="overflow-x-auto custom-scrollbar">
                <SeatMatrix
                  seats={seatLayout.seats}
                  selectedSeats={selectedSeats}
                  onSeatClick={handleSeatClick}
                />
              </div>

              {/* Legend */}
              <div className="mt-8 pt-6 border-t border-dark-700">
                <SeatLegend />
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="card p-6 sticky top-24 space-y-6">
              <h3 className="text-xl font-bold">Thông tin đặt vé</h3>

              {/* Selected Seats */}
              <div>
                <div className="text-sm text-gray-400 mb-2">Ghế đã chọn</div>
                {selectedSeatsInfo.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSeatsInfo.map((seat) => (
                      <div
                        key={seat.id}
                        className="flex items-center justify-between text-sm bg-dark-800 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {seat.row}{seat.number}
                          </span>
                          <span className="text-gray-500">|</span>
                          <span className="text-gray-400 capitalize">
                            {seat.type === "vip" ? "VIP ⭐" : seat.type === "couple" ? "Đôi 👥" : "Thường"}
                          </span>
                        </div>
                        <span className="font-semibold text-primary-500">
                          {formatCurrency(seat.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chưa chọn ghế nào</p>
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedSeatsInfo.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-dark-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Số lượng ghế:</span>
                    <span className="font-semibold">{selectedSeatsInfo.length}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng tiền:</span>
                    <span className="text-primary-500">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
              >
                {selectedSeats.length > 0 ? "Tiếp tục thanh toán" : "Chọn ghế để tiếp tục"}
              </Button>

              {/* Notes */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Vui lòng kiểm tra kỹ thông tin trước khi thanh toán</p>
                <p>• Ghế đã chọn sẽ được giữ trong 10 phút</p>
                <p>• Tối đa 10 ghế mỗi lần đặt</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
