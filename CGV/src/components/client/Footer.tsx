// Client Footer Component

import Link from "next/link";
import { Film, Facebook, Instagram, Youtube, Mail } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    company: [
      { label: "Về chúng tôi", href: "/about" },
      { label: "Điều khoản sử dụng", href: "/terms" },
      { label: "Chính sách bảo mật", href: "/privacy" },
      { label: "Liên hệ", href: "/contact" },
    ],
    support: [
      { label: "FAQ", href: "/faq" },
      { label: "Hướng dẫn đặt vé", href: "/guide" },
      { label: "Chính sách hoàn tiền", href: "/refund" },
      { label: "Hỗ trợ khách hàng", href: "/support" },
    ],
    movies: [
      { label: "Phim đang chiếu", href: "/movies?status=now_showing" },
      { label: "Phim sắp chiếu", href: "/movies?status=coming_soon" },
      { label: "Rạp chiếu", href: "/cinemas" },
      { label: "Ưu đãi", href: "/promotions" },
    ],
  };

  return (
    <footer className="bg-dark-900 border-t border-dark-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">SystemCinema</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Hệ thống đặt vé xem phim trực tuyến hàng đầu Việt Nam
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-dark-800 hover:bg-primary-600 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-dark-800 hover:bg-primary-600 rounded-lg transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-dark-800 hover:bg-primary-600 rounded-lg transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-dark-800 hover:bg-primary-600 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Công ty</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Movie Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Phim</h3>
            <ul className="space-y-2">
              {footerLinks.movies.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-dark-800 text-center text-gray-400 text-sm">
          <p>&copy; 2024 SystemCinema. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
