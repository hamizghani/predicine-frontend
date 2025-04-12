"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useProductRefresh } from "@/context/ProductRefreshContext";

export default function DeleteProductModal({
  product,
  triggerElement,
}: {
  product: Product;
  triggerElement: React.ReactNode;
}) {
  const [amount, setAmount] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const { refetch } = useProductRefresh();

  const currentStock = product.stock;

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Unauthorized.");

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            id: product.id,
            amount,
          },
        }
      );

      toast.success("Stock deleted.");
      refetch();
    } catch (error) {
      console.error("Failed to delete product stock:", error);
      toast.error("Failed to delete.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setAmount(1);
      }}
    >
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Delete Product
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-600">
            You&apos;re about to delete stock for{" "}
            <span className="font-semibold text-black">{product.name}</span>.
            You currently have{" "}
            <span className="font-semibold">{currentStock}</span> in stock.
          </p>

          <p className="text-xs text-gray-600">
            *Deletion prioritizes stock from batches{" "}
            <span className="font-semibold text-black">closest to expiry</span>.
            Prefer deleting by batch for control.
          </p>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              className="col-span-3"
              min={1}
              max={currentStock}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
              disabled={amount < 1 || amount > currentStock}
            >
              Confirm Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
