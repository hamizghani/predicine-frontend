"use client";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { FiChevronDown, FiLogOut } from "react-icons/fi";

const ProfileSection = () => {
  const router = useRouter();

  const [periodOpen, setPeriodOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Select Period"); // Default text

  const { auth, setAuth } = useContext(AuthContext);
  const periods = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "Last Year"];

  const handleLogout = () => {
    setAuth({ authenticated: false });
    router.push("/login");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Left Section - About Company */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">About Company</h2>

        <div className="mt-4 space-y-3">
          <label className="block text-gray-600">Company Name</label>
          <input type="text" className="w-full border rounded-lg px-4 py-2" />

          <label className="block text-gray-600">Email</label>
          <input type="email" className="w-full border rounded-lg px-4 py-2" />

          <label className="block text-gray-600">Address</label>
          <input type="text" className="w-full border rounded-lg px-4 py-2" />
        </div>

        {/* Download Report */}
        <div className="mt-6 relative">
          <h3 className="text-xl font-semibold">Download Report</h3>

          <div className="flex items-center justify-between mt-3 border p-3 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <FaDownload className="text-gray-600" />
              <span>Download Transaction Report</span>
            </div>
            <button
              onClick={() => setPeriodOpen(!periodOpen)}
              className="flex items-center px-4 py-2 bg-gray-200 rounded"
            >
              {selectedPeriod} {/* Now displaying selected period */}
              <FiChevronDown
                className={`ml-2 transition-transform ${
                  periodOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Dropdown */}
          {periodOpen && (
            <div className="absolute right-0 mt-2 border rounded-lg shadow-md bg-white w-48">
              {periods.map((period) => (
                <div
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period); // Update selected text
                    setPeriodOpen(false); // Close dropdown after selection
                  }}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {period}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Section - General Information */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">General Information</h2>

        <div className="mt-4 space-y-3">
          <label className="block text-gray-600">Username</label>
          <input type="text" className="w-full border rounded-lg px-4 py-2" />
          <label className="block text-gray-600">Email</label>
          <input type="email" className="w-full border rounded-lg px-4 py-2" />

          <a href="#" className="text-blue-500 text-sm">
            Change password
          </a>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            <FiLogOut />
            Logout
          </button>
          <button className="px-4 py-2 bg-[#6A5CED] text-white rounded-lg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
