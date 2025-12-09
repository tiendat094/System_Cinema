"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Copy, Check } from "lucide-react";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { authService } from "@/services/auth.service";
import { isValidEmail } from "@/lib/utils";
import { UserRole } from "@/types/auth.types";
const ROLE_CLAIM_URI = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const EMAIL_CLAIM_URI = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

// Helper function to decode JWT token
const decodeToken = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token format");
    
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
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
      const response = await authService.login(formData);
      console.log("Login response:", response);
      if (response.success) {
        authService.saveTokens(response.datas.accessToken, response.datas.refreshToken);
        
        // Decode the access token
        const payload = decodeToken(response.datas.accessToken);
        setDecodedToken(payload);
        console.log("Decoded token payload:", payload);
        console.log("User email from token:", payload[EMAIL_CLAIM_URI]);
        console.log("User role ",UserRole.Admin);
        // Redirect based on role
        if (payload[ROLE_CLAIM_URI] === UserRole.Admin) {
          if (typeof window !== 'undefined') { 
              localStorage.setItem("isAdmin", "true"); 
        }
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        setError(response.message || "Đăng nhập thất bại");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">SystemCinema</span>
          </h1>
          <p className="text-gray-400">Đăng nhập để tiếp tục</p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500 text-sm">
                {error}
              </div>
            )}

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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-400">Ghi nhớ đăng nhập</span>
              </label>
              <Link href="/auth/forgot-password" className="text-primary-500 hover:text-primary-400">
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Đăng nhập
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-dark-800 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">🎯 Demo Accounts:</p>
            <div className="text-xs space-y-1 text-gray-500">
              <div>👤 User: user@systemcinema.com / user123</div>
              <div>🔐 Admin: admin@systemcinema.com / admin123</div>
            </div>
          </div>

          {/* Decoded Token Display */}
          {decodedToken && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-5 h-5 text-green-500" />
                <p className="text-sm font-semibold text-green-400">Payload của Access Token:</p>
              </div>
              <div className="space-y-2">
                {Object.entries(decodedToken).map(([key, value]: any) => (
                  <div key={key} className="flex items-center justify-between bg-dark-900 p-2 rounded text-xs">
                    <div>
                      <span className="text-gray-400">{key}:</span>
                      <span className="text-green-400 ml-2 break-all">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(typeof value === "object" ? JSON.stringify(value) : String(value), key)}
                      className="ml-2 p-1 hover:bg-dark-800 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedField === key ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Register Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Chưa có tài khoản? </span>
            <Link href="/auth/register" className="text-primary-500 hover:text-primary-400 font-medium">
              Đăng ký ngay
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
