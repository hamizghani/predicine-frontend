import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useProductRefresh } from "@/context/ProductRefreshContext";

// Mock list of medicines (replace with API call or prop later)
const medicines = [
  {
    id: 1,
    name: "Paracetamol",
    price: 5000,
    image: "/placeholder.png",
    description: "Pain reliever and fever reducer",
    currency: "IDR",
    category: "Analgesic",
  },
  {
    id: 2,
    name: "Amoxicillin",
    price: 7500,
    image: "/placeholder.png",
    description: "Antibiotic for infections",
    currency: "IDR",
    category: "Antibiotic",
  },
];

function getDefaultExpirationDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 6);
  return date.toISOString().split("T")[0];
}

export default function GeneralAddProductModal({
  triggerElement,
}: {
  triggerElement: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(medicines[0].id);
  const [qty, setQty] = useState<number>(1);
  const [expirationDate, setExpirationDate] = useState<string>(
    getDefaultExpirationDate()
  );
  const { refetch } = useProductRefresh();

  const selectedMedicine = medicines.find((m) => m.id === selectedId)!;

  const isValid =
    qty > 0 &&
    expirationDate !== "" &&
    new Date(expirationDate).setHours(0, 0, 0, 0) >
      new Date().setHours(0, 0, 0, 0);

  const createHandler = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/product/add`, {
        amount: qty,
        medicineId: selectedMedicine.id,
        expirationDate,
      });
      refetch();
      setOpen(false);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setQty(1);
          setExpirationDate(getDefaultExpirationDate());
          setSelectedId(medicines[0].id);
        }
      }}
    >
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!isValid && (
            <p className="text-sm text-red-500 ml-1">
              Please enter a valid quantity and future expiration date.
            </p>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="medicine" className="text-right">
              Medicine
            </Label>
            <select
              id="medicine"
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="col-span-3 border rounded px-2 py-2 text-sm"
            >
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

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
            <Button
              type="submit"
              onClick={createHandler}
              disabled={!isValid}
              className={!isValid ? "opacity-50 cursor-not-allowed" : ""}
            >
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
