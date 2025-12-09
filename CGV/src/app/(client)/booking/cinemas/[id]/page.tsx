"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CinemaDetailResponse } from "@/types/cinema.types";
import { cinemaService } from "@/services/cinema.service";
import Loading from "@/components/shared/Loading";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail,
  ArrowLeft,
  Navigation,
  Film,
  Users,
  CheckCircle,
  Armchair,
  Map as MapIcon,
  Info
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CinemaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cinemaId = params.id as string;

  const [cinema, setCinema] = useState<CinemaDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchCinemaDetail();
  }, [cinemaId]);

  const fetchCinemaDetail = async () => {
    setLoading(true);
    try {
      const response = await cinemaService.getCinemaById(cinemaId);
      if (response.success && response.datas) {
        setCinema(response.datas);
      }
    } catch (error) {
      console.error("Failed to fetch cinema:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải thông tin rạp..." />;
  }

  if (!cinema) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy rạp chiếu</h2>
        <Link href="/cinemas">
          <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
            Quay lại danh sách
          </button>
        </Link>
      </div>
    );
  }

  const roomTypeLabels: Record<string, string> = {
    standard: "Tiêu chuẩn",
    vip: "VIP",
    imax: "IMAX",
    "4dx": "4DX",
    dolby: "Dolby",
    sweetbox: "Sweetbox",
  };

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

        {/* Cinema Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              {/* Main Image */}
              <div className="relative h-[400px] bg-dark-800">
                <Image
                  src={cinema.images[selectedImage] || cinema.thumbnail}
                  alt={cinema.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnail Gallery */}
              {cinema.images.length > 1 && (
                <div className="p-4 bg-dark-900 flex gap-2 overflow-x-auto custom-scrollbar">
                  {cinema.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary-500 scale-105"
                          : "border-dark-700 hover:border-primary-500/50"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${cinema.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cinema Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h1 className="text-3xl font-bold mb-6 gradient-text">
                {cinema.name}
              </h1>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Địa chỉ</div>
                    <p className="text-white">{cinema.address}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {cinema.district}, {cinema.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Hotline</div>
                    <a
                      href={`tel:${cinema.phoneNumber}`}
                      className="text-white hover:text-primary-500 transition-colors"
                    >
                      {cinema.phoneNumber}
                    </a>
                  </div>
                </div>

                {cinema.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary-500" />
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Email</div>
                      <a
                        href={`mailto:${cinema.email}`}
                        className="text-white hover:text-primary-500 transition-colors"
                      >
                        {cinema.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Giờ mở cửa</div>
                    <p className="text-white">{cinema.openingHours}</p>
                  </div>
                </div>
              </div>

              {/* Map Button */}
              {cinema.latitude && cinema.longitude && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${cinema.latitude},${cinema.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Navigation className="w-5 h-5" />
                  Chỉ đường
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4">Thông tin chi tiết</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Film className="w-4 h-4" />
                    <span>Số phòng chiếu</span>
                  </div>
                  <span className="font-semibold">{cinema.totalRooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>Tổng số ghế</span>
                  </div>
                  <span className="font-semibold">{cinema.totalSeats}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tiện ích</h2>
          <div className="card p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cinema.facilities.map((facility: string) => (
                <div
                  key={facility}
                  className="flex items-center gap-2 p-3 bg-dark-800 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-sm">{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cinema Rooms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Danh sách phòng chiếu</h2>
          {cinema.rooms.length === 0 ? (
            <div className="card p-8 text-center">
              <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Chưa có thông tin phòng chiếu</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cinema.rooms.map((room: any) => (
                <div key={room.id} className="card p-6 hover:border-primary-500 transition-all">
                  {/* Room Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{room.name}</h3>
                      <span className="text-sm text-primary-500 font-medium">
                        {roomTypeLabels[room.type] || room.type.toUpperCase()}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      room.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : room.status === "maintenance"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {room.status === "active" ? "Hoạt động" : room.status === "maintenance" ? "Bảo trì" : "Ngừng hoạt động"}
                    </div>
                  </div>

                  {/* Room Stats */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-dark-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Armchair className="w-4 h-4" />
                        <span>Số ghế</span>
                      </div>
                      <span className="font-semibold">{room.totalSeats}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapIcon className="w-4 h-4" />
                        <span>Sơ đồ</span>
                      </div>
                      <span className="font-semibold">
                        {room.rowCount} x {room.seatsPerRow}
                      </span>
                    </div>
                  </div>

                  {/* Room Features */}
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Tính năng</div>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature: string) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-primary-600/20 text-primary-400 rounded text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Nearby Places */}
        {cinema.nearbyPlaces && cinema.nearbyPlaces.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Địa điểm lân cận</h2>
            <div className="card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cinema.nearbyPlaces.map((place: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Info className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{place.name}</div>
                      <div className="text-sm text-gray-400">{place.distance}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Movie Booking CTA */}
        <div className="mt-12 card p-8 text-center bg-gradient-to-r from-primary-600/10 to-primary-600/5 border-primary-600/20">
          <h3 className="text-2xl font-bold mb-2">Sẵn sàng xem phim?</h3>
          <p className="text-gray-400 mb-6">
            Khám phá các bộ phim đang chiếu và đặt vé ngay
          </p>
          <Link href="/movies?status=now_showing">
            <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors font-semibold">
              Xem phim đang chiếu
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
