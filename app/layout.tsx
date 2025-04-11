import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import LayoutWrapper from "@/components/LayoutWrapper"; // New client-side component
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], //Include Regular (400) and Bold (700) weights
});

export const metadata: Metadata = {
  title: "Predicine",
  description: "Predict your medicine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.ico" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {/* Delegate rendering logic to a client-side component */}
        <Toaster position="top-center" reverseOrder={false} />

        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
