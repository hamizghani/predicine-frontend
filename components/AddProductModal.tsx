import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useIndexedDB } from "@/hooks/useIndexedDB"
import { Medicine } from "@/types/medicine"
import { useState } from "react"
import { Product } from "@/types/product"
import { DialogClose } from "@radix-ui/react-dialog"

export default function AddProductModal({medicine, triggerElement}: {medicine: Medicine, triggerElement: React.ReactNode}) {
  const {addItem: addProduct} = useIndexedDB<Product>('products')
  const [qty, setQty] = useState(1)
  const [open, setOpen] = useState(false)

  const createHandler = async () => {
    await addProduct({
      ...medicine,
      sold: Math.floor(Math.random()*200),
      stock: qty,
      prediction: {
        restockDate: (new Date()).toLocaleDateString(),
        availability: {
          percentage: Math.floor(Math.random()*100),
          status: "In stock"
        }
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      // When the dialog is closed, reset the quantity.
      if (!isOpen) {
        setQty(1)
      }
    }}>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={medicine.name} className="col-span-3" readOnly={true} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input id="quantity" value={qty} onChange={(e)=>setQty(parseInt(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price (IDR)
            </Label>
            <Input id="price" value={medicine.price} className="col-span-3" readOnly={true} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={createHandler}>Create</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}