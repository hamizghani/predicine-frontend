"use client";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { FiChevronDown, FiLogOut } from "react-icons/fi";

const ProfileSection = () => {
  const router = useRouter();

  const [periodOpen, setPeriodOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Select Period"); // Default text

  const [regionOpen, setRegionOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Select Region"); // Default text
  

  const { auth, setAuth } = useContext(AuthContext);
  const periods = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "Last Year"];
  const regions = ["Kalimantan", "Sulawesi", "Jawa", "Papua"];  
  const [username, setUsername] = useState("ryanGilang");
  const [companyName, setCompanyName] = useState("Primakara Apotek");
  

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Remove token
    setAuth({ authenticated: false }); //  Reset context
    router.push("/login"); //  Redirect (optional)
  };


  return (
    <div className="flex flex-col items-center justify-center md:flex-col gap-4  min-h-screen pb-40" style={{ backgroundImage: "url('/bg.png')" }}>
      
      {/* Right Section - General Information */}
      <h2 className="m-6 text-2xl font-semibold text-white">Profile Data {companyName}</h2>
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md border-2 border-gray-100 w-[400px] lg:w-[700px]">
      <h2 className="text-2xl font-semibold">About Company</h2>

      <div className="mt-4 space-y-3">
      <div>
        <label className="block text-gray-600 mb-4">Company Name</label>
        <input
          type="text"
          className="w-full border rounded-lg px-4 py-2"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-600 mb-4">Username</label>
        <input
          className="w-full border rounded-lg px-4 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <label className="block text-gray-600">Region</label>
      {/* Container for input and dropdown */}
      <div className="relative">
        {/* Trigger (optional) */}
      <div
        className="flex flex-row items-center justify-between w-full border rounded-lg px-4 py-2 cursor-pointer"
        onClick={() => setRegionOpen(!regionOpen)}
      >
        {selectedRegion || "Select a region"}

        <FiChevronDown
            className={`ml-2 transition-transform ${
              periodOpen ? "rotate-180" : ""
            }`}
          />
      </div>
          
      <div>
        <label className="mt-4 block text-gray-600 mb-4">Password</label>
        <input
          className="w-full border rounded-lg px-4 py-2"
          value="*********"
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* change password */}
      </div>

      <p
        onClick={() => {
          // Handle your change password logic here (e.g., show a modal or redirect)
          console.log("Change password clicked");
        }}
        className="text-blue-500 text-m mt-2 cursor-pointer hover:underline"
      >
        Change Password
      </p>

          
      {/* Buttons */}
      <div className="flex flex-row mt-6 gap-4 justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          <FiLogOut />
          Logout
        </button>
        <button className="px-4 py-2 bg-[#6A5CED] text-white rounded-lg">
          Save Changes
        </button>
      </div>
          
      {/* Dropdown */}
      {regionOpen && (
        <div className="absolute top-10 left-0 right-0 mt-1 border rounded-lg shadow-md bg-white z-10">
          {regions.map((region) => (
            <div
              key={region}
              onClick={() => {
                setSelectedRegion(region);
                setRegionOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {region}
            </div>
          ))}
        </div>
      )}

      </div>
    </div>
    </div>

    <div className=" bg-white p-6 rounded-lg shadow-md border-2 border-gray-100 w-[400px] lg:w-[700px]"> 
      {/* Download Report */}
      <div className="flex flex-col my-3 relative justify-center">
        <div className="flex justify-center">
          <h3 className="text-2xl font-semibold mb-1">Transaction Report</h3> 
        </div>
        <div className="w-full flex justify-center ">
          <p className="text-center max-w-[500px]">View your transaction summary by selecting a period. Download the report or explore the full details.</p>
        </div>

        <div className=" flex flex-col items-center mt-4">
          <h4 className="font-semibold my-2">Time Periode</h4>
          <button
            onClick={() => setPeriodOpen(!periodOpen)}
            className="relative flex items-center px-4 py-2 bg-gray-200 rounded"
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
        <div className="absolute left-60 -bottom-28 mt-2 border rounded-lg shadow-md bg-white w-48">
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

      {/* Buttons */}
      <div className="flex flex-row mt-6 gap-6 w-full">
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg w-1/2 "
        >
          <FiDownload />
          Download
        </button>
        <button className="px-4 py-2 bg-[#6A5CED] text-white rounded-lg w-1/2"
          onClick={() => router.push("/history")}>
          See Details
        </button>
      </div>
    </div>
    </div>
    
    </div>
  );  
};

export default ProfileSection;
