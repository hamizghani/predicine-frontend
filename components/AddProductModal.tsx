import axios from "axios";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Medicine } from "@/types/Medicine";

export default function AddProductModal({
  medicine,
  triggerElement,
}: {
  medicine: Medicine;
  triggerElement: React.ReactNode;
}) {
  const [qty, setQty] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");
  const [open, setOpen] = useState(false);

  const createHandler = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/product/add`, {
        amount: qty,
        medicineId: medicine.id,
        expirationDate,
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setQty(1);
          setExpirationDate("");
        }
      }}
    >
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {medicine.name}</DialogTitle>
          <DialogDescription>
            Specify how many items you're adding and their expiration date.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="col-span-3"
              min={1}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiration" className="text-right">
              Exp. Date
            </Label>
            <Input
              id="expiration"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={createHandler}>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
