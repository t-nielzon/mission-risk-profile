import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mission Risk Profile Planner",
  description:
    "T-41 Operational Risk Management System - Philippine Air Force Flying School",
  keywords: [
    "mission risk",
    "aviation safety",
    "risk management",
    "Philippine Air Force",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
