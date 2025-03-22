"use client"; // Mark this as a client component
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Get the current route

  const isLoginPage = pathname === "/login"; // Check if it's the login page

  return (
    <>
      {!isLoginPage ? (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1 w-[90%] mt-20 sm:mt-0 sm:ml-16">
            <Navbar />
            <main className="p-4 flex-1">{children}</main>
          </div>
        </div>
      ) : (
        <main className="min-h-screen">{children}</main>
      )}
    </>
  );
};

export default LayoutWrapper;
