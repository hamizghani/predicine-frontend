"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";

export default function ChangePasswordModal({
  triggerElement,
}: {
  triggerElement: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = newPass.length >= 8 && newPass === confirmPass;

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/changePassword`,
        {
          password: currentPass,
          newPassword: newPass,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success("Password changed successfully!");
        setOpen(false);
      } else {
        toast.error("Failed to change password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Incorrect current password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="password"
            placeholder="Current Password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          {!valid && (
            <p className="text-sm text-red-500">
              Passwords must match and be at least 8 characters
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleChangePassword}
            disabled={!valid || loading}
            className="bg-[#2A2E60] text-white"
          >
            {loading ? "Saving..." : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
