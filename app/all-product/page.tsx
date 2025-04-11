"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Download } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" /> Download Report
          </Button>
        </div>
        {/* <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          <Input placeholder="Search..." className="w-full sm:w-48" />
          <Button className="w-full bg-[#ECF3FF] text-[#4857C3] sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div> */}
      </div>
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
