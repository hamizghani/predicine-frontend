"use client"; // Mark this as a client component
import { usePathname, useRouter } from "next/navigation";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter(); // Router for navigation

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
