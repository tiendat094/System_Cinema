"use client";

import { useEffect, useState } from "react";
import { Search, UserPlus, Edit, Trash2, Shield, User as UserIcon, Mail, Phone, Calendar, Filter } from "lucide-react";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Loading from "@/components/shared/Loading";
import Modal from "@/components/shared/Modal";
import { userService } from "@/services/user.service";
import { User, UserRole } from "@/types/auth.types";
import { formatDate, cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    role: UserRole,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      if (response.success && response.datas) {
        setUsers(response.datas.items);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      email: "",
      fullName: "",
      phoneNumber: "",
      password: "",
      role: UserRole,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber || "",
      password: "",
      role: user.role.toString() as any,
    });
    setShowEditModal(true);
  };

  const handleSaveCreate = async () => {
    try {
      const response = await userService.createUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });

      if (response.success) {
        alert("Tạo người dùng thành công!");
        setShowCreateModal(false);
        loadUsers();
      } else {
        alert(response.message || "Tạo người dùng thất bại");
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const response = await userService.updateUser(editingUser.id, {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });

      if (response.success) {
        alert("Cập nhật người dùng thành công!");
        setShowEditModal(false);
        loadUsers();
      } else {
        alert(response.message || "Cập nhật người dùng thất bại");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    try {
      const response = await userService.deleteUser(userId);
      if (response.success) {
        alert("Xóa người dùng thành công!");
        loadUsers();
      } else {
        alert(response.message || "Xóa người dùng thất bại");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const styles: Record<string, string> = {
      admin: "bg-purple-500/20 text-purple-500",
      user: "bg-blue-500/20 text-blue-500",
    };

    const labels: Record<string, string> = {
      admin: "Quản trị viên",
      user: "Khách hàng",
    };

    return (
      <span className={cn("px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1", styles[role])}>
        {role === UserRole.Admin && <Shield className="w-3 h-3" />}
        {labels[role]}
      </span>
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch = 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchQuery));
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Quản lý người dùng</span>
          </h1>
          <p className="text-gray-400">Quản lý tài khoản người dùng trong hệ thống</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <UserPlus className="w-5 h-5 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Tổng người dùng</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Quản trị viên</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === UserRole.Admin).length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Khách hàng</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === UserRole.User).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRoleFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                roleFilter === "all"
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Tất cả
            </button>
            <button
              onClick={() => setRoleFilter(UserRole.Admin)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                roleFilter === UserRole.Admin
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Admin
            </button>
            <button
              onClick={() => setRoleFilter(UserRole.User)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                roleFilter === UserRole.User
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700"
              )}
            >
              Khách hàng
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-800">
              <tr>
                <th className="text-left p-4 font-semibold">Người dùng</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Số điện thoại</th>
                <th className="text-left p-4 font-semibold">Vai trò</th>
                <th className="text-left p-4 font-semibold">Ngày tham gia</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{user.fullName}</p>
                          <p className="text-sm text-gray-400">ID: {user.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{user.phoneNumber || "-"}</span>
                      </div>
                    </td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Thêm người dùng mới"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Họ và tên *</label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số điện thoại</label>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mật khẩu *</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vai trò *</label>
            <select
              value={formData.role.toString()}
              onChange={(e) => setFormData({ ...formData, role:  UserRole })}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            >
              <option value="user">Khách hàng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-dark-700">
            <Button variant="primary" onClick={handleSaveCreate} className="flex-1">
              Tạo người dùng
            </Button>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Chỉnh sửa người dùng"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Họ và tên *</label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={formData.email}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số điện thoại</label>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vai trò *</label>
            <select
              value={formData.role.toString()}
              onChange={(e) => setFormData({ ...formData, role:  UserRole })}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            >
              <option value="user">Khách hàng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-dark-700">
            <Button variant="primary" onClick={handleSaveEdit} className="flex-1">
              Cập nhật
            </Button>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
