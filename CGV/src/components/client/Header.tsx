// Client Header Component

"use client";

import Link from "next/link";
import { Film, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "../shared/Button";
import { useEffect } from "react";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
    
    // 3. SỬ DỤNG useEffect ĐỂ ĐỌC localStorage SAU KHI COMPONENT ĐÃ MOUNT TRÊN CLIENT
  useEffect(() => {
        // Kiểm tra chắc chắn đã ở client (thường không cần trong useEffect, nhưng là biện pháp bảo vệ tốt)
        if (typeof window !== 'undefined') {
            const storedLoginState = localStorage.getItem("isLoggedIn") === "true"; 
            setIsLoggedIn(storedLoginState);
        }
    }, []);
  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/movies?status=now_showing", label: "Phim đang chiếu" },
    { href: "/movies?status=coming_soon", label: "Phim sắp chiếu" },
    { href: "/cinemas", label: "Rạp chiếu" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur-md border-b border-dark-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition-colors">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SystemCinema</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="p-2 hover:bg-dark-800 rounded-lg text-gray-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {isLoggedIn ? (
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="w-5 h-5 mr-2" />
                  Tài khoản
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="primary" size="sm">
                  Đăng nhập
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-dark-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-dark-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
