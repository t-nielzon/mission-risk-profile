"use client";

import React from "react";
import { getCategoryDisplayName } from "@/data/questions";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  currentCategory?: string;
  completedSteps: Set<number>;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  currentCategory,
  completedSteps,
}: ProgressBarProps) {
  const progress = (completedSteps.size / totalSteps) * 100;
  const currentProgress = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-xl border-b border-blue-800/50 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">
              Mission Risk Profile Assessment
            </h2>
            {currentCategory && (
              <span className="text-sm text-blue-100 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 font-medium">
                {getCategoryDisplayName(currentCategory)}
              </span>
            )}
          </div>
          <div className="text-sm text-blue-200 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
            Step {Math.min(currentStep, totalSteps)} of {totalSteps}
          </div>
        </div>

        <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3 relative overflow-hidden border border-white/30">
          {/* Completed progress */}
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
          {/* Current step indicator */}
          <div
            className="absolute top-0 left-0 bg-gradient-to-r from-blue-400 to-cyan-500 h-full w-2 rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ left: `${Math.min(currentProgress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-blue-200 mt-2">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            {completedSteps.size} completed
          </span>
          <span className="flex items-center gap-2">
            {Math.max(0, totalSteps - completedSteps.size)} remaining
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </span>
        </div>
      </div>
    </div>
  );
}
