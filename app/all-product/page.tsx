"use client";
import React, { useEffect, useState } from "react";

import RecommendedProductSection from "@/components/RecommendedProductSection";
import ProductSectionModal from "@/components/ProductSectionModal";
import RestockAlertModal from "@/components/RestockAlertModal";
import axios from "axios";
import { useProductRefresh } from "@/context/ProductRefreshContext";

const AllProducts = () => {
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
  const { trigger } = useProductRefresh();

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
      <h1 className="font-medium text-xl">All Products</h1>
      <div className="w-full px-5 bg-gray-200 h-[1.5px]"></div>
      {/* Restock Alerts */}
      <RestockAlertModal />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"></div>
      {/* Divider */}
      <div className="w-full px-5 bg-gray-200 h-[1.5px]"></div>
      {/* Products Section */}
      {userData.price.length > 0 ? (
        <ProductSectionModal userPrice={userData.price} />
      ) : (
        <p className="font-semibold">Loading your products...</p>
      )}{" "}
      {/* Divider */}
      <div className="w-full px-5 bg-gray-200 h-[1.5px]"></div>
      <RecommendedProductSection />
    </div>
  );
};

export default AllProducts;
