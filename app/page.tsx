"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

import RestockAlertModal from "@/components/RestockAlertModal";
import ProductSectionModal from "@/components/ProductSectionModal";
import OverviewModal from "@/components/OverviewModal";
import { useProductRefresh } from "@/context/ProductRefreshContext";

// Dynamically import chart
const DiseaseTrendChart = dynamic(
  () => import("@/components/DiseaseTrendChart"),
  {
    ssr: false,
  }
);

const Dashboard = () => {
  const { trigger } = useProductRefresh();

  const [userData, setUserData] = useState<{
    name: string;
    sales: number;
    quantitySold: number;
    price: number[];
  }>({
    name: "User",
    sales: 0,
    quantitySold: 0,
    price: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/self`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const user = res.data.user;
        setUserData({
          name: user.name,
          sales: user.sales,
          quantitySold: user.quantitySold,
          price: user.price ?? [],
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUser();
  }, [trigger]);

  return (
    <div className="p-4 space-y-6 w-full">
      <h1 className="font-medium text-xl">Welcome, {userData.name}</h1>
      <div className="w-full px-5 bg-gray-200 h-[1.5px]"></div>
      <div className="flex flex-col lg:flex-row w-full gap-10">
        {/* Left Section */}
        <div className="lg:w-2/3 w-full">
          <OverviewModal
            sales={userData.sales}
            quantity={userData.quantitySold}
            topSelling="Lansoprazole" // Replace with dynamic if available
          />
          <RestockAlertModal />
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/3 rounded-lg shadow h-auto">
          <div className="h-full">
            <DiseaseTrendChart />
          </div>
        </div>
      </div>
      {/* Products Section */}
      {userData.price.length > 0 ? (
        <ProductSectionModal userPrice={userData.price} />
      ) : (
        <p className="font-semibold">Loading your products...</p>
      )}{" "}
    </div>
  );
};

export default Dashboard;
