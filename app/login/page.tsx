import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
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
        <form className="space-y-3 sm:space-y-4 w-full px-4 sm:px-8 flex flex-col items-center">
          <div className="w-full">
            <input
              type="text"
              placeholder="Username"
              className="w-full border-b-2 border-gray-500 focus:outline-none focus:border-[#898CDC] font-medium py-6 sm:py-8 text-gray-700 text-sm sm:text-base"
            />
          </div>
          <div className="w-full">
            <input
              type="password"
              placeholder="Password"
              className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-[#898CDC] py-6 sm:py-8 font-medium text-gray-700 text-sm sm:text-base"
            />
          </div>
          <div className="flex justify-between items-center mt-3 sm:mt-4 w-full">
            <Link
              href="/forgot-password"
              className="text-gray-500 cursor-pointer text-xs sm:text-sm hover:underline text-end w-full"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-fit px-16 sm:px-24 bg-[#2A2E60] text-white py-2 sm:py-3 rounded-3xl hover:bg-[#2a2d609b] cursor-pointer transition duration-200 mt-4 sm:mt-6 text-sm sm:text-base"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
