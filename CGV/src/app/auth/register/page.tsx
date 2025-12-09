"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { authService } from "@/services/auth.service";
import { isValidEmail, isValidPhone } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
    };
    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = "Họ tên là bắt buộc";
      isValid = false;
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Họ tên phải có ít nhất 3 ký tự";
      isValid = false;
    }

    // Phone validation
    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.register(formData);
      
      if (response.success) {
        authService.saveTokens(response.datas.accessToken, response.datas.refreshToken);
        router.push("/");
      } else {
        setError(response.message || "Đăng ký thất bại");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">SystemCinema</span>
          </h1>
          <p className="text-gray-400">Tạo tài khoản mới</p>
        </div>

        {/* Register Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Họ và tên"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              leftIcon={<User className="w-5 h-5" />}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              label="Số điện thoại"
              type="tel"
              placeholder="0901234567"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              error={errors.phoneNumber}
              leftIcon={<Phone className="w-5 h-5" />}
              helperText="Tùy chọn"
            />

            <Input
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              required
            />

            <Input
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              required
            />

            <div className="text-xs text-gray-400">
              Bằng việc đăng ký, bạn đồng ý với{" "}
              <Link href="/terms" className="text-primary-500 hover:text-primary-400">
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-primary-500 hover:text-primary-400">
                Chính sách bảo mật
              </Link>{" "}
              của chúng tôi.
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Đăng ký
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Đã có tài khoản? </span>
            <Link href="/auth/login" className="text-primary-500 hover:text-primary-400 font-medium">
              Đăng nhập
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
