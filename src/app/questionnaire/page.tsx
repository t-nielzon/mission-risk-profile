"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MRPFormData, NavigationState, QuestionAnswer } from "@/types";
import { questions } from "@/data/questions";
import { calculateMRPScores } from "@/lib/calculations";
import { MissionDetailsForm } from "@/components/forms/mission-details-form";
import { QuestionCard } from "@/components/forms/question-card";
import { SummaryCard } from "@/components/forms/summary-card";
import { ProgressSidebar } from "@/components/navigation/progress-sidebar";
import { ProgressBar } from "@/components/navigation/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0 = welcome, 1 = mission details, 2+ = questions, final = summary
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const form = useForm<MRPFormData>({
    defaultValues: {
      missionDetails: {
        callsign: "",
        pic_name: "",
        cp_name: "",
        ac_nr: "",
        lesson: "",
        area_assignment: "",
        date_time: "",
      },
      answers: {},
      customHazards: {},
      comments: "",
    },
  });

  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentStep: 0,
    totalSteps: questions.length + 2, // mission details + questions + summary
    currentCategory: "",
    completedSteps: new Set(),
    skippedSteps: new Set(),
  });

  // check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("mrp_authenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);

  const handleWelcomeNext = () => {
    setCurrentStep(1);
  };

  const handleMissionDetailsNext = () => {
    setCurrentStep(2);
    setShowSidebar(true);
    setNavigationState((prev) => ({
      ...prev,
      currentStep: 2,
      completedSteps: new Set([...prev.completedSteps, 1]),
      currentCategory: questions[0]?.category || "",
    }));
  };

  const handleQuestionAnswer = (answer: QuestionAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];

    // update form data
    form.setValue(`answers.${currentQuestion.id}`, answer);

    // handle custom hazards
    if (currentQuestion.type === "custom") {
      if (currentQuestion.placeholders.shared && answer.customText) {
        const hazardKey = currentQuestion.placeholders.shared as string;
        form.setValue(`customHazards.${hazardKey}` as any, {
          description: answer.customText,
          riskLevel: answer.sharedAnswer || 0,
        });
      }
      if (
        currentQuestion.placeholders.pic === "pic_other" &&
        answer.customText
      ) {
        form.setValue("customHazards.pic_other", {
          description: answer.customText,
          riskLevel: answer.sharedAnswer || 0,
        });
      }
      if (currentQuestion.placeholders.cp === "cp_other" && answer.customText) {
        form.setValue("customHazards.cp_other", {
          description: answer.customText,
          riskLevel: answer.sharedAnswer || 0,
        });
      }
    }

    // update navigation state
    setNavigationState((prev) => ({
      ...prev,
      completedSteps: answer.answered
        ? new Set([...prev.completedSteps, currentQuestionIndex + 2])
        : prev.completedSteps,
      skippedSteps: answer.skipped
        ? new Set([...prev.skippedSteps, currentQuestionIndex + 2])
        : new Set(
            [...prev.skippedSteps].filter(
              (step) => step !== currentQuestionIndex + 2
            )
          ),
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setNavigationState((prev) => ({
        ...prev,
        currentStep: currentQuestionIndex + 3,
        currentCategory: questions[currentQuestionIndex + 1]?.category || "",
      }));
    } else {
      // go to summary
      setCurrentStep(navigationState.totalSteps);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setNavigationState((prev) => ({
        ...prev,
        currentStep: currentQuestionIndex + 1,
        currentCategory: questions[currentQuestionIndex - 1]?.category || "",
      }));
    } else {
      // go back to mission details
      setCurrentStep(1);
      setShowSidebar(false);
    }
  };

  const handleJumpToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setCurrentStep(questionIndex + 2);
    setNavigationState((prev) => ({
      ...prev,
      currentStep: questionIndex + 2,
      currentCategory: questions[questionIndex]?.category || "",
    }));
  };

  const handleCommentsChange = (comments: string) => {
    form.setValue("comments", comments);
  };

  const handleBackToQuestions = () => {
    setCurrentStep(currentQuestionIndex + 2);
  };

  const formData = form.watch();
  const results = calculateMRPScores(formData);

  // welcome screen
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <Card className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl relative z-10">
          <CardHeader className="text-center pb-8 pt-12">
            {/* Hero section */}
            <div className="mx-auto mb-8 relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 via-cyan-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full animate-bounce delay-700"></div>
            </div>

            <div className="space-y-6">
              <div>
                <CardTitle className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-4">
                  Mission Risk Profile
                </CardTitle>
                <div className="text-2xl font-semibold text-blue-200 mb-2">
                  Planner
                </div>
                <p className="text-xl text-blue-300/80 font-medium">
                  T-41 Operational Risk Management System
                </p>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100 text-sm font-medium">
                    Philippine Air Force Flying School
                  </span>
                </div>
                <p className="text-blue-200/60 text-sm">
                  101st Pilot Training Squadron
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-12 pb-12">
            {/* Features grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Comprehensive Assessment
                </h3>
                <p className="text-blue-200/70 text-sm">
                  {questions.length} risk assessment questions across 4 critical
                  categories
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Automatic Calculations
                </h3>
                <p className="text-blue-200/70 text-sm">
                  Real-time MRP score calculation and MDA determination
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Document Generation
                </h3>
                <p className="text-blue-200/70 text-sm">
                  Generate professional Word documents with your assessment
                  results
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Email Distribution
                </h3>
                <p className="text-blue-200/70 text-sm">
                  Automatically send reports to PIC and designated personnel
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={handleWelcomeNext}
                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-600 active:scale-95 text-white font-semibold px-12 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group"
              >
                <span className="flex items-center gap-3">
                  Begin Risk Assessment
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Progress Bar - Always visible */}
      <ProgressBar
        currentStep={navigationState.currentStep}
        totalSteps={navigationState.totalSteps}
        currentCategory={navigationState.currentCategory}
        completedSteps={navigationState.completedSteps}
      />

      <div className="p-4">
        <div className="flex gap-6 max-w-7xl mx-auto">
          {/* Sidebar */}
          {currentStep >= 2 && currentStep < navigationState.totalSteps && (
            <div className="w-80 hidden lg:block">
              <ProgressSidebar
                navigationState={navigationState}
                answers={formData.answers}
                onJumpToQuestion={handleJumpToQuestion}
                currentQuestionIndex={currentQuestionIndex}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {currentStep === 1 && (
              <MissionDetailsForm
                form={form}
                onNext={handleMissionDetailsNext}
              />
            )}

            {currentStep >= 2 && currentStep < navigationState.totalSteps && (
              <QuestionCard
                question={questions[currentQuestionIndex]}
                answer={formData.answers[questions[currentQuestionIndex].id]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onAnswer={handleQuestionAnswer}
                onNext={handleNextQuestion}
                onPrevious={handlePreviousQuestion}
                // onSkip={handleQuestionAnswer}
                canGoBack={currentQuestionIndex > 0 || currentStep > 2}
              />
            )}

            {currentStep === navigationState.totalSteps && (
              <SummaryCard
                formData={formData}
                results={results}
                onCommentsChange={handleCommentsChange}
                onBack={handleBackToQuestions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
