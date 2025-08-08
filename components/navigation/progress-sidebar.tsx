"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationState, QuestionAnswer } from "@/types";
import { questions, getCategoryDisplayName } from "@/data/questions";
import { Check, Clock, SkipForward } from "lucide-react";

interface ProgressSidebarProps {
  navigationState: NavigationState;
  answers: Record<string, QuestionAnswer>;
  onJumpToQuestion: (questionIndex: number) => void;
  currentQuestionIndex: number;
}

export function ProgressSidebar({
  navigationState,
  answers,
  onJumpToQuestion,
  currentQuestionIndex,
}: ProgressSidebarProps) {
  const getQuestionStatus = (questionIndex: number) => {
    const question = questions[questionIndex];
    const answer = answers[question.id];

    if (answer?.answered) return "completed";
    if (answer?.skipped) return "skipped";
    if (questionIndex === currentQuestionIndex) return "current";
    if (questionIndex < currentQuestionIndex) return "available";
    return "locked";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-600" />;
      case "skipped":
        return <SkipForward className="w-4 h-4 text-yellow-600" />;
      case "current":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 text-green-800";
      case "skipped":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "current":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "available":
        return "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 border-gray-200 text-gray-400";
    }
  };

  // group questions by category
  const questionsByCategory = questions.reduce((acc, question, index) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push({ question, index });
    return acc;
  }, {} as Record<string, Array<{ question: (typeof questions)[0]; index: number }>>);

  return (
    <Card className="w-80 h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Progress Overview</CardTitle>
        <div className="text-sm text-gray-600">
          {navigationState.completedSteps.size} of {navigationState.totalSteps}{" "}
          completed
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(questionsByCategory).map(
          ([category, categoryQuestions]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
                {getCategoryDisplayName(category)}
              </h4>
              <div className="space-y-1">
                {categoryQuestions.map(({ question, index }) => {
                  const status = getQuestionStatus(index);
                  const canNavigate =
                    status === "completed" ||
                    status === "skipped" ||
                    status === "available";

                  return (
                    <Button
                      key={question.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => canNavigate && onJumpToQuestion(index)}
                      disabled={!canNavigate}
                      className={`w-full justify-start text-left h-auto p-3 ${getStatusColor(
                        status
                      )}`}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="flex-shrink-0">
                          {getStatusIcon(status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium">
                            Q{index + 1}
                          </div>
                          <div className="text-xs opacity-75 truncate">
                            {question.question}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}

