import Link from "next/link";
import Button from "@/components/shared/Button";
import { Film, Calendar, CreditCard, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-dark-950/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in">
            <span className="gradient-text">SystemCinema</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto animate-in">
            Trải nghiệm điện ảnh tuyệt vời với hệ thống đặt vé hiện đại
          </p>
          <div className="flex gap-4 justify-center animate-in">
            <Link href="/movies?status=now_showing">
              <Button variant="primary" size="lg">
                <Film className="w-5 h-5 mr-2" />
                Đặt vé ngay
              </Button>
            </Link>
            <Link href="/movies?status=coming_soon">
              <Button variant="outline" size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Phim sắp chiếu
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Tại sao chọn <span className="gradient-text">SystemCinema</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 hover:border-primary-500 transition-all group">
              <div className="w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
                <Film className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Đa dạng phim ảnh</h3>
              <p className="text-gray-400">
                Cập nhật liên tục các bộ phim bom tấn Hollywood và phim Việt Nam mới nhất
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 hover:border-primary-500 transition-all group">
              <div className="w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
                <CreditCard className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Thanh toán dễ dàng</h3>
              <p className="text-gray-400">
                Hỗ trợ nhiều phương thức thanh toán: MoMo, ZaloPay, VNPay, thẻ ngân hàng
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 hover:border-primary-500 transition-all group">
              <div className="w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
                <Star className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trải nghiệm tuyệt vời</h3>
              <p className="text-gray-400">
                Giao diện hiện đại, đặt vé nhanh chóng chỉ trong vài phút
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng trải nghiệm điện ảnh?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt cho lần đặt vé đầu tiên
          </p>
          <Link href="/auth/register">
            <Button variant="secondary" size="lg">
              Đăng ký miễn phí
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
