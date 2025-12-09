"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import PaymentMethodCard from "@/components/client/PaymentMethodCard";
import { paymentService } from "@/services/payment.service";
import { bookingService } from "@/services/booking.service";
import { PaymentMethod } from "@/types/payment.types";
import { Seat } from "@/types/booking.types";
import { Showtime } from "@/types/movie.types";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/lib/constants";

interface BookingData {
  showtimeId: string;
  seatIds: string[];
  seats: Seat[];
  showtime: Showtime;
  totalAmount: number;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const showtimeId = params.showtimeId as string;

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(600); // 10 minutes

  useEffect(() => {
    // Get booking data from sessionStorage
    const data = sessionStorage.getItem("selectedSeats");
    if (!data) {
      router.push(`/booking/${showtimeId}`);
      return;
    }

    try {
      const parsed = JSON.parse(data);
      setBookingData(parsed);
    } catch (err) {
      console.error("Failed to parse booking data:", err);
      router.push(`/booking/${showtimeId}`);
    }
  }, [showtimeId, router]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      alert("Hết thời gian giữ ghế. Vui lòng chọn lại ghế.");
      router.push(`/booking/${showtimeId}`);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router, showtimeId]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePayment = async () => {
    if (!selectedMethod || !bookingData) {
      setError("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Create booking
      const bookingResponse = await bookingService.createBooking({
        showtimeId: bookingData.showtimeId,
        seatIds: bookingData.seatIds,
      });

      if (!bookingResponse.success) {
        throw new Error(bookingResponse.message || "Không thể tạo booking");
      }

      // Step 2: Create payment
      const paymentResponse = await paymentService.createPayment({
        bookingId: bookingResponse.datas.bookingId,
        method: selectedMethod,
        returnUrl: `${window.location.origin}/booking/success`,
      });

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || "Không thể tạo thanh toán");
      }

      // Step 3: Handle payment redirect
      const payment = paymentResponse.datas;

      if (payment.paymentUrl) {
        // Redirect to payment gateway (MoMo, ZaloPay, VNPay)
        window.location.href = payment.paymentUrl;
      } else {
        // Direct payment (cash, card at counter)
        // Save booking info and redirect to success page
        sessionStorage.setItem("bookingConfirmation", JSON.stringify({
          bookingId: bookingResponse.datas.bookingId,
          qrCode: bookingResponse.datas.qrCode,
          seats: bookingResponse.datas.seats,
          showtime: bookingResponse.datas.showtime,
          totalAmount: bookingResponse.datas.totalAmount,
        }));
        
        router.push("/booking/success");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return <Loading fullScreen text="Đang tải thông tin..." />;
  }

  return (
    <div className="min-h-screen bg-dark-950 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">Thanh toán</span>
        </h1>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <AlertCircle className="w-4 h-4" />
          <span>Thời gian giữ ghế: </span>
          <span className={countdown < 60 ? "text-red-500 font-bold" : "text-primary-500 font-semibold"}>
            {formatCountdown(countdown)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-6">Chọn phương thức thanh toán</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <PaymentMethodCard
                    key={method.value}
                    method={method as { value: PaymentMethod; label: string; icon: string }}
                    selected={selectedMethod === method.value}
                    onClick={() => setSelectedMethod(method.value as PaymentMethod)}
                  />
                ))}
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-3 text-red-500">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Payment Instructions */}
            {selectedMethod && (
              <div className="card p-6 animate-in">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-500" />
                  Hướng dẫn thanh toán
                </h4>
                <div className="text-sm text-gray-400 space-y-2">
                  {selectedMethod === "cash" && (
                    <>
                      <p>1. Nhấn "Xác nhận thanh toán" để tạo đơn hàng</p>
                      <p>2. Mang mã QR đến quầy để thanh toán và nhận vé</p>
                      <p>3. Vui lòng đến quầy trước giờ chiếu 15 phút</p>
                    </>
                  )}
                  {(selectedMethod === "momo" || selectedMethod === "zalopay" || selectedMethod === "vnpay") && (
                    <>
                      <p>1. Nhấn "Xác nhận thanh toán"</p>
                      <p>2. Bạn sẽ được chuyển đến trang thanh toán của {PAYMENT_METHODS.find(m => m.value === selectedMethod)?.label}</p>
                      <p>3. Hoàn tất thanh toán để nhận vé</p>
                    </>
                  )}
                  {(selectedMethod === "credit_card" || selectedMethod === "debit_card") && (
                    <>
                      <p>1. Nhấn "Xác nhận thanh toán"</p>
                      <p>2. Nhập thông tin thẻ của bạn</p>
                      <p>3. Xác nhận OTP để hoàn tất</p>
                    </>
                  )}
                  {selectedMethod === "banking" && (
                    <>
                      <p>1. Nhấn "Xác nhận thanh toán"</p>
                      <p>2. Quét mã QR bằng app ngân hàng</p>
                      <p>3. Hoàn tất chuyển khoản</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24 space-y-6">
              <h3 className="text-xl font-bold">Thông tin đơn hàng</h3>

              {/* Movie & Showtime Info */}
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-400">Rạp chiếu</div>
                  <div className="font-semibold">{bookingData.showtime.cinemaName}</div>
                </div>
                <div>
                  <div className="text-gray-400">Phòng chiếu</div>
                  <div className="font-semibold">{bookingData.showtime.roomName}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-gray-400">Ngày</div>
                    <div className="font-semibold">{formatDate(bookingData.showtime.startTime)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Giờ</div>
                    <div className="font-semibold">{formatTime(bookingData.showtime.startTime)}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-dark-700 pt-4">
                <div className="text-gray-400 text-sm mb-2">Ghế đã chọn</div>
                <div className="flex flex-wrap gap-2">
                  {bookingData.seats.map((seat) => (
                    <span
                      key={seat.id}
                      className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-sm font-semibold"
                    >
                      {seat.row}{seat.number}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-dark-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Số lượng vé:</span>
                  <span className="font-semibold">{bookingData.seats.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tổng tiền vé:</span>
                  <span className="font-semibold">{formatCurrency(bookingData.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-700">
                  <span>Tổng thanh toán:</span>
                  <span className="text-primary-500">{formatCurrency(bookingData.totalAmount)}</span>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handlePayment}
                isLoading={loading}
                disabled={!selectedMethod || loading}
              >
                {selectedMethod ? "Xác nhận thanh toán" : "Chọn phương thức thanh toán"}
              </Button>

              {/* Security Note */}
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Giao dịch được bảo mật và mã hóa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
