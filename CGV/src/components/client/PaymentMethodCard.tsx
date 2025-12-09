// Payment Method Card Component

import { cn } from "@/lib/utils";
import { PaymentMethod } from "@/types/payment.types";

interface PaymentMethodCardProps {
  method: {
    value: PaymentMethod;
    label: string;
    icon: string;
  };
  selected: boolean;
  onClick: () => void;
}

export default function PaymentMethodCard({ method, selected, onClick }: PaymentMethodCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95",
        "flex flex-col items-center justify-center gap-3",
        selected
          ? "border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/30"
          : "border-dark-700 bg-dark-800 hover:border-dark-600"
      )}
    >
      <div className="text-4xl">{method.icon}</div>
      <div className="font-semibold text-center">{method.label}</div>
      {selected && (
        <div className="text-xs text-primary-500">✓ Đã chọn</div>
      )}
    </button>
  );
}
