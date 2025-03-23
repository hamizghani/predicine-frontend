import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MedicineTrendData {
  date: string;
  medicineA: number;
  medicineB: number;
  medicineC: number;
}

const medicineTrendData: MedicineTrendData[] = [
  { date: "2025-01", medicineA: 50, medicineB: 30, medicineC: 20 },
  { date: "2025-02", medicineA: 55, medicineB: 35, medicineC: 25 },
  { date: "2025-03", medicineA: 60, medicineB: 45, medicineC: 30 },
  { date: "2025-04", medicineA: 70, medicineB: 50, medicineC: 40 },
  { date: "2025-05", medicineA: 80, medicineB: 55, medicineC: 45 },
  { date: "2025-06", medicineA: 90, medicineB: 60, medicineC: 50 },
];

const MedicinePredictionGraph: React.FC = () => {
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Medicine Trend Prediction</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={medicineTrendData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="medicineA"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="medicineB" stroke="#82ca9d" />
          <Line type="monotone" dataKey="medicineC" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MedicinePredictionGraph;
