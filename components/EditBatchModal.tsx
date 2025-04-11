"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useProductRefresh } from "@/context/ProductRefreshContext";

export default function EditBatchModal({
  batch,
  triggerElement,
}: {
  batch: { id: number; amount: number; expirationDate: string };
  triggerElement: React.ReactNode;
}) {
  const [amount, setAmount] = useState(batch.amount);
  const [expirationDate, setExpirationDate] = useState(
    batch.expirationDate.split("T")[0]
  );
  const [open, setOpen] = useState(false);
  const { refetch } = useProductRefresh();

  const isValid = amount > 0 && new Date(expirationDate) > new Date();

  const handleUpdate = async () => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/batch/edit`, {
        id: batch.id,
        amount,
        expirationDate,
      });
      toast.success("Batch updated successfully");
      refetch();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update batch");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Batch</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expDate" className="text-right">
              Exp. Date
            </Label>
            <Input
              id="expDate"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleUpdate}
            disabled={!isValid}
            className={!isValid ? "opacity-50 cursor-not-allowed" : ""}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
