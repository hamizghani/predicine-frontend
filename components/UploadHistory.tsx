import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

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
        console.log('Parsed CSV:', results.data);
        setJsonData(results.data as ParsedRow[]);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  };

  const handleSendToApi = async () => {
    try {
      const response = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/history/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
            history: jsonData
        },
      });

      if (response.status!=200) throw new Error('Failed to send data');
      alert('Data sent successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to send data');
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {jsonData.length > 0 && (
        <>
          <pre className="bg-gray-100 p-2 text-sm overflow-auto max-h-60">{JSON.stringify(jsonData, null, 2)}</pre>
          <button
            onClick={handleSendToApi}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send to API
          </button>
        </>
      )}
    </div>
  );
};

