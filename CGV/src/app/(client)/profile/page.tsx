"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Calendar, Camera, Lock, LogOut } from "lucide-react";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Loading from "@/components/shared/Loading";
import { authService } from "@/services/auth.service";
import { UserRole, User as UserType } from "@/types/auth.types";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.datas) {
        setUser(response.datas);
        setFormData({
          fullName: response.datas.fullName,
          phoneNumber: response.datas.phoneNumber || "",
        });
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // In production, call userService.updateProfile()
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update local user
      setUser({
        ...user,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      });
      
      setEditMode(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/auth/login");
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">
          <span className="gradient-text">Thông tin cá nhân</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="card p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold mb-1">{user.fullName}</h3>
              <p className="text-sm text-gray-400 mb-4">{user.role === UserRole.Admin ? "Quản trị viên" : "Khách hàng"}</p>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full mb-3"
                onClick={() => router.push("/profile/bookings")}
              >
                Lịch sử đặt vé
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-red-500 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Thông tin cá nhân</h3>
                {!editMode && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setEditMode(true)}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Họ và tên</label>
                  {editMode ? (
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <div className="flex items-center gap-3 text-white">
                      <User className="w-5 h-5 text-gray-400" />
                      <span>{user.fullName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <div className="flex items-center gap-3 text-white">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Số điện thoại</label>
                  {editMode ? (
                    <Input
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="flex items-center gap-3 text-white">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Ngày tham gia</label>
                  <div className="flex items-center gap-3 text-white">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>

              {editMode && (
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={saving}
                    disabled={saving}
                  >
                    Lưu thay đổi
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        fullName: user.fullName,
                        phoneNumber: user.phoneNumber || "",
                      });
                    }}
                    disabled={saving}
                  >
                    Hủy
                  </Button>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary-500" />
                Đổi mật khẩu
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Để bảo mật tài khoản, bạn nên đổi mật khẩu định kỳ
              </p>
              <Button variant="outline" size="sm">
                Đổi mật khẩu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
