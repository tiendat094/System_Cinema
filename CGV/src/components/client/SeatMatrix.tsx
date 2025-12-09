// Seat Matrix Component - Interactive seat selection grid

"use client";

import { cn } from "@/lib/utils";
import { Seat, SeatType, SeatStatus } from "@/types/booking.types";
import { formatCurrency } from "@/lib/utils";

interface SeatMatrixProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatClick: (seatId: string) => void;
}

export default function SeatMatrix({ seats, selectedSeats, onSeatClick }: SeatMatrixProps) {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  const getSeatColor = (seat: Seat) => {
    if (seat.status === SeatStatus.Booked) {
      return "bg-gray-600 cursor-not-allowed";
    }
    if (seat.status === SeatStatus.Broken) {
      return "bg-gray-800 cursor-not-allowed opacity-50";
    }
    if (selectedSeats.includes(seat.id)) {
      return "bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/50";
    }
    
    // Available seats - color by type
    if (seat.type === SeatType.VIP) {
      return "bg-yellow-600 hover:bg-yellow-700";
    }
    if (seat.type === SeatType.Couple) {
      return "bg-pink-600 hover:bg-pink-700";
    }
    return "bg-green-600 hover:bg-green-700";
  };

  const getSeatIcon = (seat: Seat) => {
    if (seat.type === SeatType.Couple) {
      return "👥";
    }
    if (seat.type === SeatType.VIP) {
      return "⭐";
    }
    return "";
  };

  return (
    <div className="space-y-3">
      {sortedRows.map((row) => {
        const rowSeats = seatsByRow[row].sort((a, b) => a.number - b.number);
        
        return (
          <div key={row} className="flex items-center gap-2 justify-center">
            {/* Row Label */}
            <div className="w-8 text-center font-bold text-gray-400">
              {row}
            </div>

            {/* Seats */}
            <div className="flex gap-2">
              {rowSeats.map((seat) => {
                const isDisabled = seat.status === SeatStatus.Booked || seat.status === SeatStatus.Broken;
                const isSelected = selectedSeats.includes(seat.id);
                const isCoupleWide = seat.type === SeatType.Couple;

                return (
                  <button
                    key={seat.id}
                    onClick={() => !isDisabled && onSeatClick(seat.id)}
                    disabled={isDisabled}
                    className={cn(
                      "rounded-lg transition-all duration-200 flex items-center justify-center font-semibold text-sm",
                      isCoupleWide ? "w-20 h-12" : "w-10 h-10",
                      getSeatColor(seat),
                      isDisabled && "cursor-not-allowed",
                      !isDisabled && "hover:scale-110 active:scale-95"
                    )}
                    title={`${row}${seat.number} - ${seat.type} - ${formatCurrency(seat.price)}`}
                  >
                    <span className="flex items-center gap-1">
                      {getSeatIcon(seat)}
                      {seat.number}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Row Label (Right side) */}
            <div className="w-8 text-center font-bold text-gray-400">
              {row}
            </div>
          </div>
        );
      })}
    </div>
  );
}
