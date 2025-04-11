"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust the import path if needed

const mockTransactions = [
  {
    id: 1,
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-04-01"),
    medicineId: 1,
    amount: 3,
    userId: 101,
    price: 25000,
    medicine: {
      id: 1,
      name: "Paracetamol",
      description: "Pain reliever and fever reducer",
      brief: "Fever & Pain",
      imageUrl: "https://via.placeholder.com/80",
      transactionHistory: [],
    },
  },
  {
    id: 2,
    createdAt: new Date("2025-04-02"),
    updatedAt: new Date("2025-04-02"),
    medicineId: 2,
    amount: 1,
    userId: 102,
    price: 15000,
    medicine: {
      id: 2,
      name: "Ibuprofen",
      description: "Anti-inflammatory and pain relief",
      brief: "Inflammation",
      imageUrl: "https://via.placeholder.com/80",
      transactionHistory: [],
    },
  },
];

const TransactionHistoryTable = () => {
  return (
    <div className="overflow-x-auto p-6">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead>Products</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Transaction Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTransactions.map((tx) => (
            <TableRow key={tx.id} className="md:table-row">
              <TableCell className="flex items-center mr-10 space-x-4">
                <img
                  src={tx.medicine.imageUrl}
                  alt={tx.medicine.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <p className="font-medium">{tx.medicine.name}</p>
                  <p className="hidden md:block text-sm text-gray-500">
                    {tx.medicine.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>IDR {tx.price.toLocaleString()}</TableCell>
              <TableCell>{tx.amount} items</TableCell>
              <TableCell>{tx.userId}</TableCell>
              <TableCell>{tx.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionHistoryTable;
