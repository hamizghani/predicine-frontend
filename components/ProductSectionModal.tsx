"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

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
import {
  Plus,
  PackageX,
  PencilLine,
  ShoppingCart,
  Trash2,
  ChevronDown,
  ChevronUp,
  Package,
  Download,
} from "lucide-react";

import DeleteProductModal from "@/components/DeleteProductModal";
import EditProductModal from "./EditProductModal";
import SellProductModal from "./SellProductModal";
import GeneralAddProductModal from "./GeneralAddProductModal";
import { useProductRefresh } from "@/context/ProductRefreshContext";
import EditBatchModal from "./EditBatchModal";

interface StockBatch {
  id: number;
  expirationDate: Date;
  amount: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  brief: string;
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
  batches: StockBatch[];
}

const ProductSectionModal = ({ userPrice }: { userPrice: number[] }) => {
  const [editedPrices, setEditedPrices] = useState<{ [key: number]: number }>(
    {}
  );
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  const { trigger } = useProductRefresh();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/mine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formatted: Product[] = res.data.stocks.map((stock: any) => ({
          id: stock.medicine.id,
          name: stock.medicine.name,
          description: stock.medicine.description,
          brief: stock.medicine.brief,
          image: stock.medicine.imageUrl,
          currency: "IDR",
          price: userPrice[stock.medicine.id],
          category: "",
          stock: stock.total,
          sold: stock.sold,
          batches: stock.batches ?? [],
          prediction: {
            restockDate: "Unknown",
            availability: {
              percentage: Math.round(
                (stock.total / (stock.total + stock.sold || 1)) * 100
              ),
              status: "Unknown",
            },
          },
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("Failed to fetch user products", err);
      }
    };

    fetchProducts();
  }, [trigger, userPrice]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg flex gap-2 justify-center font-semibold text-center sm:text-left">
          <Package />
          Products
        </h2>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" /> Download Report
          </Button>
          <Input
            placeholder="Search..."
            className="w-full sm:w-48"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on new search
            }}
          />
          <GeneralAddProductModal
            triggerElement={
              <Button className="cursor-pointer w-full bg-[#ECF3FF] text-[#4857C3] sm:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            }
          />
        </div>
      </div>

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
              currentItems.reverse().map((product, idx) => (
                <React.Fragment key={idx}>
                  <TableRow>
                    <TableCell className="pr-4">
                      <div className="flex max-md:items-center space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex h-full flex-col overflow-hidden max-w-[240px]">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {product.name}
                          </p>
                          <p className="hidden md:block text-sm text-gray-500 whitespace-normal break-words truncate">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center text-center w-24">
                        <span className="font-semibold">IDR&nbsp;</span>
                        {product.price ?? 0}
                      </div>
                    </TableCell>
                    <TableCell>{product.stock} items</TableCell>
                    <TableCell>{product.sold} product(s)</TableCell>
                    <TableCell>{product.prediction.restockDate}</TableCell>
                    <TableCell>
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
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <SellProductModal
                          product={product}
                          triggerElement={
                            <Button className="cursor-pointer border-2 flex items-center justify-center gap-2 w-20 sm:w-24 text-sm px-1 sm:px-3 py-1 sm:py-2 bg-[#ECF3FF] text-[#4857C3]">
                              <ShoppingCart className="w-4 h-4" />
                              Sell
                            </Button>
                          }
                        />
                        <EditProductModal
                          product={product}
                          triggerElement={
                            <Button className="cursor-pointer border-2 flex items-center justify-center gap-2 w-20 sm:w-24 text-sm px-1 sm:px-3 py-1 sm:py-2 bg-[#ECF3FF] text-[#4857C3]">
                              <PencilLine className="w-4 h-4" />
                              Edit
                            </Button>
                          }
                        />
                        <DeleteProductModal
                          product={product}
                          triggerElement={
                            <button className="cursor-pointer border-2 flex items-center justify-center gap-2 w-20 sm:w-24 text-sm px-1 sm:px-3 py-1 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          }
                        />
                        {product.batches.length > 0 && (
                          <button
                            className="flex items-center gap-1 text-sm text-[#4857C3] mt-1 hover:underline"
                            onClick={() =>
                              setExpandedIndex(
                                expandedIndex === idx ? null : idx
                              )
                            }
                          >
                            {expandedIndex === idx ? (
                              <>
                                Hide Batches <ChevronUp className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                Show Batches <ChevronDown className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedIndex === idx && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50 py-4">
                        <div className="space-y-3 ">
                          <p className="ml-4 w-fit rounded-xl font-medium bg-[#2A2E60] text-white px-4 py-2">
                            <strong>Batches</strong>
                          </p>
                          <div className="space-y-2">
                            {product.batches.map((batch) => (
                              <div
                                key={batch.id}
                                className="flex justify-between px-6 gap-2 items-center text-sm text-gray-700 border-b pb-2 w-full"
                              >
                                <span>
                                  <strong>Expiration:</strong>{" "}
                                  {new Date(
                                    batch.expirationDate
                                  ).toLocaleDateString()}
                                </span>
                                <span>
                                  <strong>Amount:</strong> {batch.amount} pcs
                                </span>
                                <div className="text-right sm:text-left">
                                  <EditBatchModal
                                    batch={{
                                      id: batch.id,
                                      amount: batch.amount,
                                      expirationDate: new Date(
                                        batch.expirationDate
                                      )
                                        .toISOString()
                                        .split("T")[0], // ensure it's a date string like '2025-04-12'
                                    }}
                                    triggerElement={
                                      <button className="cursor-pointer text-xs px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition">
                                        Edit
                                      </button>
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
