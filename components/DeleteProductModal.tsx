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

export default function DeleteProductModal({
  product,
  triggerElement,
}: {
  product: Product;
  triggerElement: React.ReactNode;
}) {
  const [amount, setAmount] = useState<number>(1);
  const [open, setOpen] = useState(false);

  // Placeholder: available stock from user stock record
  const currentStock = 10; // Replace this with: user.stock[product.medicineId]

  const handleDelete = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
          }),
        }
      );
    } catch (error) {
      console.error("Failed to delete product amount:", error);
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
            You're about to delete stock for{" "}
            <span className="font-semibold text-black">{product.name}</span>.
            You currently have{" "}
            <span className="font-semibold">{currentStock}</span> in stock.
          </p>

          <p className="text-xs text-gray-600">
            *May note that deletion prioritize products with the{" "}
            <span className="font-semibold text-black">
              closest expiration date.
            </span>{" "}
            Consider deleting from specific batch.
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
