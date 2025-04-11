import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

interface OverviewCardProps {
  title: string;
  value: string | number;
  trend?: "up" | "down";
  percentage?: number;
}
const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  trend,
  percentage,
}) => {
  let trendIcon = null;
  if (trend === "up") trendIcon = <TrendingUp className="text-green-500" />;
  if (trend === "down") trendIcon = <TrendingDown className="text-red-500" />;

  let percentageColor = "";
  if (percentage !== undefined) {
    if (percentage >= 70) percentageColor = "text-green-500";
    else if (percentage >= 30) percentageColor = "text-yellow-500";
    else percentageColor = "text-red-500";
  }

  return (
    <div className="flex flex-col items-start text-center space-y-1">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-lg font-semibold flex items-center">
        {value}{" "}
        {trendIcon && <span className="ml-2 inline-block">{trendIcon}</span>}
      </p>
      {percentage !== undefined && (
        <p className={`text-sm font-medium ${percentageColor}`}>
          {percentage}% In-stock
        </p>
      )}
    </div>
  );
};

const OverviewModal = () => {
  return (
    <div className="flex flex-wrap lg:flex-nowrap items-center justify-between mb-10 gap-4">
      <OverviewCard title="Sales" value="IDR 832" trend="up" />
      <div className="h-12 w-px bg-gray-300 hidden lg:block" />
      <OverviewCard title="Quantity" value="413" />
      <div className="h-12 w-px bg-gray-300 hidden lg:block" />
      <OverviewCard title="Top Selling" value="Lansoprazole" />
      <div className="h-12 w-px bg-gray-300 hidden lg:block" />
      <OverviewCard title="Overall Stock Status" value="15%" percentage={15} />
    </div>
  );
};

export default OverviewModal;
