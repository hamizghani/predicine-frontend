"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { auth } = useContext(AuthContext);
  const validRegions = ["Jawa", "Kalimantan", "Sumatra", "Sulawesi", "Papua"];

  useEffect(() => {
    if (auth.authenticated) return router.push("/");
  }, [auth.authenticated]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Validation checks
    if (!username || !name || !region || !password || !confirmPassword) {
      return toast.error("Please fill out all fields.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters.");
    }

    if (!validRegions.includes(region)) {
      return toast.error(
        "Region must be one of: Jawa, Kalimantan, Sumatra, Sulawesi, or Papua."
      );
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/create`, {
        username,
        password,
        region,
        name,
      });

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || "Signup failed.";
      toast.error(message);
      console.error(error);
      setError(message);
    }
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center px-2 bg-cover bg-center text-black"
      style={{ backgroundImage: "url(/medicinebg.png)" }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-80 flex flex-col items-center max-w-md sm:w-4/5">
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={25}
            height={25}
            className="sm:w-[30px] sm:h-[30px]"
          />
          <h1 className="text-lg sm:text-2xl font-medium text-center mt-2 sm:mt-4">
            Create your{" "}
            <span className="bg-clip-text font-semibold text-transparent bg-gradient-to-r from-[#6B6EAC] via-[#787CC6] to-[#898CDC] ">
              Predicine
            </span>{" "}
            account
          </h1>
          <p className="text-gray-500 font-medium text-xs sm:text-sm text-center mt-1 sm:mt-2">
            Fill in the details to get started
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4 w-full px-4 sm:px-8 flex flex-col items-center"
        >
          {error && (
            <p className="text-red-500 text-xs sm:text-sm font-medium">
              {error}
            </p>
          )}
          <div className="w-full">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b-2 border-gray-500 focus:outline-none focus:border-[#898CDC] font-medium py-3 sm:py-4 text-gray-700 text-sm sm:text-base"
            />
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b-2 border-gray-500 focus:outline-none focus:border-[#898CDC] font-medium py-3 sm:py-4 text-gray-700 text-sm sm:text-base"
            />
          </div>
          <div className="w-full">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border-b-2 border-gray-500 focus:outline-none focus:border-[#898CDC] font-medium py-3 sm:py-4 text-gray-700 text-sm sm:text-base bg-white"
            >
              <option value="" disabled>
                Select region
              </option>
              <option value="Jawa">Jawa</option>
              <option value="Kalimantan">Kalimantan</option>
              <option value="Sumatra">Sumatra</option>
              <option value="Sulawesi">Sulawesi</option>
              <option value="Papua">Papua</option>
            </select>
          </div>

          <div className="w-full">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-[#898CDC] py-3 sm:py-4 font-medium text-gray-700 text-sm sm:text-base"
            />
          </div>
          <div className="w-full">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-[#898CDC] py-3 sm:py-4 font-medium text-gray-700 text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-fit px-16 sm:px-24 bg-[#2A2E60] text-white py-2 sm:py-3 rounded-3xl hover:bg-[#2a2d609b] cursor-pointer transition duration-200 mt-4 sm:mt-6 text-sm sm:text-base"
          >
            Sign up
          </button>

          <Link
            href="/login"
            className="text-center text-gray-500 cursor-pointer text-xs sm:text-sm hover:underline w-full"
          >
            Already have an account?{" "}
            <span className="text-[#6B6EAC] underline">Log in</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
