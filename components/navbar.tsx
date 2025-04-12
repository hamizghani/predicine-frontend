"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, CircleUserRound } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("User"); // Default fallback

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/self`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserName(res.data.user.username);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUser();
  }, []);

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/all-product":
        return "All Products";
      case "/analytics":
        return "Analytics";
      case "/notification":
        return "Notifications";
      case "/profile-data":
        return "Profile Data";
      case "/settings":
        return "Settings";
      default:
        return "Page";
    }
  };

  return (
    <div className="hidden sm:flex items-center justify-between px-4 py-3 bg-[#FAFAFA] shadow-sm">
      {/* Left: Back Button and Title */}
      <div className="flex items-center space-x-2 text-[#383E49]">
        {pathname !== "/" && (
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[#383E49]" />
          </button>
        )}
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      {/* Right: User Info */}
      <div
        onClick={() => router.push("/profile-data")}
        className="flex items-center space-x-2 text-[#383E49] hover:underline cursor-pointer hover:opacity-85"
      >
        <span className="text-sm font-medium">{userName}</span>
        <CircleUserRound className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Navbar;
