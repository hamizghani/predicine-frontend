"use client";
import React, { useState } from "react";

import dynamic from "next/dynamic";

import { useIndexedDB } from "@/hooks/UseIndexedDB";
import RestockAlertModal from "@/components/RestockAlertModal";
import ProductSectionModal from "@/components/ProductSectionModal";
import OverviewModal from "@/components/OverviewModal";

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
          <OverviewModal />
          {/* Restock Alerts and Medicine Recommendation */}
          <RestockAlertModal />
        </div>

        {/* Right Section (Disease Trend Chart) */}
        <div className="w-full lg:w-1/3 rounded-lg shadow h-auto">
          <div className="h-full">
            <DiseaseTrendChart />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <ProductSectionModal />
    </div>
  );
};

export default Dashboard;
