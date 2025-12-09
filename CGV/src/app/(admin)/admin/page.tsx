"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Film, 
  Ticket, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Clock,
  Star
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import Loading from "@/components/shared/Loading";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  totalMovies: number;
  totalUsers: number;
  revenueChange: number;
  bookingsChange: number;
  todayBookings: number;
  upcomingShowtimes: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Mock data - In production, fetch from API
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setStats({
        totalRevenue: 125600000,
        totalBookings: 1248,
        totalMovies: 24,
        totalUsers: 3567,
        revenueChange: 12.5,
        bookingsChange: 8.3,
        todayBookings: 45,
        upcomingShowtimes: 18,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải dashboard..." />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-gray-400">Tổng quan hệ thống SystemCinema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng doanh thu"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          change={{ value: stats.revenueChange, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Tổng đặt vé"
          value={stats.totalBookings}
          icon={Ticket}
          change={{ value: stats.bookingsChange, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Số phim"
          value={stats.totalMovies}
          icon={Film}
          color="purple"
        />
        <StatsCard
          title="Người dùng"
          value={stats.totalUsers}
          icon={Users}
          color="yellow"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">Đặt vé hôm nay</h3>
          </div>
          <div className="text-4xl font-bold text-blue-500">{stats.todayBookings}</div>
          <p className="text-sm text-gray-400 mt-2">Tổng số vé đã bán trong ngày</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold">Suất chiếu sắp tới</h3>
          </div>
          <div className="text-4xl font-bold text-purple-500">{stats.upcomingShowtimes}</div>
          <p className="text-sm text-gray-400 mt-2">Số suất chiếu trong 24h tới</p>
        </div>
      </div>

      {/* Recent Activity & Top Movies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary-500" />
            Đặt vé gần đây
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-sm">Booking #{1000 + item}</p>
                  <p className="text-xs text-gray-400">User {item} - Ghế A{item}, B{item}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-primary-500">
                    {formatCurrency(150000 + item * 10000)}
                  </p>
                  <p className="text-xs text-gray-400">{item} phút trước</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Movies */}
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Phim bán chạy
          </h3>
          <div className="space-y-3">
            {[
              { name: "Spider-Man: No Way Home", bookings: 345, revenue: 52000000 },
              { name: "Avatar: The Way of Water", bookings: 289, revenue: 43500000 },
              { name: "Top Gun: Maverick", bookings: 256, revenue: 38400000 },
              { name: "The Batman", bookings: 198, revenue: 29700000 },
              { name: "Jurassic World Dominion", bookings: 160, revenue: 24000000 },
            ].map((movie, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{movie.name}</p>
                  <p className="text-xs text-gray-400">{movie.bookings} vé đã bán</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-green-500">
                    {formatCurrency(movie.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-500" />
          Biểu đồ doanh thu
        </h3>
        <div className="h-64 bg-dark-800/30 rounded-lg flex items-center justify-center border border-dashed border-dark-700">
          <p className="text-gray-500">Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
}
