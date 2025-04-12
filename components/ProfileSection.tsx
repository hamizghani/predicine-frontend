"use client";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FiDownload, FiChevronDown, FiLogOut } from "react-icons/fi";
import axios from "axios";
import ChangePasswordModal from "./ChangePasswordModal";

interface Medicine {
  id: number;
  name: string;
  description: string;
  brief: string;
  imageUrl: string;
}

interface Transaction {
  id: number;
  createdAt: string;
  updatedAt: string;
  medicineId: number;
  amount: number;
  userId: number;
  price: number;
  medicine: Medicine;
}

const filterByPeriod = (transactions: Transaction[], period: string): Transaction[] => {
  const now = new Date();
  let fromDate: Date;

  switch (period) {
    case "Last 7 Days":
      fromDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "Last 30 Days":
      fromDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case "Last 3 Months":
      fromDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case "Last Year":
      fromDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      return transactions; // No filter if "Select Period"
  }

  return transactions.filter(tx => new Date(tx.createdAt) >= fromDate);
};


const ProfileSection = () => {
  const router = useRouter();
  const { setAuth } = useContext(AuthContext);

  const [periodOpen, setPeriodOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Select Period");

  const [regionOpen, setRegionOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(true);

  const periods = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "Last Year"];
  const regions = ["Kalimantan", "Sulawesi", "Jawa", "Papua", "Sumatra"];

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAuth({ authenticated: false });
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/history/mine`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API response:", res.data);

        // Try to find the right field from response
        const fetched = res.data.transactionHistory || [];
        setTransactions(fetched);
      } catch (err) {
        console.error("Failed to fetch transaction history", err);
      } finally {
        setLoading(false);
      }
    };

    
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
        setUsername(user.username);
        setCompanyName(user.name);
        setSelectedRegion(user.region);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setLoading(false);
      }
    };
    
    fetchTransactions();
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/update`,
        {
          name: companyName,
          region: selectedRegion,
          password: "", // optional — can be updated later
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to save changes.");
    }
  };

  type ExportRow = {
    id: number;
    medicineName: string;
    transactionDate: string | Date;
    price: number;
    amount: number;
  };
  
  const convertToCSV = (data: ExportRow[]): string => {
    if (!data || !data.length) {
      return '';
    }
  
    const headers = Object.keys(data[0]);
  
    const csvRows = [
      headers.join(','), // header row
      ...data.map((row) =>
        headers
          .map((field) => {
            const cell = (row as Record<string, any>)[field];
            return typeof cell === 'string' && (cell.includes(',') || cell.includes('\n'))
              ? `"${cell.replace(/"/g, '""')}"`
              : cell;
          })
          .join(',')
      )
    ];
  
    return csvRows.join('\n');
  };
  
  const downloadCSV = (csvData: string, filename: string): void => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
  
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExport = async (): Promise<void> => {
    const filtered = filterByPeriod(transactions, selectedPeriod);
  
    const csv = convertToCSV(
      filtered.map((e): ExportRow => ({
        id: e.id,
        medicineName: e.medicine.name,
        transactionDate: e.createdAt,
        price: e.price,
        amount: e.amount
      }))
    );
  
    if (!csv) {
      alert('No data available to export.');
      return;
    }
  
    downloadCSV(csv, 'exported_data.csv');
  };
  

  return (
    <div
      className="rounded-xl flex flex-col items-center justify-start gap-6 py-10 px-4 sm:px-6 md:px-10 bg-cover bg-center min-h-screen"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <h2 className="text-2xl font-semibold text-white text-center">
        Profile Data {companyName}
      </h2>

      <div className="bg-white w-full max-w-md sm:max-w-2xl p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">About Company</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <p className="font-medium text-gray-800">{username}</p>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Company Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2"
              value={companyName}
              autoComplete="off"
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Region</label>
            <div className="relative">
              <div
                className="flex justify-between items-center border rounded-lg px-4 py-2 cursor-pointer"
                onClick={() => setRegionOpen(!regionOpen)}
              >
                {selectedRegion || "Select a region"}
                <FiChevronDown
                  className={`ml-2 transition-transform ${
                    regionOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {regionOpen && (
                <div className="absolute w-full border mt-1 bg-white z-10 rounded shadow">
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

          <div>
            <ChangePasswordModal
              triggerElement={
                <p className="text-blue-500 text-sm mt-2 cursor-pointer hover:underline">
                  Change Password
                </p>
              }
            />{" "}
          </div>

          <div className="flex flex-col sm:flex-row justify-end sm:justify-between gap-4 mt-4">
            <button
              onClick={handleLogout}
              className="cursor-pointer hover:opacity-70 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg w-full sm:w-auto"
            >
              <FiLogOut />
              Logout
            </button>
            <button
              onClick={handleSave}
              className="cursor-pointer hover:opacity-70 px-4 py-2 bg-[#6A5CED] text-white rounded-lg w-full sm:w-auto"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Report Section */}
      <div className="bg-white w-full max-w-md sm:max-w-2xl p-6 rounded-lg shadow-md border">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">Transaction Report</h3>
          <p className="text-gray-600 mt-1 text-sm">
            View your transaction summary by selecting a period. Download the
            report or explore the full details.
          </p>
        </div>

        <div className="mt-4 text-center">
          <h4 className="font-semibold mb-2">Time Period</h4>
          <button
            onClick={() => setPeriodOpen(!periodOpen)}
            className="flex items-center justify-center mx-auto px-4 py-2 bg-gray-200 rounded"
          >
            {selectedPeriod}
            <FiChevronDown
              className={`ml-2 transition-transform ${
                periodOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {periodOpen && (
            <div className="absolute w-fit border ml-15 -mt-20 bg-white z-10 rounded shadow">
              {periods.map((period) => (
                <div
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setPeriodOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {period}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button onClick={handleExport} className="cursor-pointer hover:opacity-70 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg w-full">
            <FiDownload />
            Download
          </button>
          <button
            onClick={() => router.push("/history")}
            className="cursor-pointer hover:opacity-70 px-4 py-2 bg-[#6A5CED] text-white rounded-lg w-full"
          >
            See Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
