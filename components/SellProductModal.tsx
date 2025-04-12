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
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useProductRefresh } from "@/context/ProductRefreshContext";

export default function SellProductModal({
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

  const handleSell = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You're not logged in.");
      return;
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/sell`,
        {
          id: product.id,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product sold successfully!");
      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Failed to sell product:", error);
      toast.error("Failed to sell product.");
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
          <DialogTitle className="flex items-center gap-2 text-[#2A2E60]">
            <ShoppingCart className="w-5 h-5" />
            Sell Product
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-600">
            You&apos;re about to sell{" "}
            <span className="font-semibold text-black">{product.name}</span>.
            You currently have{" "}
            <span className="font-semibold">{currentStock}</span> in stock.{" "}
            <span className=" text-blue-900">
              This action is required to keep your statistics accurate.
            </span>
          </p>

          <p className="text-xs text-gray-600">
            *Selling will prioritize stock batches that are{" "}
            <span className="font-semibold text-black">closest to expiry</span>.
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
            <Button className="cursor-pointer" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="bg-[#2A2E60] cursor-pointer hover:bg-[#1e2149] text-white"
              onClick={handleSell}
              disabled={amount < 1 || amount > currentStock}
            >
              Confirm Sell
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
