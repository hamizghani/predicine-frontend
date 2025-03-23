"use client"; // Mark this as a client component
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Settings, ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";

const notifications = [
  { id: 1, message: "🔔 New product added!" },
  { id: 2, message: "📢 Metformin stock is almost out. Don't forget to restock!" },
  { id: 3, message: "📦 Inventory update completed." },
];

const Navbar = () => {
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter(); // Router for navigation
  const [isOpen, setIsOpen] = useState(false); // State to control dropdown

  // Map pathnames to their respective titles
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
        return "Page"; // Default title for unknown paths
    }
  };

  return (
    <div className="hidden sm:flex items-center justify-between px-4 py-3 bg-[#FAFAFA] shadow-sm">
      {/* Left Section: Back Button and Dynamic Page Title */}
      <div className="flex items-center space-x-2 text-[#383E49]">
        {/* Back Button: Show only if not on the home page */}
        {pathname !== "/" && (
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#383E49]" />
          </button>
        )}
        {/* Dynamic Page Title */}
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      {/* Right Section: Search Bar and Settings Button */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-48 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-[#383E49] focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>

        {/* Notification Button */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Bell className="w-5 h-5 text-[#383E49]" />
          </button>

          {/* Notification Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3 border border-gray-200 z-50">
              <p className="text-sm font-semibold text-gray-700">Notifications</p>
              <div className="mt-2 space-y-2">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-2 bg-gray-100 rounded-md">
                    {notification.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        


        {/* Settings Button */}
        <Link
          href="/settings"
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Settings className="w-5 h-5 text-[#383E49]" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
