"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // check if user is authenticated
    const isAuthenticated = localStorage.getItem("mrp_authenticated");

    if (isAuthenticated) {
      // redirect to questionnaire if already authenticated
      router.push("/questionnaire");
    } else {
      // redirect to login if not authenticated
      router.push("/login");
    }
  }, [router]);

  return (
    <div
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/home_background.jpeg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-900/80"></div>
      <div className="text-center relative z-10">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-200 mx-auto"></div>
        <p className="text-blue-100 mt-4">
          Loading Mission Risk Profile Planner...
        </p>
      </div>
    </div>
  );
}
