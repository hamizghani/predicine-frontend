"use client";
import React, { useEffect, useState } from "react";
import DiseaseTrendChart from "@/components/DiseaseTrendChart";
import MedicineTrendChart from "@/components/MedicineTrendChart";
import RecommendedProductSection from "@/components/RecommendedProductSection";
import { format, parseISO } from "date-fns";
import axios from "axios";

interface Medicine {
  id: number;
  name: string;
  description: string;
  brief: string;
  imageUrl: string;
}

interface Transaction {
  id: number;
  createdAt: string;
  updatedAt: string;
  medicineId: number;
  amount: number;
  userId: number;
  price: number;
  medicine: Medicine;
}

const Analytics = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [trendData, setTrendData] = useState<
    { name: string; [key: string]: number | string }[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/history/mine`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetched: Transaction[] = res.data.transactionHistory || [];
        console.log("Fetched transactions:", fetched); // Log the fetched transactions
        setTransactions(fetched);

        const trend: Record<string, Record<string, number>> = {};

        for (const tx of fetched) {
          // Validate createdAt
          const createdAt = tx.createdAt ? parseISO(tx.createdAt) : null;
          if (!createdAt || isNaN(createdAt.getTime())) continue; // Skip invalid dates

          const month = format(createdAt, "MMM");
          const name = tx.medicine.name;

          if (!tx.medicine || !name) continue; // Skip if no medicine name

          console.log(
            "Transaction date:",
            tx.createdAt,
            "Month:",
            month,
            "Medicine:",
            name
          ); // Log the details

          if (!trend[month]) trend[month] = {};
          if (!trend[month][name]) trend[month][name] = 0;

          trend[month][name] += tx.amount;
        }

        console.log("Trend object before conversion:", trend); // Log the trend object

        const data = Object.entries(trend).map(([month, meds]) => ({
          name: month,
          ...meds,
        }));

        console.log("Final trendData array:", data); // Log the final trendData

        setTrendData(data);
      } catch (err) {
        console.error("Failed to fetch transaction history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col p-4 gap-y-8 w-full">
      <h1 className="font-medium text-xl">Disease Trend Analysis</h1>
      <div className="w-full px-5 bg-gray-200 h-[1.5px]" />

      <div className="w-full rounded-lg shadow h-auto">
        <DiseaseTrendChart />
      </div>

      <div className="space-y-4 py-6">
        <h2 className="text-xl font-medium">Medicine Analysis</h2>
        <RecommendedProductSection />
      </div>

      <h1 className="font-medium text-xl">Medicine Prediction</h1>
      <div className="w-full px-5 bg-gray-200 h-[1.5px]" />

      <div className="flex flex-col md:flex-row gap-x-6">
        <div className="w-full md:w-1/2">
          {trendData.length > 0 ? (
            <MedicineTrendChart data={trendData} />
          ) : (
            <div className="text-sm text-gray-500">
              No trend data to display
            </div>
          )}
        </div>

        <div className="overflow-x-auto w-full md:w-1/2">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="my-5 w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Medicine</th>
                  <th className="py-3 px-4 text-left">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  transactions.reduce((acc, tx) => {
                    acc[tx.medicine.name] =
                      (acc[tx.medicine.name] || 0) + tx.amount;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([name, total]) => (
                  <tr key={name} className="border-b">
                    <td className="py-3 px-4 font-medium">{name}</td>
                    <td className="py-3 px-4 text-gray-700">{total} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
