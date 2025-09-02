"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MRPFormData, MRPResults } from "@/types";

import {
  getRiskLevelColor,
  getRiskLevelText,
  getMDAColor,
  getRiskLevelFromScore,
  getRiskLevelColorFromScore,
} from "@/lib/calculations";
import { questions } from "@/data/questions";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Mail,
  Shield,
  Users,
  Settings,
  BarChart3,
  Target,
  Award,
  FileText,
  Send,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

interface SummaryCardProps {
  formData: MRPFormData;
  results: MRPResults;
  onCommentsChange: (comments: string) => void;
  onBack: () => void;
  locked: boolean;
  onLock: () => void;
}

export function SummaryCard({
  formData,
  results,
  onCommentsChange,
  onBack,
  locked,
  onLock,
}: SummaryCardProps) {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [picEmail, setPicEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showDetailedAnswers, setShowDetailedAnswers] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [hasNotifiedP2lt, setHasNotifiedP2lt] = useState(false);
  const [isEmailApiLoading, setIsEmailApiLoading] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, results }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `MRP_${formData.missionDetails.callsign}_${
          new Date().toISOString().split("T")[0]
        }.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendEmail = async () => {
    if (!picEmail && !userEmail) return;

    setIsSendingEmail(true);
    setIsEmailApiLoading(true);
    try {
      const emails = [picEmail, userEmail].filter(Boolean);

      // send email with Word document attachment via API
      const response = await fetch("/api/send-email-with-attachment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, results, emails }),
      });

      if (response.ok) {
        setShowEmailForm(false);
        setPicEmail("");
        setUserEmail("");
        router.push("/email-sent");
      } else {
        console.error("Email failed:", await response.text());
      }
    } catch (error) {
      console.error("Email failed:", error);
    } finally {
      setIsSendingEmail(false);
      setIsEmailApiLoading(false);
    }
  };

  const handleConfirmLock = async () => {
    // send one-time email with attachment to p2lt on confirm, then lock
    if (!hasNotifiedP2lt) {
      setIsEmailApiLoading(true);
      try {
        const response = await fetch("/api/send-email-with-attachment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formData,
            results,
            emails: ["p2ltbalangue@gmail.com"],
          }),
        });
        if (response.ok) {
          setHasNotifiedP2lt(true);
        }
      } catch (err) {
        console.error("p2lt notify on lock failed:", err);
      } finally {
        setIsEmailApiLoading(false);
      }
    }
    onLock();
    setShowLockModal(false);
  };

  const getRiskIcon = (level: number) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mission":
        return <Shield className="w-5 h-5" />;
      case "environment":
        return <AlertTriangle className="w-5 h-5" />;
      case "human_factor":
        return <Users className="w-5 h-5" />;
      case "aircraft":
        return <Settings className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "mission":
        return "Mission";
      case "environment":
        return "Environment";
      case "human_factor":
        return "Human Factor";
      case "aircraft":
        return "Aircraft";
      default:
        return category;
    }
  };

  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, typeof questions>);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Award className="w-6 h-6" />
          <span className="font-semibold text-lg">Assessment Complete</span>
        </div>
        <p className="text-gray-600 text-lg">Review and export MRP</p>
      </div>

      {/* pre-confirmation actions */}
      {!locked && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-5 rounded-xl flex items-center justify-between">
          <div>
            <div className="font-semibold">Please confirm your answers</div>
            <div className="text-sm opacity-80">
              You can go back to adjust anything before locking.
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-2 border-gray-300"
            >
              Go back to Questions
            </Button>
            <Button
              onClick={() => setShowLockModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
            >
              Everything looks correct
            </Button>
          </div>
        </div>
      )}

      {/* lock confirmation modal */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-200 ease-out"
            onClick={() => setShowLockModal(false)}
          ></div>
          <div className="relative z-10 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 transform transition-all duration-200 ease-out">
            <div className="text-center space-y-3">
              <div className="text-xl font-bold text-gray-900">
                Confirm submission
              </div>
              <p className="text-gray-600 text-sm">
                Once confirmed, you cannot change answers anymore.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLockModal(false)}
                  disabled={isEmailApiLoading}
                  className="border-2 border-gray-300 hover:border-gray-400 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmLock}
                  disabled={isEmailApiLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isEmailApiLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Confirming…</span>
                    </div>
                  ) : (
                    <span>Confirm and Continue</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Messages */}
      {exportSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Document exported successfully!</span>
        </div>
      )}

      {/* Mission Summary Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Target className="w-7 h-7" />
            Mission Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">Callsign</Label>
              <p className="text-lg font-bold text-gray-800">
                {formData.missionDetails.callsign}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">Aircraft</Label>
              <p className="text-lg font-bold text-gray-800">
                {formData.missionDetails.ac_nr}
              </p>
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-gray-600 font-medium">
                Pilot-in-Command
              </Label>
              <p className="text-lg font-semibold text-gray-700">
                {formData.missionDetails.pic_name}
              </p>
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-gray-600 font-medium">Co-Pilot</Label>
              <p className="text-lg font-semibold text-gray-700">
                {formData.missionDetails.cp_name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment Results */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* PIC Results */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-bold">PIC</span>
              </div>
              Pilot-in-Command
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border-2 border-blue-200">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <span className="text-3xl font-bold text-gray-800">
                    {results.scores.pic}
                  </span>
                  <span className="text-lg text-gray-600">points</span>
                </div>
              </div>
              <div className="text-center space-y-4">
                <div
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-white shadow-lg ${getMDAColor(
                    results.mda.pic
                  )}`}
                >
                  <Award className="w-5 h-5" />
                  <span>MDA: {results.mda.pic}</span>
                </div>
                <div className="flex justify-center">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getRiskLevelColorFromScore(
                      results.scores.pic
                    )}`}
                  >
                    <span>{getRiskLevelFromScore(results.scores.pic)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CP Results */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-bold">CP</span>
              </div>
              Co-Pilot
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border-2 border-green-200">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                  <span className="text-3xl font-bold text-gray-800">
                    {results.scores.cp}
                  </span>
                  <span className="text-lg text-gray-600">points</span>
                </div>
              </div>
              <div className="text-center space-y-4">
                <div
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-white shadow-lg ${getMDAColor(
                    results.mda.cp
                  )}`}
                >
                  <Award className="w-5 h-5" />
                  <span>MDA: {results.mda.cp}</span>
                </div>
                <div className="flex justify-center">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getRiskLevelColorFromScore(
                      results.scores.cp
                    )}`}
                  >
                    <span>{getRiskLevelFromScore(results.scores.cp)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Answers Section */}
      <Card className="bg-white shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Assessment Details
            </CardTitle>
            <Button
              variant="ghost"
              onClick={() => setShowDetailedAnswers(!showDetailedAnswers)}
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              {showDetailedAnswers ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
              {showDetailedAnswers ? "Hide Details" : "Show Details"}
            </Button>
          </div>
        </CardHeader>
        {showDetailedAnswers && (
          <CardContent className="p-8">
            <div className="space-y-8">
              {Object.entries(groupedQuestions).map(
                ([category, categoryQuestions]) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      {getCategoryIcon(category)}
                      <h3 className="text-lg font-bold text-gray-800">
                        {getCategoryDisplayName(category)}
                      </h3>
                    </div>
                    <div className="grid gap-4">
                      {categoryQuestions.map((question) => {
                        const answer = formData.answers[question.id];
                        if (!answer || answer.skipped) return null;

                        return (
                          <div
                            key={question.id}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <h4 className="font-semibold text-gray-800 mb-3">
                              {question.question}
                            </h4>
                            <div className="space-y-2">
                              {question.type === "individual" && (
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-blue-700">
                                      PIC:
                                    </span>
                                    <div
                                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(
                                        answer.picAnswer || 0
                                      )}`}
                                    >
                                      {getRiskIcon(answer.picAnswer || 0)}
                                      {getRiskLevelText(answer.picAnswer || 0)}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-green-700">
                                      CP:
                                    </span>
                                    <div
                                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(
                                        answer.cpAnswer || 0
                                      )}`}
                                    >
                                      {getRiskIcon(answer.cpAnswer || 0)}
                                      {getRiskLevelText(answer.cpAnswer || 0)}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {(question.type === "shared" ||
                                question.type === "custom") && (
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-purple-700">
                                    Shared:
                                  </span>
                                  <div
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(
                                      answer.sharedAnswer || 0
                                    )}`}
                                  >
                                    {getRiskIcon(answer.sharedAnswer || 0)}
                                    {getRiskLevelText(answer.sharedAnswer || 0)}
                                  </div>
                                  {answer.customText && (
                                    <span className="text-gray-600 italic">
                                      &quot;{answer.customText}&quot;
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Comments Section */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <FileText className="w-6 h-6" />
            Additional Comments & Remarks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Textarea
            value={formData.comments || ""}
            onChange={(e) => onCommentsChange(e.target.value)}
            placeholder="Enter any additional comments, observations, or special considerations for this mission..."
            className="min-h-[120px] text-base border-2 border-orange-300 focus:border-orange-500 rounded-xl p-4"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {locked && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Back Button */}
          <Button
            onClick={onBack}
            variant="outline"
            className="h-16 border-2 border-gray-300 hover:border-gray-400 rounded-xl text-lg font-semibold flex items-center gap-3 hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Questions
          </Button>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:scale-95 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
          >
            {isExporting ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6" />
                <span>Export Document</span>
              </div>
            )}
          </Button>

          {/* Email Button */}
          <Button
            onClick={() => {
              setShowEmailForm(!showEmailForm);
              if (!showEmailForm) {
                // Auto-scroll to email form after a short delay to let it render
                setTimeout(() => {
                  const emailForm = document.getElementById("email-form");
                  if (emailForm) {
                    emailForm.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }, 100);
              }
            }}
            className="h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-95 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            {isEmailApiLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Preparing email…</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6" />
                <span>Send via Email</span>
              </div>
            )}
          </Button>
        </div>
      )}

      {/* Email Form */}
      {locked && showEmailForm && (
        <Card
          id="email-form"
          className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl"
        >
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <Send className="w-6 h-6" />
              Email Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Info Notice */}
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">
                      Email with Attachment
                    </h4>
                    <p className="text-blue-700 text-sm">
                      This sends the complete Mission Risk Profile as a Word
                      document attachment along with a summary email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-gray-700">
                    PIC Email
                  </Label>
                  <input
                    type="email"
                    value={picEmail}
                    onChange={(e) => setPicEmail(e.target.value)}
                    placeholder="Enter PIC email address"
                    className="w-full h-12 px-4 border-2 border-gray-300 focus:border-green-500 rounded-lg shadow-sm text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-gray-700">
                    Your Email
                  </Label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-12 px-4 border-2 border-gray-300 focus:border-green-500 rounded-lg shadow-sm text-base"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => setShowEmailForm(false)}
                  variant="outline"
                  className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail || (!picEmail && !userEmail)}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-95 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                >
                  {isSendingEmail ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending…</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send className="w-5 h-5" />
                      <span>Send Emails</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
