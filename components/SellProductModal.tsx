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

export default function SellProductModal({
  product,
  triggerElement,
}: {
  product: Product;
  triggerElement: React.ReactNode;
}) {
  const [amount, setAmount] = useState<number>(1);
  const [open, setOpen] = useState(false);

  // Placeholder: replace with actual user stock lookup
  const currentStock = 10; // user.stock[product.medicineId]

  const handleSell = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/products/${product.id}/sell`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
          }),
        }
      );
    } catch (error) {
      console.error("Failed to sell product:", error);
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
            You're about to sell{" "}
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
