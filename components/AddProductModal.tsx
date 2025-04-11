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
import { useIndexedDB } from "@/hooks/useIndexedDB";
import { Medicine } from "@/types/medicine";
import { useState } from "react";
import { Product } from "@/types/product";
import { DialogClose } from "@radix-ui/react-dialog";

function getRandomItem<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

interface PredictionResponse {
  data: {
    predicted_stockout_days: number;
  };
}

export default function AddProductModal({
  medicine,
  triggerElement,
}: {
  medicine: Medicine;
  triggerElement: React.ReactNode;
}) {
  const { addItem: addProduct } = useIndexedDB<Product>("products");
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const zones = [
    "Jakarta Selatan",
    "Jakarta Timur",
    "Depok",
    "Bekasi",
    "Tangerang",
  ];
  const createHandler = async () => {
    const prod = {
      ...medicine,
      sold: Math.floor(Math.random() * 200),
      stock: qty,
      prediction: {
        restockDate: new Date().toLocaleDateString(),
        availability: {
          percentage: Math.floor(Math.random() * 100),
          status: "In stock",
        },
      },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          predictionInput: {
            user: "232321",
            user_category: getRandomItem(["Hospital", "Apotics"]),
            zone: getRandomItem(zones),
            medicine_name: medicine.name,
            stock: prod.stock,
            record_timestamp: new Date().toLocaleDateString(),
            avg_visitor_weekly: Math.round(200 + Math.random() * 300),
            price: prod.price,
          },
        }),
      }
    );
    const dataJson = await res.json();
    const predictedDays = Math.floor(
      (dataJson as PredictionResponse).data.predicted_stockout_days
    );
    const restockDate = new Date();
    restockDate.setDate(restockDate.getDate() + predictedDays);

    await addProduct({
      ...prod,
      prediction: {
        restockDate: restockDate.toLocaleDateString(), // or just `restockDate` if you expect a Date object
        availability: {
          percentage: Math.floor(Math.random() * 100),
          status: "In stock",
        },
      },
    });
  };

  // state
  const [expirationDate, setExpirationDate] = useState<string>("");

  // inside createHandler:
  const prod = {
    ...medicine,
    sold: Math.floor(Math.random() * 200),
    stock: qty,
    expirationDate, // you can adjust how/where this is used later
    prediction: {
      restockDate: new Date().toLocaleDateString(),
      availability: {
        percentage: Math.floor(Math.random() * 100),
        status: "In stock",
      },
    },
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        // When the dialog is closed, reset the quantity.
        if (!isOpen) {
          setQty(1);
        }
      }}
    >
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {medicine.name}</DialogTitle>
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
              onChange={(e) => setQty(parseInt(e.target.value))}
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
