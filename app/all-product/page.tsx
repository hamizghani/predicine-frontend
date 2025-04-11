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
import { Plus, Filter, Download, PackageX } from "lucide-react";

import data from "@/mockup/data.json"; // Assuming mock data is available here
import RecommendedProductSection from "@/components/RecommendedProductSection";
import { useIndexedDB } from "@/hooks/UseIndexedDB";
import { Product } from "@/types/product";
import ProductSectionModal from "@/components/ProductSectionModal";
import RestockAlertModal from "@/components/RestockAlertModal";

const AllProducts = () => {
  const { items: products } = useIndexedDB<Product>("products");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <ProductSectionModal />

      {/* Divider */}
      <div className="w-full px-5 bg-gray-200 h-[1.5px]"></div>

      <RecommendedProductSection />
    </div>
  );
};

export default AllProducts;
