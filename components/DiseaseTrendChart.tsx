import React, { useEffect, useState } from "react";
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

const colours = ["#CB3CFF", "#9A91FB", "#00C2FF"]

const DiseaseTrendChart = () => {
  const [data, setData] = useState([]);
  const [trendingDiseases, setTrendingDiseases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/disease`)
      const data = await res.json()
      setData(data.data)
      setTrendingDiseases(data.trending_diseases)
    }
    fetchData()
  }, [])

  return (
    <div className="bg-[#0B1739] p-4 rounded-lg shadow-md">
      <h3 className="text-white text-lg font-semibold mb-4">
        Disease Trend Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} >
          {trendingDiseases.map((name, i) =>(
            <Line
              type="monotone"
              dataKey={name}
              stroke={colours[i]}
              strokeWidth={2}
              dot={{ fill: colours[i], r: 4 }}
            />
          ))}
          <CartesianGrid stroke="#2A2E60" strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" stroke="#AAB4FF" tick={{ fill: "#AAB4FF" }} />
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
  )
};

export default DiseaseTrendChart;
