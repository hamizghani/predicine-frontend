"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const TransactionHistoryTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
        console.log("API response:", res.data);

        // Try to find the right field from response
        const fetched = res.data.transactionHistory || [];
        setTransactions(fetched);
      } catch (err) {
        console.error("Failed to fetch transaction history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="overflow-x-auto p-6">
      <h1 className="font-medium text-xl mb-4">Sales History</h1>
      <div className="w-full px-5 bg-gray-200 h-[1.5px] mb-4"></div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <Table className="w-full min-w-[700px] max-w-[1000px] mx-auto text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Products</TableHead>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead className="w-[80px]">Qty</TableHead>
              <TableHead className="w-[100px]">User ID</TableHead>
              <TableHead className="w-[140px]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="flex items-center space-x-3">
                  <img
                    src={tx.medicine.imageUrl}
                    alt={tx.medicine.name}
                    className="w-10 h-10 object-cover rounded-md"
                  />  
                  <div className="flex flex-col">
                    <p className="font-medium truncate">{tx.medicine.name}</p>
                    <p className="hidden md:block text-xs text-gray-500 truncate">
                      {tx.medicine.brief}
                    </p>
                  </div>
                </TableCell>
                <TableCell>IDR {tx.price.toLocaleString()}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>{tx.userId}</TableCell>
                <TableCell>
                  {new Date(tx.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TransactionHistoryTable;
