import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  name: string;
  [key: string]: number | string;
}

const MedicineTrendChart = ({ data }: { data: TrendData[] }) => {
  // Define month order for proper sorting
  const monthOrder: { [key: string]: number } = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  // Sort the data by month order
  const sortedData = [...data].sort((a, b) => {
    return monthOrder[a.name as string] - monthOrder[b.name as string];
  });

  console.log("Sorted Data:", sortedData); // Debugging: Check the sorted data

  // Make sure each month has data for all medicines
  const medicines = new Set(
    sortedData.flatMap((item) =>
      Object.keys(item).filter((key) => key !== "name")
    )
  );
  // Helper function to get dynamic colors for the bars
  const getBarColor = (index: number): string => {
    const colors = ["#CB3CFF", "#9A91FB", "#00C2FF", "#4CAF50", "#FF9800"];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-[#0B1739] p-4 rounded-lg shadow-md">
      <h3 className="text-white text-lg font-semibold mb-4">
        Medicine Trend Over Time
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sortedData}>
          {/* Add bars for all medicines, excluding "Ibuprofen" */}
          {Array.from(medicines)
            .filter((medicine) => medicine !== "Ibuprofen") // Exclude Ibuprofen
            .map((medicine, index) => (
              <Bar
                key={medicine}
                dataKey={medicine}
                fill={getBarColor(index)} // Dynamic color
                barSize={30} // Adjust the bar size for better visibility
                fillOpacity={1} // Ensure full opacity to avoid the hover color change
                isAnimationActive={false} // Optional: Disables animation for smoother hover effect
              />
            ))}

          <CartesianGrid stroke="#2A2E60" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#AAB4FF" tick={{ fill: "#AAB4FF" }} />
          <YAxis stroke="#AAB4FF" tick={{ fill: "#AAB4FF" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1C2A4A",
              borderColor: "#42A5F5",
              color: "#fff",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#AAB4FF" }}
            cursor={false} // Prevent the cursor from affecting the entire chart
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MedicineTrendChart;
