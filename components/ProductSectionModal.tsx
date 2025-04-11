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
import { Plus, PackageX, PencilLine, ShoppingCart, Trash2 } from "lucide-react";

import { useIndexedDB } from "@/hooks/useIndexedDB";
import DeleteProductModal from "@/components/DeleteProductModal";
import EditProductModal from "./EditProductModal";
import SellProductModal from "./SellProductModal";
import GeneralAddProductModal from "./GeneralAddProductModal";

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
const ProductSectionModal = () => {
  const [editedPrices, setEditedPrices] = useState<{ [key: number]: number }>(
    {}
  );
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-center sm:text-left">
          Products
        </h2>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          <Input placeholder="Search..." className="w-full sm:w-48" />
          <GeneralAddProductModal
            triggerElement={
              <Button className="cursor-pointer w-full bg-[#ECF3FF] text-[#4857C3] sm:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            }
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto w-full">
        <Table className="min-w-[800px] w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Products</TableHead>
              <TableHead className="min-w-[120px]">Selling Price</TableHead>
              <TableHead className="min-w-[100px]">Quantity</TableHead>
              <TableHead className="min-w-[120px]">Product Sold</TableHead>
              <TableHead className="min-w-[140px]">Prediction</TableHead>
              <TableHead className="min-w-[160px]">Availability</TableHead>
              <TableHead className="min-w-[120px] text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
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
                <TableRow key={idx}>
                  {/* Product Info */}
                  <TableCell className="pr-4">
                    <div className="flex max-md:items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex  h-full flex-col overflow-hidden max-w-[240px]">
                        <p className="font-medium text-sm sm:text-base truncate">
                          {product.name}
                        </p>
                        <p className="hidden md:block text-sm text-gray-500 whitespace-normal break-words">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Editable Price */}
                  <TableCell>
                    {editableIndex === idx ? (
                      <input
                        type="number"
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#6B6EAC]"
                        value={editedPrices[idx] ?? product.price ?? 0}
                        onChange={(e) =>
                          setEditedPrices((prev) => ({
                            ...prev,
                            [idx]: Number(e.target.value),
                          }))
                        }
                        onBlur={() => setEditableIndex(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            setEditableIndex(null);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center justify-center text-center w-24">
                        <span className="font-semibold"> IDR&nbsp;</span>{" "}
                        {product.price ?? 0}
                      </div>
                    )}
                  </TableCell>

                  {/* Quantity */}
                  <TableCell>{product.stock} items</TableCell>

                  {/* Sold */}
                  <TableCell>{product.sold} this month</TableCell>

                  {/* Prediction */}
                  <TableCell>{product.prediction.restockDate}</TableCell>

                  {/* Availability Bar */}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="relative w-16 sm:w-24 h-3 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            product.prediction.availability.percentage > 70
                              ? "bg-green-500"
                              : product.prediction.availability.percentage > 30
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

                  {/* Actions */}
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <EditProductModal
                        product={product}
                        triggerElement={
                          <button className="cursor-pointer flex items-center justify-center gap-2 w-20 sm:w-24 text-sm px-1 sm:px-3 py-1 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                            <PencilLine className="w-4 h-4" />
                            Edit
                          </button>
                        }
                      />
                      <SellProductModal
                        product={product}
                        triggerElement={
                          <button className="cursor-pointer flex items-center justify-center gap-2 w-20 sm:w-24 text-sm px-1 sm:px-3 py-1 sm:py-2 bg-[#6B6EAC] text-white rounded hover:bg-[#5a5db2] transition">
                            <ShoppingCart className="w-4 h-4" />
                            Sell
                          </button>
                        }
                      />
                      <DeleteProductModal
                        product={product}
                        triggerElement={
                          <button className="cursor-pointer flex items-center justify-center gap-2 w-20 sm:w-24 text-sm px-1 sm:px-3 py-1 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        }
                      />
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
          disabled={
            currentPage ===
            Math.max(1, Math.ceil(products.length / itemsPerPage))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductSectionModal;
