import React from "react";
import data from "@/mockup/data.json"; // Assuming mock data is available here

const RestockAlertModal = () => {
  return (
    <div className="flex flex-col lg:flex-row bg-gradient-to-r from-[#1E224B] via-[#2A2E60] to-[#2E316D] rounded-xl p-4 gap-6 text-white shadow-md">
      {" "}
      {/* Restock Alerts */}
      <div className="lg:w-1/2 w-full text-white p-4">
        <h2 className="text-lg font-semibold">Restock Alerts</h2>
        <p className="text-sm text-gray-300">Stock running low</p>
        <ul className="mt-4 space-y-4">
          {data.restockAlerts.map((alert, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center text-white"
            >
              <span className="text-sm sm:text-base">{alert.name}</span>
              <span className="bg-[#FF5A65] text-red-800 opacity-75 text-xs sm:text-sm px-2 py-1 font-medium rounded">
                {alert.quantity} items left
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* Divider for mobile */}
      <div className="w-full h-px bg-gray-200 my-4 lg:hidden"></div>
      {/* Medicine Recommendation */}
      <div className="lg:w-1/2 w-full text-white p-4">
        <h2 className="text-lg font-semibold">Medicine Recommendation</h2>
        <ul className="mt-4 space-y-4 overflow-x-auto">
          {data.medicineRecommendations.map((med, idx) => (
            <li key={idx} className="text-white text-sm sm:text-base">
              {med}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RestockAlertModal;
