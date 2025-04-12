"use client";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FiDownload, FiChevronDown, FiLogOut } from "react-icons/fi";
import axios from "axios";
import ChangePasswordModal from "./ChangePasswordModal";
import UploadHistory from "./UploadHistory";
import toast from "react-hot-toast";

// Define types for Medicine and Transaction
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

// Updated function with correct type for the transactions filter
const filterByPeriod = (
  transactions: Transaction[],
  period: string
): Transaction[] => {
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

  return transactions.filter((tx) => new Date(tx.createdAt) >= fromDate);
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
    toast.success("Logged out!");
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
          password: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message); // Access properties of the Error object safely
        toast.error("Failed to save changes.");
      } else {
        console.log(error); // Handle non-Error cases
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // Corrected type for ExportRow
  type ExportRow = {
    id: number;
    medicineName: string;
    transactionDate: string | Date;
    price: number;
    amount: number;
  };

  const convertToCSV = (data: ExportRow[]): string => {
    if (!data || !data.length) {
      return "";
    }

    const headers = Object.keys(data[0]);

    const csvRows = [
      headers.join(","), // header row
      ...data.map((row) =>
        headers
          .map((field) => {
            const cell = row[field as keyof ExportRow]; // Use keyof for better type safety
            const cellToWrite =
              cell instanceof Date ? cell.toISOString() : cell;
            return typeof cellToWrite === "string" &&
              (cellToWrite.includes(",") || cellToWrite.includes("\n"))
              ? `"${cellToWrite.replace(/"/g, '""')}"`
              : cellToWrite;
          })
          .join(",")
      ),
    ];

    return csvRows.join("\n");
  };

  const downloadCSV = (csvData: string, filename: string): void => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async (): Promise<void> => {
    const filtered = filterByPeriod(transactions, selectedPeriod);

    if (!filtered.length) {
      toast.error("No data available to export.");
      return;
    }

    const csv = convertToCSV(
      filtered.map(
        (e): ExportRow => ({
          id: e.id,
          medicineName: e.medicine.name,
          transactionDate: e.createdAt,
          price: e.price,
          amount: e.amount,
        })
      )
    );

    downloadCSV(csv, "exported_data.csv");
    toast.success("CSV downloaded!");
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
      <div className="bg-white w-full max-w-md sm:max-w-2xl p-6 rounded-lg shadow-md border mt-8">
        <h2 className="text-xl font-semibold mb-4">Report</h2>
        <button
          onClick={() => router.push("/history")}
          className="cursor-pointer hover:opacity-70 px-4 my-2 py-2 bg-[#6A5CED] text-white rounded-lg w-full"
        >
          See Details
        </button>
        <div>
          <label className="block text-gray-600 mb-1">Filter by period</label>
          <div
            className="flex justify-between items-center border rounded-lg px-4 py-2 cursor-pointer"
            onClick={() => setPeriodOpen(!periodOpen)}
          >
            {selectedPeriod || "Select Period"}
            <FiChevronDown
              className={`ml-2 transition-transform ${
                periodOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {periodOpen && (
            <div className="absolute w-full border mt-1 bg-white z-10 rounded shadow">
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

        <div className="flex justify-end mt-6">
          <button
            onClick={handleExport}
            className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            <FiDownload />
            Export Data
          </button>
        </div>
      </div>

      <UploadHistory />
    </div>
  );
};

export default ProfileSection;
