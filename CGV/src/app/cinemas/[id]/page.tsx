"use client";

import { useState, useEffect } from "react";
import { Cinema, CinemaFilters } from "@/types/cinema.types";
import { cinemaService } from "@/services/cinema.service";
import Loading from "@/components/shared/Loading";
import Button from "@/components/shared/Button";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  Filter,
  ChevronDown,
  Film,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CinemaFilters>({
    city: "",
    district: "",
    facilities: [],
    search: "",
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const facilityOptions = [
    "IMAX",
    "4DX",
    "Dolby Atmos",
    "3D",
    "VIP Room",
    "Sweetbox",
    "Gold Class",
    "Premium Lounge",
  ];

  useEffect(() => {
    loadCities();
    loadCinemas();
  }, []);

  useEffect(() => {
    if (filters.city) {
      loadDistricts(filters.city);
    } else {
      setDistricts([]);
      setFilters({ ...filters, district: "" });
    }
  }, [filters.city]);

  const loadCities = async () => {
    try {
      const response = await cinemaService.getCities();
      if (response.success && response.datas) {
        setCities(response.datas);
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
    }
  };

  const loadDistricts = async (city: string) => {
    try {
      const response = await cinemaService.getDistricts(city);
      if (response.success && response.datas) {
        setDistricts(response.datas);
      }
    } catch (error) {
      console.error("Failed to load districts:", error);
    }
  };

  const loadCinemas = async () => {
    setLoading(true);
    try {
      const response = await cinemaService.getCinemas(filters);
      if (response.success && response.datas) {
        setCinemas(response.datas.items);
      }
    } catch (error) {
      console.error("Failed to load cinemas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadCinemas();
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    loadCinemas();
  };

  const handleResetFilters = () => {
    setFilters({
      city: "",
      district: "",
      facilities: [],
      search: "",
    });
    setShowFilterModal(false);
    setTimeout(() => loadCinemas(), 100);
  };

  const toggleFacility = (facility: string) => {
    setFilters((prev) => ({
      ...prev,
      facilities: prev.facilities?.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...(prev.facilities || []), facility],
    }));
  };

  const activeFiltersCount = 
    (filters.city ? 1 : 0) + 
    (filters.district ? 1 : 0) + 
    (filters.facilities?.length || 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Hệ thống rạp</span>
        </h1>
        <p className="text-gray-400">
          Tìm rạp chiếu phim gần bạn với đầy đủ tiện ích hiện đại
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* City Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filters.city === "" ? "primary" : "secondary"}
            onClick={() => {
              setFilters({ ...filters, city: "", district: "" });
              setTimeout(() => loadCinemas(), 100);
            }}
          >
            Tất cả
          </Button>
          {cities.map((city) => (
            <Button
              key={city}
              variant={filters.city === city ? "primary" : "secondary"}
              onClick={() => {
                setFilters({ ...filters, city, district: "" });
                setTimeout(() => loadCinemas(), 100);
              }}
            >
              {city}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên rạp hoặc địa chỉ..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button variant="secondary" onClick={() => setShowFilterModal(true)}>
            <Filter className="w-5 h-5 mr-2" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button variant="primary" onClick={handleSearch}>
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.city && (
              <span className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm flex items-center gap-1">
                {filters.city}
                <X
                  className="w-4 h-4 cursor-pointer hover:text-white"
                  onClick={() => setFilters({ ...filters, city: "", district: "" })}
                />
              </span>
            )}
            {filters.district && (
              <span className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm flex items-center gap-1">
                {filters.district}
                <X
                  className="w-4 h-4 cursor-pointer hover:text-white"
                  onClick={() => setFilters({ ...filters, district: "" })}
                />
              </span>
            )}
            {filters.facilities?.map((facility) => (
              <span
                key={facility}
                className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm flex items-center gap-1"
              >
                {facility}
                <X
                  className="w-4 h-4 cursor-pointer hover:text-white"
                  onClick={() => toggleFacility(facility)}
                />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cinema Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loading size="lg" text="Đang tải danh sách rạp..." />
        </div>
      ) : cinemas.length === 0 ? (
        <div className="text-center py-20">
          <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Không tìm thấy rạp chiếu</h3>
          <p className="text-gray-400 mb-6">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
          <Button variant="primary" onClick={handleResetFilters}>
            Xóa bộ lọc
          </Button>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              Tìm thấy <span className="text-white font-semibold">{cinemas.length}</span> rạp chiếu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cinemas.map((cinema) => (
              <Link
                key={cinema.id}
                href={`/cinemas/${cinema.id}`}
                className="card overflow-hidden hover:border-primary-500 transition-all group"
              >
                {/* Cinema Image */}
                <div className="relative h-48 bg-dark-800">
                  <Image
                    src={cinema.thumbnail}
                    alt={cinema.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent" />
                </div>

                <div className="p-6">
                  {/* Cinema Name */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary-500 transition-colors">
                    {cinema.name}
                  </h3>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm text-gray-400 mb-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{cinema.address}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <Phone className="w-4 h-4" />
                    <span>{cinema.phoneNumber}</span>
                  </div>

                  {/* Opening Hours */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{cinema.openingHours}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-dark-700">
                    <div className="flex items-center gap-2 text-sm">
                      <Film className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-400">{cinema.totalRooms} phòng</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-400">{cinema.totalSeats} ghế</span>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="flex flex-wrap gap-2">
                    {cinema.facilities.slice(0, 3).map((facility) => (
                      <span
                        key={facility}
                        className="px-2 py-1 bg-primary-600/20 text-primary-400 rounded text-xs"
                      >
                        {facility}
                      </span>
                    ))}
                    {cinema.facilities.length > 3 && (
                      <span className="px-2 py-1 bg-dark-700 text-gray-400 rounded text-xs">
                        +{cinema.facilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-dark-900 p-6 border-b border-dark-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">Bộ lọc tìm kiếm</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Thành phố</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value, district: "" })}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                >
                  <option value="">Tất cả thành phố</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Quận/Huyện</label>
                <select
                  value={filters.district}
                  onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                  disabled={!filters.city}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Tất cả quận/huyện</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Facilities Filter */}
              <div>
                <label className="block text-sm font-medium mb-3">Tiện ích</label>
                <div className="grid grid-cols-2 gap-2">
                  {facilityOptions.map((facility) => (
                    <button
                      key={facility}
                      onClick={() => toggleFacility(facility)}
                      className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                        filters.facilities?.includes(facility)
                          ? "bg-primary-600 border-primary-500 text-white"
                          : "bg-dark-800 border-dark-700 text-gray-400 hover:border-primary-500"
                      }`}
                    >
                      {facility}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-dark-900 p-6 border-t border-dark-800 flex gap-4">
              <Button variant="secondary" onClick={handleResetFilters} className="flex-1">
                Xóa bộ lọc
              </Button>
              <Button variant="primary" onClick={handleApplyFilters} className="flex-1">
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
