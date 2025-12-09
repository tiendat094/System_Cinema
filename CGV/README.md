# 🎬 SystemCinema Frontend

> **Hệ thống đặt vé xem phim trực tuyến** - Built with Next.js 14 + TypeScript + TailwindCSS

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC)](https://tailwindcss.com/)

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
http://localhost:3000
```

**Demo Accounts:**
- 👤 User: `user@systemcinema.com` / `user123`
- 🔐 Admin: `admin@systemcinema.com` / `admin123`

## 📋 Tổng quan

SystemCinema là một ứng dụng web hiện đại cho phép người dùng:
- 🎞️ Xem danh sách phim đang chiếu và sắp chiếu
- 🎫 Đặt vé xem phim trực tuyến
- 💺 Chọn ghế ngồi theo sơ đồ rạp
- 💳 Thanh toán qua nhiều phương thức (MoMo, ZaloPay, VNPay, Banking)
- 👤 Quản lý tài khoản và lịch sử đặt vé
- 🎛️ Admin dashboard để quản lý phim và lịch chiếu

## 🏗️ Kiến trúc

Frontend này được thiết kế để tích hợp với **Backend Microservices** (.NET):
- ✅ AuthService (Login, Register)
- ✅ MoviesService (Movie CRUD, Showtimes)
- ✅ BookingService (Seat Selection, Booking)
- ✅ PaymentService (Payment Gateway)
- ✅ UserService (Profile Management)

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** Zustand (optional)

## 📁 Cấu trúc thư mục

\`\`\`
c:\\CGV\\
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (client)/             # Client routes
│   │   │   ├── movies/
│   │   │   ├── booking/
│   │   │   └── profile/
│   │   ├── (admin)/              # Admin routes
│   │   │   ├── dashboard/
│   │   │   ├── movies/
│   │   │   └── schedules/
│   │   ├── auth/                 # Auth routes
│   │   └── layout.tsx
│   ├── components/
│   │   ├── client/               # Client components
│   │   ├── admin/                # Admin components
│   │   └── shared/               # Reusable components
│   ├── services/                 # API Services
│   │   ├── auth.service.ts
│   │   ├── movie.service.ts
│   │   ├── booking.service.ts
│   │   ├── payment.service.ts
│   │   └── user.service.ts
│   ├── types/                    # TypeScript interfaces
│   └── lib/                      # Utilities & constants
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
\`\`\`

## 🔧 Setup & Installation

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Cấu hình Environment Variables

Tạo file \`.env.local\` (đã có sẵn template):

\`\`\`env
# API Gateway URL
API_GATEWAY_URL=http://localhost:5000/api

# Microservices URLs (nếu gọi trực tiếp)
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:5001/api/auth
NEXT_PUBLIC_MOVIES_SERVICE_URL=http://localhost:5002/api/movies
NEXT_PUBLIC_BOOKING_SERVICE_URL=http://localhost:5003/api/booking
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:5004/api/payment
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:5005/api/user

# Development Mode (true = mock data, false = real API)
NEXT_PUBLIC_USE_MOCK_DATA=true
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Mở [http://localhost:3000](http://localhost:3000) trên browser.

## 🔄 Chế độ Mock Data

Hiện tại project đang chạy ở **Mock Mode** (NEXT_PUBLIC_USE_MOCK_DATA=true).

Để chuyển sang Real API:
1. Đảm bảo backend Microservices đang chạy
2. Đổi \`NEXT_PUBLIC_USE_MOCK_DATA=false\` trong \`.env.local\`
3. Restart dev server

## 📦 Service Layer

Tất cả API calls được tổ chức trong \`src/services/\`:

### Auth Service
\`\`\`typescript
import { authService } from '@/services/auth.service';

// Login
await authService.login({ email, password });

// Register
await authService.register({ email, password, fullName });
\`\`\`

### Movie Service
\`\`\`typescript
import { movieService } from '@/services/movie.service';

// Get movies with filters
await movieService.getMovies({ status: 'now_showing' }, page, pageSize);

// Get movie detail
await movieService.getMovieById(movieId);
\`\`\`

### Booking Service
\`\`\`typescript
import { bookingService } from '@/services/booking.service';

// Get seat layout
await bookingService.getSeats(showtimeId);

// Create booking
await bookingService.createBooking({ showtimeId, seatIds });
\`\`\`

## 🎨 UI Components

### Shared Components
- \`Button\` - Customizable button với variants
- \`Input\` - Form input với validation
- \`Modal\` - Popup modal
- \`Loading\` - Loading spinner

### Client Components
- \`Header\` - Navigation header
- \`Footer\` - Site footer
- \`MovieCard\` - Movie card display (Coming next)
- \`SeatMatrix\` - Seat selection grid (Coming next)

## 📝 TypeScript Interfaces

Tất cả types được định nghĩa trong \`src/types/\`:

- \`auth.types.ts\` - User, Login, Register
- \`movie.types.ts\` - Movie, Showtime, Genre
- \`booking.types.ts\` - Booking, Seat, SeatLayout
- \`payment.types.ts\` - Payment, PaymentMethod
- \`common.types.ts\` - Shared types

## 🧪 Mock Data Credentials

Để test login với mock data:

**Admin Account:**
- Email: \`admin@systemcinema.com\`
- Password: \`admin123\`

**User Account:**
- Email: \`user@systemcinema.com\`
- Password: \`user123\`

## 🚦 Next Steps

### Phase 2: Client UI
- [ ] Movie List Page với filters
- [ ] Movie Detail Page với trailer
- [ ] Seat Selection với interactive grid
- [ ] Payment Flow
- [ ] User Profile & Booking History

### Phase 3: Admin Dashboard
- [ ] Dashboard với statistics
- [ ] Movie Management (CRUD)
- [ ] Schedule Management
- [ ] User Management

## 🤝 Integration với Backend

Khi backend sẵn sàng:

1. **Update API URLs** trong \`.env.local\`
2. **Verify TypeScript Interfaces** khớp với backend DTOs
3. **Test API Endpoints** qua Postman/Thunder Client
4. **Switch to Real API Mode** (NEXT_PUBLIC_USE_MOCK_DATA=false)
5. **Update Service Layer** nếu cần thay đổi request/response format

## 📚 Scripts

\`\`\`bash
npm run dev          # Start dev server
npm run build        # Build production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
\`\`\`

## 🐛 Troubleshooting

### Lỗi import không tìm thấy module
\`\`\`bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### TypeScript errors
\`\`\`bash
npm run type-check
\`\`\`

## 📞 Contact & Support

- 📧 Email: dev@systemcinema.com
- 🐛 Issues: [GitHub Issues](https://github.com/systemcinema/frontend/issues)

---

**Happy Coding! 🎬✨**
