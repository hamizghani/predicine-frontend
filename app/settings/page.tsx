"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();

  // Check if user is logged in when accessing the settings page
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Clear login state
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-80 flex flex-col items-center max-w-md sm:w-4/5">
        <h1 className="text-lg sm:text-2xl font-medium text-center mb-4">
          Settings
        </h1>
        <button
          onClick={handleLogout}
          className="w-fit px-16 sm:px-24 bg-[#2A2E60] text-white py-2 sm:py-3 rounded-3xl hover:bg-[#2a2d609b] cursor-pointer transition duration-200 text-sm sm:text-base"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
