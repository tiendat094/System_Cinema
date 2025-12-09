// Application Constants

export const APP_NAME = "SystemCinema";
export const APP_DESCRIPTION = "Hệ thống đặt vé xem phim trực tuyến";

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
};

// Movie Filters
export const MOVIE_FILTERS = {
  STATUSES: [
    { label: "Tất cả", value: "" },
    { label: "Đang chiếu", value: "now_showing" },
    { label: "Sắp chiếu", value: "coming_soon" },
    { label: "Đã kết thúc", value: "ended" },
  ],
  SORT_OPTIONS: [
    { label: "Mới nhất", value: "releaseDate-desc" },
    { label: "Cũ nhất", value: "releaseDate-asc" },
    { label: "Đánh giá cao", value: "rating-desc" },
    { label: "Tên A-Z", value: "title-asc" },
    { label: "Tên Z-A", value: "title-desc" },
  ],
};

// Age Ratings
export const AGE_RATINGS = {
  "0": { label: "0 - Phổ biến", color: "bg-green-500" },
  "1": { label: "1 - Dưới 13 tuổi + cha mẹ", color: "bg-blue-500" },
  "2": { label: "2 - Từ 13 tuổi", color: "bg-yellow-500" },
  "3": { label: "3 - Từ 16 tuổi", color: "bg-orange-500" },
  "4": { label: "4 - Từ 18 tuổi", color: "bg-red-500" },
};

// Seat Types
export const SEAT_TYPES = {
  normal: { label: "Ghế thường", color: "bg-gray-400", price: 85000 },
  vip: { label: "Ghế VIP", color: "bg-yellow-500", price: 120000 },
  couple: { label: "Ghế đôi", color: "bg-pink-500", price: 200000 },
};

// Payment Methods
export const PAYMENT_METHODS = [
  { value: "momo", label: "MoMo", icon: "💳" },
  { value: "zalopay", label: "ZaloPay", icon: "💰" },
  { value: "vnpay", label: "VNPay", icon: "🏦" },
  { value: "credit_card", label: "Thẻ tín dụng", icon: "💳" },
  { value: "debit_card", label: "Thẻ ghi nợ", icon: "💳" },
  { value: "banking", label: "Chuyển khoản", icon: "🏧" },
  { value: "cash", label: "Tiền mặt", icon: "💵" },
];

// Booking Status
export const BOOKING_STATUS = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-500" },
  confirmed: { label: "Đã xác nhận", color: "bg-green-500" },
  cancelled: { label: "Đã hủy", color: "bg-red-500" },
  completed: { label: "Hoàn thành", color: "bg-blue-500" },
};

// Routes
export const ROUTES = {
  HOME: "/",
  MOVIES: "/movies",
  MOVIE_DETAIL: (id: string) => `/movies/${id}`,
  BOOKING: (showtimeId: string) => `/booking/${showtimeId}`,
  PROFILE: "/profile",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ADMIN: {
    DASHBOARD: "/dashboard",
    MOVIES: "/dashboard/movies",
    SCHEDULES: "/dashboard/schedules",
  },
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(0|\+84)[0-9]{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "Trường này là bắt buộc",
  INVALID_EMAIL: "Email không hợp lệ",
  INVALID_PHONE: "Số điện thoại không hợp lệ",
  INVALID_PASSWORD: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
  PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng thử lại",
  UNKNOWN_ERROR: "Đã xảy ra lỗi. Vui lòng thử lại sau",
};
