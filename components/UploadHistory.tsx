import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";

type ParsedRow = {
  [key: string]: string | number;
};

export default function UploadHistory() {
  const [jsonData, setJsonData] = useState<ParsedRow[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setJsonData(results.data as ParsedRow[]);
        toast.success("CSV parsed successfully!");
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast.error("Error parsing CSV file.");
      },
    });
  };

  const handleSendToApi = async () => {
    const loadingToast = toast.loading("Sending data...");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/history/import`,
        {
          history: jsonData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) throw new Error("Failed to send data");

      toast.success("Data sent successfully!", { id: loadingToast });
      setJsonData([]); // optional: clear after success
    } catch (error) {
      console.error(error);
      toast.error("Failed to send data", { id: loadingToast });
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-4 border w-full max-w-2xl mx-auto">
      <h1 className="font-semibold flex justify-start gap-2 mb-5  items-center ">
        <FiUpload />
        Import Data
      </h1>

      <label className="block mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
        />
      </label>

      {jsonData.length > 0 && (
        <div className="space-y-4 mt-6">
          <div className="bg-gray-100 rounded-md p-4 max-h-72 overflow-auto text-sm font-mono text-gray-800 border border-gray-300">
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          </div>

          <button
            onClick={handleSendToApi}
            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200"
          >
            Send to API
          </button>
        </div>
      )}
    </div>
  );
}
