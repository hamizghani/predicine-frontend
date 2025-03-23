"use client"; // Mark this as a client component
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  LayoutDashboard,
  Package,
  BarChart3,
  User,
  Search,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Search bar state
  const pathname = usePathname(); // Get the current pathname

  //   // Load `isOpen` from local storage when the component mounts
  //   useEffect(() => {
  //     const savedState = localStorage.getItem("sidebar-isOpen");
  //     if (savedState !== null) {
  //       setIsOpen(JSON.parse(savedState));
  //     }
  //   }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  //   // Save `isOpen` state to local storage when it changes
  //   useEffect(() => {
  //     localStorage.setItem("sidebar-isOpen", JSON.stringify(isOpen));
  //   }, [isOpen]);

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/",
    },
    {
      label: "All Product",
      icon: <Package className="w-5 h-5" />,
      path: "/all-product",
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/analytics",
    },
    {
      label: "Profile Data",
      icon: <User className="w-5 h-5" />,
      path: "/profile-data",
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="sm:hidden  fixed top-0 left-0 w-full bg-[#FAFAFA] z-50 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={25}
              height={25}
              className="w-8 h-8"
            />
            <span className="ml-3 text-lg font-semibold text-[#6B6EAC]">
              Predicine
            </span>
          </div>

          {/* Settings & Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <Link
              href="/settings"
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-700" />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="px-4 py-2 bg-gray-100">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B6EAC]"
            />
          </div>
        )}
      </div>

      {/* Sidebar for Mobile (Full Menu Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FAFAFA] text-black shadow-md pt-44">
          <nav className="mt-4 space-y-1 px-4">
            {menuItems.map((item) => (
              <MenuItem
                key={item.path}
                isOpen={true}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={pathname === item.path}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu after clicking
              />
            ))}
          </nav>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <div
        className={`hidden sm:flex fixed top-0 left-0 ${
          isOpen ? "w-64" : "w-16"
        } flex-col h-screen bg-white z-50 text-black transition-all duration-300 shadow-md`}
      >
        <div className="flex items-center justify-start px-4 py-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <div className="flex items-center justify-center px-4 py-4">
          <div className="flex items-center">
            <div className="w-8 h-8">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={25}
                height={25}
                className="sm:w-[30px] sm:h-[30px]"
              />
            </div>
            {isOpen && (
              <span className="ml-3 text-lg font-semibold text-[#6B6EAC]">
                Predicine
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 mt-4">
          <nav className="space-y-1">
            {menuItems.slice(0, 3).map((item) => (
              <MenuItem
                key={item.path}
                isOpen={isOpen}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={pathname === item.path}
              />
            ))}
          </nav>
          <Separator className="my-4 bg-gray-200" />
          <div>
            {isOpen && (
              <h3 className="px-4 text-sm font-medium text-gray-500 uppercase">
                Profile
              </h3>
            )}
            <MenuItem
              isOpen={isOpen}
              icon={<User className="w-5 h-5" />}
              label="Profile Data"
              path="/profile-data"
              active={pathname === "/profile-data"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const MenuItem = ({
  isOpen,
  icon,
  label,
  path,
  active,
  onClick,
}: {
  isOpen: boolean;
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  onClick?: () => void;
}) => {
  return (
    <Link href={path}>
      <div
        onClick={onClick} // Close menu on click (for mobile)
        className={`flex items-center ${
          isOpen ? "mx-4 my-2" : "mx-3 my-2"
        } py-2 rounded-md cursor-pointer ${
          isOpen ? "px-4" : "px-2 justify-center"
        } ${
          active
            ? "bg-gray-100 text-[#6B6EAC] shadow-inner"
            : "text-gray-600 hover:bg-gray-100 hover:text-black"
        } transition-all`}
      >
        {icon}
        {isOpen && <span className="ml-3 font-medium">{label}</span>}
      </div>
    </Link>
  );
};

export default Sidebar;
