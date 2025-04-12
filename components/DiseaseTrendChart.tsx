"use client";
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

type DiseaseDataPoint = {
  name: string;
  DBD: number;
  Diarrhea: number;
  Hepatitis: number;
};

const data: DiseaseDataPoint[] = [
  { name: "Jan", DBD: 260, Diarrhea: 510, Hepatitis: 400 },
  { name: "Feb", DBD: 320, Diarrhea: 420, Hepatitis: 410 },
  { name: "Mar", DBD: 470, Diarrhea: 450, Hepatitis: 420 },
  { name: "Apr", DBD: 480, Diarrhea: 340, Hepatitis: 430 },
  { name: "May", DBD: 260, Diarrhea: 250, Hepatitis: 440 },
];

const colours = ["#CB3CFF", "#9A91FB", "#00C2FF"];
const trendingDiseases = ["DBD", "Diarrhea", "Hepatitis"];

const DiseaseTrendChart = () => {
  const lastIndex = data.length - 1;

  return (
    <div className="bg-[#0B1739] p-4 rounded-lg shadow-md">
      <h3 className="text-white text-lg font-semibold mb-4">
        Disease Trend Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
        >
          {trendingDiseases.map((disease, i) => (
            <Line
              key={disease}
              type="monotone"
              dataKey={disease}
              stroke={colours[i]}
              strokeWidth={2}
              dot={{ fill: colours[i], r: 4 }}
              isAnimationActive={false}
            >
              <LabelList
                dataKey={disease}
                content={({ index, x, y }) => {
                  if (index !== 0 || x == null || y == null) return null;

                  const labelText = disease;
                  const paddingX = 6;
                  const paddingY = 4;
                  const fontSize = 12;
                  const width = labelText.length * 7 + paddingX * 2;
                  const height = fontSize + paddingY * 2;

                  const xNum = Number(x);
                  const yNum = Number(y);

                  return (
                    <g>
                      <rect
                        x={xNum}
                        y={yNum - height - 4}
                        width={width}
                        height={height}
                        fill="white"
                        rx={4}
                      />
                      <text
                        x={xNum + paddingX}
                        y={yNum - height / 2}
                        fill={colours[i]}
                        fontSize={fontSize}
                        fontWeight="bold"
                        alignmentBaseline="middle"
                      >
                        {labelText}
                      </text>
                    </g>
                  );
                }}
              />
            </Line>
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
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiseaseTrendChart;
