"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.authenticated) router.push("/");
  }, [auth.authenticated]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/login`,
      method: "POST",
      data: {
        username,
        password,
      },
    })
      .then((resp) => {
        setAuth({ accessToken: resp.data.accessToken, authenticated: true });
        localStorage.setItem("accessToken", resp.data.accessToken);
        toast.success("Logged in successfully!");
      })
      .catch((error) => {
        toast.error("Login failed");
        setError(error); // optional, for inline rendering
      });
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
            Welcome to{" "}
            <span className="bg-clip-text font-semibold text-transparent bg-gradient-to-r from-[#6B6EAC] via-[#787CC6] to-[#898CDC] ">
              Predicine
            </span>
          </h1>
          <p className="text-gray-500 font-medium text-xs sm:text-sm text-center mt-1 sm:mt-2">
            Please enter your details
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4 w-full px-4 sm:px-8 flex flex-col items-center"
        >
          {error && <p className="text-red-500">{error}</p>}

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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-[#898CDC] py-3 sm:py-4 font-medium text-gray-700 text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-fit px-16 sm:px-24 bg-[#2A2E60] text-white py-2 sm:py-3 rounded-3xl hover:bg-[#2a2d609b] cursor-pointer transition duration-200 mt-4 sm:mt-6 text-sm sm:text-base"
          >
            Log in
          </button>

          <Link
            href="/signup"
            className="text-center text-gray-500 cursor-pointer text-xs sm:text-sm hover:underline w-full"
          >
            Don`t have an account?{" "}
            <span className="text-[#6B6EAC] underline">Sign up</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
