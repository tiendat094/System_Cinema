"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Download, Mail, Home, Ticket } from "lucide-react";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import { Seat } from "@/types/booking.types";
import { Showtime } from "@/types/movie.types";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import Image from "next/image";

interface BookingConfirmation {
  bookingId: string;
  qrCode: string;
  seats: Seat[];
  showtime: Showtime;
  totalAmount: number;
}

export default function BookingSuccessPage() {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    // Get confirmation data from sessionStorage
    const data = sessionStorage.getItem("bookingConfirmation");
    if (!data) {
      router.push("/movies");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      setConfirmation(parsed);
    } catch (err) {
      console.error("Failed to parse confirmation data:", err);
      router.push("/movies");
    }
  }, [router]);

  const handleDownload = () => {
    if (!confirmation) return;
    
    // In production, this would download a PDF ticket
    alert("Tính năng tải vé sẽ sớm được cập nhật!");
  };

  const handleEmail = () => {
    if (!confirmation) return;
    
    // In production, this would send email
    alert("Vé đã được gửi đến email của bạn!");
  };

  if (!confirmation) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8 animate-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Đặt vé thành công!</span>
          </h1>
          <p className="text-gray-400">
            Cảm ơn bạn đã đặt vé tại SystemCinema
          </p>
        </div>

        {/* Ticket Card */}
        <div className="card p-8 mb-6">
          {/* QR Code */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48 bg-white rounded-2xl p-4 shadow-xl">
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                {/* Mock QR Code */}
                <div className="text-center">
                  <div className="text-6xl mb-2">📱</div>
                  <div className="text-xs text-gray-600 font-mono">
                    {confirmation.bookingId.slice(0, 8)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking ID */}
          <div className="text-center mb-8">
            <div className="text-sm text-gray-400 mb-1">Mã đặt vé</div>
            <div className="text-2xl font-bold font-mono tracking-wider text-primary-500">
              {confirmation.bookingId}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="space-y-6">
            {/* Movie Info */}
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-dark-700">
              <div>
                <div className="text-sm text-gray-400 mb-1">Rạp chiếu</div>
                <div className="font-semibold">{confirmation.showtime.cinemaName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Phòng chiếu</div>
                <div className="font-semibold">{confirmation.showtime.roomName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Ngày chiếu</div>
                <div className="font-semibold">{formatDate(confirmation.showtime.startTime)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Giờ chiếu</div>
                <div className="font-semibold">{formatTime(confirmation.showtime.startTime)}</div>
              </div>
            </div>

            {/* Seats */}
            <div>
              <div className="text-sm text-gray-400 mb-3">Ghế đã đặt</div>
              <div className="flex flex-wrap gap-2">
                {confirmation.seats.map((seat) => (
                  <div
                    key={seat.id}
                    className="px-4 py-2 bg-primary-500/20 text-primary-500 rounded-lg font-semibold"
                  >
                    {seat.row}{seat.number}
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="pt-6 border-t border-dark-700">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-400">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-primary-500">
                  {formatCurrency(confirmation.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handleDownload}
            className="flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Tải vé
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleEmail}
            className="flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Gửi email
          </Button>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/profile/bookings")}
            className="flex items-center justify-center gap-2"
          >
            <Ticket className="w-5 h-5" />
            Xem lịch sử đặt vé
          </Button>
        </div>

        {/* Important Note */}
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
          <p className="text-sm text-yellow-500 text-center">
            <strong>Lưu ý:</strong> Vui lòng đến quầy trước giờ chiếu 15 phút với mã QR để nhận vé
          </p>
        </div>
      </div>
    </div>
  );
}
