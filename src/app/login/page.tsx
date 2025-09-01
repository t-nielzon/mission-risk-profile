"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Lock, User, ChevronRight, Plane } from "lucide-react";

const CREDENTIALS = {
  username: "wildcats",
  password: "p!lotTrainingSqdn101",
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate loading delay with smooth animation
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (
      username === CREDENTIALS.username &&
      password === CREDENTIALS.password
    ) {
      localStorage.setItem("mrp_authenticated", "true");
      router.push("/questionnaire");
    } else {
      setError("Invalid credentials. Please check your username and password.");
    }

    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/home_background.jpeg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-900/80 z-0"></div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl relative z-20">
        <CardHeader className="text-center pb-8 pt-8">
          {/* Logo and branding */}
          <div className="mx-auto mb-6 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Mission Risk Profile
            </h1>
            <p className="text-blue-100/80 font-medium">
              Operational Risk Management System
            </p>
            <div className="text-sm text-blue-200/60 space-y-1">
              <p>Philippine Air Force Flying School</p>
              <p className="font-mono text-xs">101st Pilot Training Squadron</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-white/90 font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-blue-400 transition-all duration-300 pl-4 h-12"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-white/90 font-medium flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-blue-400 transition-all duration-300 pl-4 h-12"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-100 text-sm p-4 rounded-lg backdrop-blur-sm animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  {error}
                </div>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg disabled:opacity-50 disabled:transform-none group"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Access Risk Planner</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              )}
            </Button>
          </form>

          {/* Security notice */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs text-blue-200/60">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Secure connection • Authorized personnel only</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
