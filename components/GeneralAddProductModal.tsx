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

// Mock list of medicines (replace with API call or prop later)
const medicines = [
  {
    id: "med1",
    name: "Paracetamol",
    price: 5000,
    image: "/placeholder.png",
    description: "Pain reliever and fever reducer",
    currency: "IDR",
    category: "Analgesic",
  },
  {
    id: "med2",
    name: "Amoxicillin",
    price: 7500,
    image: "/placeholder.png",
    description: "Antibiotic for infections",
    currency: "IDR",
    category: "Antibiotic",
  },
];

function getRandomItem<T>(items: T[]): T | undefined {
  return items[Math.floor(Math.random() * items.length)];
}

interface PredictionResponse {
  data: {
    predicted_stockout_days: number;
  };
}

export default function GeneralAddProductModal({
  triggerElement,
}: {
  triggerElement: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(medicines[0].id);
  const [qty, setQty] = useState<number>(1);
  const [expirationDate, setExpirationDate] = useState<string>("");

  const zones = [
    "Jakarta Selatan",
    "Jakarta Timur",
    "Depok",
    "Bekasi",
    "Tangerang",
  ];
  const selectedMedicine = medicines.find((m) => m.id === selectedId)!;

  const createHandler = async () => {
    const prod = {
      ...selectedMedicine,
      stock: qty,
      sold: Math.floor(Math.random() * 200),
      expirationDate,
      prediction: {
        restockDate: new Date().toLocaleDateString(),
        availability: {
          percentage: Math.floor(Math.random() * 100),
          status: "In stock",
        },
      },
    };

    // Call your backend here
    try {
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
              medicine_name: selectedMedicine.name,
              stock: prod.stock,
              record_timestamp: new Date().toLocaleDateString(),
              avg_visitor_weekly: Math.round(200 + Math.random() * 300),
              price: prod.price,
            },
          }),
        }
      );

      const dataJson = await res.json();
      const predictedDays = (dataJson as PredictionResponse).data
        .predicted_stockout_days;

      const restockDate = new Date();
      restockDate.setDate(restockDate.getDate() + predictedDays);

      console.log("[submit]", {
        ...prod,
        prediction: {
          ...prod.prediction,
          restockDate: restockDate.toLocaleDateString(),
        },
      });

      // In the future, send to your backend
      // await fetch('/api/products', { method: 'POST', body: JSON.stringify({...}) })
    } catch (err) {
      console.error("Prediction API error:", err);
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="medicine" className="text-right">
              Medicine
            </Label>
            <select
              id="medicine"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
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
            <Button type="submit" onClick={createHandler}>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
