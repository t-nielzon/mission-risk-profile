"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuestionDefinition, QuestionAnswer, RiskLevel } from "@/types";
import { getRiskLevelColor, getRiskLevelText } from "@/lib/calculations";
import { getCategoryDisplayName } from "@/data/questions";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  SkipForward,
} from "lucide-react";

interface QuestionCardProps {
  question: QuestionDefinition;
  answer?: QuestionAnswer;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: QuestionAnswer) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoBack: boolean;
  canReturnToSummary?: boolean;
  onReturnToSummary?: () => void;
}

export function QuestionCard({
  question,
  answer,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  onPrevious,
  canGoBack,
  canReturnToSummary,
  onReturnToSummary,
}: QuestionCardProps) {
  const [picAnswer, setPicAnswer] = useState<RiskLevel | undefined>(
    answer?.picAnswer
  );
  const [cpAnswer, setCpAnswer] = useState<RiskLevel | undefined>(
    answer?.cpAnswer
  );
  const [sharedAnswer, setSharedAnswer] = useState<RiskLevel | undefined>(
    answer?.sharedAnswer
  );
  const [customText, setCustomText] = useState(answer?.customText || "");
  const [customRiskLevel, setCustomRiskLevel] = useState<RiskLevel>(
    answer?.sharedAnswer || 0
  );

  const handleSubmit = () => {
    const newAnswer: QuestionAnswer = {
      questionId: question.id,
      answered: true,
      skipped: false,
      picAnswer: question.type === "individual" ? picAnswer : undefined,
      cpAnswer: question.type === "individual" ? cpAnswer : undefined,
      sharedAnswer:
        question.type === "shared"
          ? sharedAnswer
          : question.type === "custom"
          ? customRiskLevel
          : undefined,
      customText: question.type === "custom" ? customText : undefined,
    };

    onAnswer(newAnswer);
    onNext();
  };

  const handleSkip = () => {
    const newAnswer: QuestionAnswer = {
      questionId: question.id,
      answered: false,
      skipped: true,
    };

    onAnswer(newAnswer);
    onNext();
  };

  const canSubmit = () => {
    if (question.type === "individual") {
      return picAnswer !== undefined && cpAnswer !== undefined;
    } else if (question.type === "shared") {
      return sharedAnswer !== undefined;
    } else if (question.type === "custom") {
      return true; // Allow submission even with empty description
    }
    return false;
  };

  const getOptionValue = (optionKey: "green" | "yellow" | "red"): RiskLevel => {
    switch (optionKey) {
      case "green":
        return 0;
      case "yellow":
        return 1;
      case "red":
        return 2;
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 0:
        return <CheckCircle className="w-5 h-5" />;
      case 1:
        return <AlertTriangle className="w-5 h-5" />;
      case 2:
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = () => {
    switch (question.category) {
      case "mission":
        return <Shield className="w-6 h-6" />;
      case "environment":
        return <AlertTriangle className="w-6 h-6" />;
      case "human_factor":
        return <Users className="w-6 h-6" />;
      case "aircraft":
        return <Settings className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  const getCategoryColor = () => {
    switch (question.category) {
      case "mission":
        return "from-blue-500 to-cyan-500";
      case "environment":
        return "from-green-500 to-emerald-500";
      case "human_factor":
        return "from-purple-500 to-pink-500";
      case "aircraft":
        return "from-orange-500 to-red-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  const renderOptions = (pilot?: "pic" | "cp") => {
    const currentValue =
      pilot === "pic" ? picAnswer : pilot === "cp" ? cpAnswer : sharedAnswer;
    const setValue =
      pilot === "pic"
        ? setPicAnswer
        : pilot === "cp"
        ? setCpAnswer
        : setSharedAnswer;

    return (
      <div className="space-y-4">
        {Object.entries(question.options).map(([key, text]) => {
          if (!text) return null;
          const value = getOptionValue(key as "green" | "yellow" | "red");
          const isSelected = currentValue === value;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setValue(value)}
              className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? `${getRiskLevelColor(
                      value
                    )} border-white shadow-xl scale-[1.02]`
                  : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      isSelected ? "bg-white/20" : getRiskLevelColor(value)
                    }`}
                  >
                    {getRiskIcon(value)}
                  </div>
                  <span
                    className={`font-medium ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {text}
                  </span>
                </div>
                <div
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : getRiskLevelColor(value)
                  }`}
                >
                  {getRiskLevelText(value)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="bg-white shadow-2xl border-0 overflow-hidden">
        {/* Header */}
        <CardHeader
          className={`bg-gradient-to-r ${getCategoryColor()} text-white p-8`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                {getCategoryIcon()}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {getCategoryDisplayName(question.category)}
                </CardTitle>
                <p className="text-white/80 mt-1">
                  Question {questionNumber} of {totalQuestions}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-sm font-semibold">
                  {Math.round((questionNumber / totalQuestions) * 100)}%
                  Complete
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Question */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 leading-relaxed">
                {question.question}
              </h3>
            </div>

            {/* Question Types */}
            <>
              {question.type === "individual" && (
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        PIC
                      </div>
                      <h4 className="text-xl font-bold text-gray-800">
                        Pilot-in-Command
                      </h4>
                    </div>
                    {renderOptions("pic")}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        CP
                      </div>
                      <h4 className="text-xl font-bold text-gray-800">
                        Co-Pilot
                      </h4>
                    </div>
                    {renderOptions("cp")}
                  </div>
                </div>
              )}

              {question.type === "shared" && <div>{renderOptions()}</div>}

              {question.type === "custom" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      <Settings className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">
                      Other Hazard
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-700">
                      Describe the hazard (optional):
                    </Label>
                    <Textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Enter description of the identified hazard (leave blank if N/A)..."
                      className="min-h-[120px] text-base border-2 border-gray-300 focus:border-blue-500 rounded-xl p-4"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-700">
                      Risk Level:
                    </Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[0, 1, 2].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setCustomRiskLevel(level as RiskLevel)}
                          className={`p-6 text-center rounded-xl border-2 transition-all duration-300 font-semibold ${
                            customRiskLevel === level
                              ? `${getRiskLevelColor(
                                  level as RiskLevel
                                )} border-white shadow-lg scale-105`
                              : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            {getRiskIcon(level as RiskLevel)}
                            <span>{getRiskLevelText(level as RiskLevel)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <div className="flex gap-4">
              {canGoBack && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 hover:shadow-lg transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </Button>
              )}
              {canReturnToSummary && onReturnToSummary && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onReturnToSummary}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-gray-200 hover:bg-gray-100 transition-all duration-300"
                >
                  Return to Summary
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300"
              >
                <SkipForward className="w-5 h-5" />
                Skip Question
              </Button>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:scale-95 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center gap-3"
            >
              <span>
                {questionNumber === totalQuestions
                  ? "Complete Assessment"
                  : "Next Question"}
              </span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
