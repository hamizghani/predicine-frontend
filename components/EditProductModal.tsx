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
import { PencilLine } from "lucide-react";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useProductRefresh } from "@/context/ProductRefreshContext";

export default function EditProductModal({
  product,
  triggerElement,
}: {
  product: Product;
  triggerElement: React.ReactNode;
}) {
  const [stock, setStock] = useState<number>(product.stock);
  const [price, setPrice] = useState<number>(product.price);
  const [open, setOpen] = useState(false);
  const { refetch } = useProductRefresh();

  useEffect(() => {
    setPrice(product.price);
  }, [product.price]);

  const handleEdit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/updatePrice`,
        {
          id: product.id, // from props
          price: price, // local state
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refetch();
      toast.success("Price updated!");
    } catch (err) {
      console.error("Error updating price:", err);
      toast.error("Failed to update price");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setStock(product.stock);
          setPrice(product.price);
        }
      }}
    >
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PencilLine className="w-5 h-5" />
            {product.name}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          *Please refer to each batch to edit stocks
        </p>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price (IDR)
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              min={0}
              className="col-span-3"
              onChange={(e) => setPrice(Number(e.target.value))}
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
              className="bg-[#2A2E60] cursor-pointer text-white hover:bg-[#1e2149]"
              onClick={handleEdit}
              disabled={stock < 0 || price < 0}
            >
              Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
