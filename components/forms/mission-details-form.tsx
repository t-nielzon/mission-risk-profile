"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MRPFormData } from "@/types";
import { Plane, Users, Calendar, MapPin, BookOpen, Target } from "lucide-react";

interface MissionDetailsFormProps {
  form: UseFormReturn<MRPFormData>;
  onNext: () => void;
}

export function MissionDetailsForm({ form, onNext }: MissionDetailsFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Target className="w-6 h-6" />
          <span className="font-semibold text-lg">Mission Details</span>
        </div>
        <p className="text-gray-600 text-lg">
          Configure your mission parameters and crew information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Mission Information Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <Plane className="w-6 h-6" />
              Mission Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <Label
                  htmlFor="callsign"
                  className="text-gray-700 font-semibold flex items-center gap-2 mb-2"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Callsign
                </Label>
                <Input
                  id="callsign"
                  {...register("missionDetails.callsign", {
                    required: "Callsign is required",
                  })}
                  placeholder="Enter callsign"
                  className="h-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm px-4"
                />
                {errors.missionDetails?.callsign && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.missionDetails.callsign.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label
                  htmlFor="ac_nr"
                  className="text-gray-700 font-semibold flex items-center gap-2 mb-2"
                >
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  Aircraft Number
                </Label>
                <Input
                  id="ac_nr"
                  {...register("missionDetails.ac_nr", {
                    required: "Aircraft number is required",
                  })}
                  placeholder="Enter aircraft tail number"
                  className="h-12 bg-white border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg shadow-sm px-4"
                />
                {errors.missionDetails?.ac_nr && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.missionDetails.ac_nr.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label
                  htmlFor="lesson"
                  className="text-gray-700 font-semibold flex items-center gap-2 mb-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Lesson Type
                </Label>
                <Input
                  id="lesson"
                  {...register("missionDetails.lesson", {
                    required: "Lesson is required",
                  })}
                  placeholder="Enter lesson type or number"
                  className="h-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm px-4"
                />
                {errors.missionDetails?.lesson && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.missionDetails.lesson.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label
                  htmlFor="area_assignment"
                  className="text-gray-700 font-semibold flex items-center gap-2 mb-2"
                >
                  <MapPin className="w-4 h-4" />
                  Area Assignment
                </Label>
                <Input
                  id="area_assignment"
                  {...register("missionDetails.area_assignment", {
                    required: "Area assignment is required",
                  })}
                  placeholder="Enter area assignment"
                  className="h-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm px-4"
                />
                {errors.missionDetails?.area_assignment && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.missionDetails.area_assignment.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crew Information Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <Users className="w-6 h-6" />
              Flight Crew
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <Label
                  htmlFor="pic_name"
                  className="text-gray-700 font-semibold flex items-center gap-2 mb-2"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">PIC</span>
                  </div>
                  Pilot-in-Command
                </Label>
                <Input
                  id="pic_name"
                  {...register("missionDetails.pic_name", {
                    required: "PIC name is required",
                  })}
                  placeholder="Enter PIC full name"
                  className="h-12 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg shadow-sm px-4"
                />
                {errors.missionDetails?.pic_name && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.missionDetails.pic_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label
                  htmlFor="cp_name"
                  className="text-gray-700 font-semibold flex items-center gap-2 mb-2"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">CP</span>
                  </div>
                  Co-Pilot
                </Label>
                <Input
                  id="cp_name"
                  {...register("missionDetails.cp_name", {
                    required: "CP name is required",
                  })}
                  placeholder="Enter CP full name"
                  className="h-12 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg shadow-sm px-4"
                />
                {errors.missionDetails?.cp_name && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.missionDetails.cp_name.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              Mission Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              <Label
                htmlFor="date_time"
                className="text-gray-700 font-semibold flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Date & Time
              </Label>
              <Input
                id="date_time"
                type="text"
                {...register("missionDetails.date_time", {
                  required: "Date and time is required",
                })}
                placeholder="e.g., 08 August 2025"
                className="h-12 bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg shadow-sm max-w-md px-4"
              />
              {errors.missionDetails?.date_time && (
                <p className="text-red-500 text-sm flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.missionDetails.date_time.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center pt-8">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-700 hover:via-cyan-700 hover:to-indigo-700 active:scale-95 text-white font-semibold px-12 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group"
          >
            <span className="flex items-center gap-3">
              Continue to Risk Assessment
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
