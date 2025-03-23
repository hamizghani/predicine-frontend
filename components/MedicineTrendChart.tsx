import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", DBD: 260, Diarrhea: 510, Hepatitis: 400 },
  { name: "Feb", DBD: 320, Diarrhea: 420, Hepatitis: 410 },
  { name: "Mar", DBD: 470, Diarrhea: 450, Hepatitis: 420 },
  { name: "Apr", DBD: 480, Diarrhea: 340, Hepatitis: 430 },
  { name: "May", DBD: 260, Diarrhea: 250, Hepatitis: 440 },
];

const DiseaseTrendChart = () => (
  <div className="bg-[#0B1739] p-4 rounded-lg shadow-md">
    <h3 className="text-white text-lg font-semibold mb-4">
      Medicine Trend Over Time
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* DBD Line */}
        <Line
          type="monotone"
          dataKey="DBD"
          stroke="#CB3CFF"
          strokeWidth={2}
          dot={{ fill: "#CB3CFF", r: 4 }}
        />
        {/* Diarrhea Line */}
        <Line
          type="monotone"
          dataKey="Diarrhea"
          stroke="#9A91FB"
          strokeWidth={2}
          dot={{ fill: "#9A91FB", r: 4 }}
        />
        {/* Hepatitis Line */}
        <Line
          type="monotone"
          dataKey="Hepatitis"
          stroke="#00C2FF"
          strokeWidth={2}
          dot={{ fill: "#00C2FF", r: 4 }}
        />
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
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default DiseaseTrendChart;
