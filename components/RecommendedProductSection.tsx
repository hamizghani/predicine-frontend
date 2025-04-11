"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import data from "@/mockup/file.json"; // Assuming mock data is available here
import AddProductModal from "./AddProductModal";
import { Medicine } from "@/types/Medicine";
import { useIndexedDB } from "@/hooks/UseIndexedDB";
import { Product } from "@/types/product";

export default function RecommendedProductSection() {
  const { items: existingProducts } = useIndexedDB<Product>("products");
  const [products, setProducts] = useState<Medicine[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const existingProductIds = existingProducts.map((e) => e.id);
    setProducts(data.products);
  }, [existingProducts]);

  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Products Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-center sm:text-left">
          Recommendations
        </h2>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Products</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity needed</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((product, idx) => (
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
    </>
  );
}
