# 🚀 SYSTEMCINEMA - HƯỚNG DẪN CÀI ĐẶT & CHẠY PROJECT

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Git**: Latest version
- **VS Code**: Recommended IDE

## 🔧 CÀI ĐẶT

### Bước 1: Clone/Copy project
```bash
# Nếu có git
git clone <repository-url>
cd CGV

# Hoặc đã có sẵn folder c:\CGV
cd c:\CGV
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

**Lưu ý:** Có thể có warnings về deprecated packages, bỏ qua chúng.

### Bước 3: Cấu hình Environment Variables

File `.env.local` đã có sẵn với config mặc định:

```env
# API Gateway URL
API_GATEWAY_URL=http://localhost:5000/api

# Microservices URLs
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:5001/api/auth
NEXT_PUBLIC_MOVIES_SERVICE_URL=http://localhost:5002/api/movies
NEXT_PUBLIC_BOOKING_SERVICE_URL=http://localhost:5003/api/booking
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:5004/api/payment
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:5005/api/user

# Development Mode
NEXT_PUBLIC_USE_MOCK_DATA=true
```

**Quan trọng:**
- `NEXT_PUBLIC_USE_MOCK_DATA=true` → Dùng mock data (không cần backend)
- `NEXT_PUBLIC_USE_MOCK_DATA=false` → Gọi real API (cần backend running)

## 🎬 CHẠY PROJECT

### Development Mode
```bash
npm run dev
```

Truy cập: **http://localhost:3000**

### Build for Production
```bash
npm run build
npm start
```

### Type Check
```bash
npm run type-check
```

### Lint
```bash
npm run lint
```

## 🧪 DEMO & TEST

### Demo Accounts (Mock Mode)

#### User Account
```
Email: user@systemcinema.com
Password: user123
```

#### Admin Account
```
Email: admin@systemcinema.com
Password: admin123
```

### Test Flow

1. **Trang chủ** → http://localhost:3000
   - Xem hero section
   - Click "Đặt vé ngay"

2. **Danh sách phim** → http://localhost:3000/movies
   - Filter theo "Đang chiếu" / "Sắp chiếu"
   - Search phim
   - Click vào một phim

3. **Chi tiết phim** → http://localhost:3000/movies/[id]
   - Xem thông tin phim
   - Xem lịch chiếu
   - Click chọn suất chiếu

4. **Đăng nhập** → http://localhost:3000/auth/login
   - Dùng demo account
   - Test validation

5. **Đăng ký** → http://localhost:3000/auth/register
   - Test form validation
   - Thử đăng ký tài khoản mới

## 🔄 CHUYỂN SANG REAL API MODE

### Điều kiện:
- Backend Microservices phải đang chạy
- API Gateway phải accessible

### Các bước:

1. **Start Backend Services** (giả sử đang chạy)
   ```
   Gateway:  http://localhost:5000
   Auth:     http://localhost:5001
   Movies:   http://localhost:5002
   Booking:  http://localhost:5003
   Payment:  http://localhost:5004
   User:     http://localhost:5005
   ```

2. **Update `.env.local`**
   ```env
   NEXT_PUBLIC_USE_MOCK_DATA=false
   API_GATEWAY_URL=http://localhost:5000/api
   ```

3. **Restart Dev Server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Test API Connections**
   - Thử login → Kiểm tra network tab
   - Thử fetch movies → Xem console logs
   - Nếu có CORS error → Cấu hình CORS trên backend

## 🐛 TROUBLESHOOTING

### Issue 1: Port 3000 đã được sử dụng
```bash
# Windows: Kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc dùng port khác
PORT=3001 npm run dev
```

### Issue 2: Module not found errors
```bash
# Clear cache và reinstall
rm -rf node_modules .next
npm install
```

### Issue 3: TypeScript errors
```bash
# Check types
npm run type-check

# Nếu có lỗi, kiểm tra file tsconfig.json
```

### Issue 4: Tailwind CSS không apply
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue 5: API calls fail (Real API Mode)
1. Kiểm tra backend có chạy không
2. Kiểm tra URL trong `.env.local`
3. Check CORS settings trên backend
4. Xem Network tab trong DevTools

## 📁 CẤU TRÚC PROJECT

```
c:\CGV\
├── src/
│   ├── app/
│   │   ├── (client)/           # Client routes
│   │   │   ├── movies/         # Movie list & detail
│   │   │   ├── layout.tsx      # Client layout
│   │   │   └── page.tsx        # Home page
│   │   ├── auth/               # Auth pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── client/             # Client components
│   │   └── shared/             # Reusable components
│   ├── services/               # API services
│   │   ├── api/
│   │   │   └── client.ts       # Axios config
│   │   ├── auth.service.ts
│   │   ├── movie.service.ts
│   │   ├── booking.service.ts
│   │   ├── payment.service.ts
│   │   └── user.service.ts
│   ├── types/                  # TypeScript types
│   └── lib/                    # Utils & constants
├── public/                     # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🎨 CUSTOMIZATION

### Thay đổi Colors
File: `tailwind.config.ts`
```typescript
colors: {
  primary: {
    500: "#your-color",
    600: "#your-color",
    // ...
  }
}
```

### Thay đổi Logo/Branding
File: `src/components/client/Header.tsx`
```typescript
<span className="text-xl font-bold gradient-text">
  YourBrandName
</span>
```

### Thêm mới Service
1. Create `src/types/your-feature.types.ts`
2. Create `src/services/your-feature.service.ts`
3. Add mock data
4. Implement API calls

### Thêm mới Page
```typescript
// src/app/(client)/your-page/page.tsx
"use client";

export default function YourPage() {
  return <div>Your Content</div>;
}
```

## 📊 MONITORING & DEBUGGING

### Next.js DevTools
- Press `Option/Alt + N` để mở Next.js DevTools
- Xem page rendering info
- Check bundle sizes

### React DevTools
- Install extension: React Developer Tools
- Inspect component tree
- Check props & state

### Network Tab
- Xem API requests
- Check response times
- Debug CORS issues

### Console Logs
Service layer đã có console.error cho debugging:
```typescript
try {
  // API call
} catch (error) {
  console.error("Failed to fetch:", error);
}
```

## 🚀 DEPLOYMENT

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
# Dockerfile (create this)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

```bash
docker build -t systemcinema .
docker run -p 3000:3000 systemcinema
```

### Environment Variables for Production
Nhớ set các biến môi trường:
- `API_GATEWAY_URL`
- `NEXT_PUBLIC_USE_MOCK_DATA=false`

## 📞 HỖ TRỢ

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

### Project Files
- `README.md` - Overview & setup
- `PROGRESS.md` - Development progress
- `SETUP_GUIDE.md` - This file

### Common Issues
Xem section **TROUBLESHOOTING** ở trên.

---

**✅ Setup hoàn tất! Happy Coding! 🎬**
