import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SystemCinema - Đặt vé xem phim trực tuyến",
  description: "Hệ thống đặt vé xem phim trực tuyến hàng đầu Việt Nam",
  keywords: ["cinema", "movie", "booking", "tickets", "phim", "rạp chiếu"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
