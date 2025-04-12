"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import rawData from "@/mockup/medicine.json";
import AddProductModal from "./AddProductModal";
import { Medicine } from "@/types/medicine";
import { Sparkle } from "lucide-react";
import { useProductRefresh } from "@/context/ProductRefreshContext";

interface RawMedicine {
  id: number;
  medicine_name: string;
  description: string;
  brief: string;
  photo_link: string;
}

const medicineMap: Record<number, Medicine> = Object.fromEntries(
  (rawData as RawMedicine[]).map((item) => [
    item.id,
    {
      id: item.id,
      name: item.medicine_name,
      description: item.description,
      brief: item.brief,
      imageUrl: item.photo_link,
      transactionHistory: [],
    },
  ])
);

type RecommendedProduct = Medicine & { quantity: number };

export default function RecommendedProductSection() {
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { trigger } = useProductRefresh();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/prediction/recommended`
        );

        const recommendations: { id: number; amount: number }[] = res.data.data;

        const mapped: RecommendedProduct[] = recommendations
          .map((rec) => {
            const med = medicineMap[rec.id];
            if (!med) return null;
            return {
              ...med,
              quantity: rec.amount || 0,
            };
          })
          .filter(Boolean) as RecommendedProduct[];

        setProducts(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommendations();
  }, [trigger]);

  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg flex gap-2 justify-center w-fit font-semibold text-center sm:text-left">
        <Sparkle />
        Recommendations
      </h2>

      <div className="overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Products</TableHead>
              <TableHead>Quantity needed</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems
              .filter((product) => product.quantity > 0)
              .map((product, idx) => (
                <TableRow key={idx}>
                  <TableCell className="flex items-center mr-10 space-x-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium">{product.name}</p>
                      <p className="hidden md:block text-sm text-gray-500">
                        {product.brief}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{product.quantity} items</TableCell>
                  <TableCell>
                    <AddProductModal
                      medicine={product}
                      triggerElement={
                        <Button className="text-[#4857C3] bg-[#ECF3FF]">
                          Add Product
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {Math.ceil(products.length / itemsPerPage)}
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
  );
}
