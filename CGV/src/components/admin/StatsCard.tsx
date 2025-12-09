import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

export default function StatsCard({ title, value, icon: Icon, change, color = "blue" }: StatsCardProps) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 text-blue-500",
    green: "from-green-500/20 to-green-600/20 text-green-500",
    yellow: "from-yellow-500/20 to-yellow-600/20 text-yellow-500",
    red: "from-red-500/20 to-red-600/20 text-red-500",
    purple: "from-purple-500/20 to-purple-600/20 text-purple-500",
  };

  return (
    <div className="card p-6 hover:border-primary-500/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-2">{value}</h3>
          {change && (
            <div className="flex items-center gap-1 text-sm">
              <span className={change.isPositive ? "text-green-500" : "text-red-500"}>
                {change.isPositive ? "+" : ""}{change.value}%
              </span>
              <span className="text-gray-400">so với tháng trước</span>
            </div>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
