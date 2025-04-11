"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Plus, Filter, PackageX } from "lucide-react";
import dynamic from "next/dynamic";

import data from "@/mockup/data.json"; // Assuming mock data is available here
import { useIndexedDB } from "@/hooks/useIndexedDB";

interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  stock: number;
  sold: number;
  category: string;
  prediction: {
    restockDate: string;
    availability: {
      percentage: number;
      status: string;
    };
  };
}

// Dynamically import the chart component, disabling SSR
const DiseaseTrendChart = dynamic(
  () => import("@/components/DiseaseTrendChart"),
  {
    ssr: false,
  }
);

const Dashboard = () => {
  const { items: products } = useIndexedDB<Product>("products");
  // const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // useEffect(() => {
  //   setProducts(data.products);
  // }, []);

  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 space-y-6 w-full">
      <h1 className="font-medium text-xl">Overview</h1>

      <div className="w-full px-5 bg-gray-200 h-[1.5px]"></div>

      <div className="flex flex-col lg:flex-row w-full gap-10">
        {/* Left Section */}
        <div className="lg:w-2/3 w-full">
          {/* Overview Cards */}
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between mb-10 gap-4">
            <OverviewCard title="Sales" value="IDR 832" trend="up" />
            <div className="h-12 w-px bg-gray-300 hidden lg:block" />
            <OverviewCard title="Quantity" value="413" />
            <div className="h-12 w-px bg-gray-300 hidden lg:block" />
            <OverviewCard title="Top Selling" value="Lansoprazole" />
            <div className="h-12 w-px bg-gray-300 hidden lg:block" />
            <OverviewCard
              title="Overall Stock Status"
              value="15%"
              percentage={15}
            />
          </div>

          {/* Restock Alerts and Medicine Recommendation */}
          <div className="flex flex-col lg:flex-row bg-[#2A2E60] rounded-xl p-4 gap-6">
            {/* Restock Alerts */}
            <div className="lg:w-1/2 w-full text-white p-4">
              <h2 className="text-lg font-semibold">Restock Alerts</h2>
              <p className="text-sm text-gray-300">Stock running low</p>
              <ul className="mt-4 space-y-4">
                {data.restockAlerts.map((alert, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center text-white"
                  >
                    <span className="text-sm sm:text-base">{alert.name}</span>
                    <span className="bg-[#FF5A65] text-red-800 opacity-75 text-xs sm:text-sm px-2 py-1 font-medium rounded">
                      {alert.quantity} items left
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider for mobile */}
            <div className="w-full h-px bg-gray-200 my-4 lg:hidden"></div>

            {/* Medicine Recommendation */}
            <div className="lg:w-1/2 w-full text-white p-4">
              <h2 className="text-lg font-semibold">Medicine Recommendation</h2>
              <ul className="mt-4 space-y-4 overflow-x-auto">
                {data.medicineRecommendations.map((med, idx) => (
                  <li key={idx} className="text-white text-sm sm:text-base">
                    {med}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section (Disease Trend Chart) */}
        <div className="w-full lg:w-1/3 rounded-lg shadow h-auto">
          <div className="h-full">
            <DiseaseTrendChart />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-center sm:text-left">
            Products
          </h2>
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
            <Input placeholder="Search..." className="w-full sm:w-48" />
            <Button className="w-full bg-[#ECF3FF] text-[#4857C3] sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Products</TableHead>
                <TableHead>Buying Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Product Sold</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead>Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                      <PackageX className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                      <p className="text-sm sm:text-base font-medium">
                        No products available
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Try adding a new product to get started.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((product, idx) => (
                  <TableRow key={idx} className="md:table-row">
                    <TableCell className="flex items-center mr-10 space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex flex-col">
                        <p className="font-medium">{product.name}</p>
                        <p className="hidden md:block text-sm text-gray-500 text-wrap">
                          {product.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>IDR {product.price}</TableCell>
                    <TableCell>{product.stock} items</TableCell>
                    <TableCell>{product.sold} this month</TableCell>
                    <TableCell>{product.prediction.restockDate}</TableCell>
                    <TableCell>
                      {/* Availability with Dynamic Colors */}
                      <div className="flex items-center space-x-2">
                        <div className="relative w-16 sm:w-24 h-3 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full ${
                              product.prediction.availability.percentage > 70
                                ? "bg-green-500"
                                : product.prediction.availability.percentage >
                                  30
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${product.prediction.availability.percentage}%`,
                            }}
                          ></div>
                        </div>

                        <span
                          className={`text-sm font-semibold ${
                            product.prediction.availability.percentage > 70
                              ? "text-green-600"
                              : product.prediction.availability.percentage > 30
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.prediction.availability.percentage}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of{" "}
            {Math.max(1, Math.ceil(products.length / itemsPerPage))}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(products.length / itemsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

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

export default Dashboard;
