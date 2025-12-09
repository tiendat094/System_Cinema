// Seat Legend Component - Explains seat types and statuses

import { SEAT_TYPES } from "@/lib/constants";

export default function SeatLegend() {
  const legends = [
    { color: "bg-green-600", label: "Ghế thường", icon: "" },
    { color: "bg-yellow-600", label: "Ghế VIP", icon: "⭐" },
    { color: "bg-pink-600", label: "Ghế đôi", icon: "👥" },
    { color: "bg-primary-600", label: "Đang chọn", icon: "" },
    { color: "bg-gray-600", label: "Đã đặt", icon: "" },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center py-4">
      {legends.map((legend) => (
        <div key={legend.label} className="flex items-center gap-2">
          <div className={`w-8 h-8 ${legend.color} rounded flex items-center justify-center text-xs`}>
            {legend.icon}
          </div>
          <span className="text-sm text-gray-300">{legend.label}</span>
        </div>
      ))}
    </div>
  );
}
