import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
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

export default function DownlaodHistory({period}:{period:string}) {

    const [loading, setLoading] = useState(true);

    const [transactions, setTransactions] = useState<Transaction[]>([]);

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

        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading profile...
            </div>
        );
    }

    const handleExport = async (): Promise<void> => {
        const filtered = filterByPeriod(transactions, period);

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
        <Button
            onClick={handleExport}
            variant="outline"
            className="flex items-center cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" /> Download Report
          </Button>
    )
}