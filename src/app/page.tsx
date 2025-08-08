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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">
          Loading Mission Risk Profile Planner...
        </p>
      </div>
    </div>
  );
}
