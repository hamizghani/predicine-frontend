"use client";

import DiseaseTrendChart from "@/components/DiseaseTrendChart";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import data from "@/mockup/data.json"; // Assuming mock data is available here
import MedicineTrendChart from "@/components/MedicineTrendChart";

interface Medicine {
  id: number;
  name: string;
  sales: string;
  demand: string;
}


const mockData: Medicine[] = [
  { id: 1, name: "Clopidogrel", sales: "123 in this month", demand: "123 in this month" },
  { id: 2, name: "Clopidogrel", sales: "123 in this month", demand: "123 in this month" },
  { id: 3, name: "Clopidogrel", sales: "123 in this month", demand: "123 in this month" },
];

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


const Analytics = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
  
    useEffect(() => {
      setProducts(data.products);
    }, []);
  
    const currentItems = products.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const [selected, setSelected] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };


  return (
        <div  className="flex flex-col p-4 gap-y-8 w-full">
            {/* Sub-header : Diseas Prediction */}
            <h1 className="font-medium text-xl">Disease Prediction</h1>
            <div className="w-full px-5 bg-gray-200 h-[1.5px]"></div>

            {/* Disease Trend Chart */}
            <div className="w-full rounded-lg shadow h-auto">
                <div className="h-full">
                    <DiseaseTrendChart />
                </div>
            </div>

            {/* Disease Trend Analysis Table */}
            <div className="space-y-4 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-medium text-center sm:text-left">
                  Disease Trend Analysis
                </h2>
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

            {/* Sub-header : Medicine Prediction */}
            <h1 className="font-medium text-xl">Medicine Prediction</h1>
                <div className="w-full px-5 bg-gray-200 h-[1.5px]"></div>


            <div className="flex flex-row gap-x-6">
              {/* Medicine Trend Chart */}
              <div className="w-1/2">
                <div className="w-full  rounded-lg shadow h-auto">
                    <div className="h-full">
                        <MedicineTrendChart />
                    </div>
                </div>
              </div>

              {/* Table Medicine Trend */}
              <table className="w-1/2 bg-white rounded-lg shadow">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Medicine</th>
                    <th className="py-3 px-4 text-left">Sales</th>
                    <th className="py-3 px-4 text-left">Projected Customer Demand</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((medicine) => (
                    <tr key={medicine.id} className="border-b align-middle">
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center space-x-3 h-full">
                        <Checkbox
                          checked={selected.includes(medicine.id)}
                          onCheckedChange={() => toggleSelect(medicine.id)}
                        />
                        <span className="font-semibold">{medicine.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 align-middle">{medicine.sales}</td>
                    <td className="py-3 px-4 text-gray-600 align-middle">{medicine.demand}</td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>

        </div>
  );
};

export default Analytics;
