"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";

// Standard Site Key for Cloudflare Turnstile (uses test key if none defined in public env)
const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

interface SectionScores {
  keywordMatch: number;
  experienceQuality: number;
  structure: number;
  skills: number;
  formatting: number;
  education: number;
  contactInfo: number;
}

interface ATSAnalysis {
  score: number;
  summary: string;
  sectionScores: SectionScores;
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export default function Home() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Document Scorer States
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [docCaptchaToken, setDocCaptchaToken] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysis | null>(
    null,
  );
  const [docError, setDocError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feedback Form States
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackCaptchaToken, setFeedbackCaptchaToken] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Widget reset refs
  const docTurnstileRef = useRef<any>(null);
  const feedbackTurnstileRef = useRef<any>(null);

  if (!isMounted) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col gap-12 justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
          </div>
          <span className="text-sm text-gray-400">
            Loading ATS Resume Scorer...
          </span>
        </div>
      </div>
    );
  }

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setDocError("");
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setDocError("Only PDF and DOCX files are allowed.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setDocError("File size exceeds 5MB limit.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Helper function to get fingerprint
  const getFingerprint = async () => {
    let visitorId = "unknown";
    try {
      const fp = await import("@fingerprintjs/fingerprintjs");
      const fpInstance = await fp.load();
      const result = await fpInstance.get();
      visitorId = result.visitorId;
    } catch (e) {
      console.error("Failed to generate fingerprint:", e);
    }

    return {
      browserFingerprint: visitorId,
      screenResolution:
        typeof window !== "undefined"
          ? `${window.screen.width}x${window.screen.height}`
          : "unknown",
      language:
        typeof navigator !== "undefined" ? navigator.language : "unknown",
      timezone:
        typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "unknown",
    };
  };

  // Submit document analysis
  const handleAnalyzeResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setDocError("Please upload a resume file first.");
      return;
    }
    if (!docCaptchaToken) {
      setDocError("Please complete the CAPTCHA verification.");
      return;
    }

    setIsProcessing(true);
    setDocError("");
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("captchaToken", docCaptchaToken);
    if (jobDescription.trim()) {
      formData.append("jobDescription", jobDescription);
    }

    const fingerprint = await getFingerprint();
    formData.append("fingerprint", JSON.stringify(fingerprint));

    try {
      const res = await fetch("/api/process-document", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process the document.");
      }

      setAnalysisResult(data.analysis);

      // Reset file and token after successful run
      setFile(null);
      setDocCaptchaToken("");
      if (docTurnstileRef.current) {
        docTurnstileRef.current.reset();
      }
    } catch (err: any) {
      setDocError(err.message || "An error occurred during analysis.");
      // Reset CAPTCHA on error to allow user to retry
      setDocCaptchaToken("");
      if (docTurnstileRef.current) {
        docTurnstileRef.current.reset();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Feedback Form
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackEmail || !feedbackMessage) {
      setFeedbackStatus({
        success: false,
        message: "Please fill out all fields.",
      });
      return;
    }
    if (!feedbackCaptchaToken) {
      setFeedbackStatus({
        success: false,
        message: "Please complete the CAPTCHA verification.",
      });
      return;
    }

    setIsSubmittingFeedback(true);
    setFeedbackStatus(null);

    // Collect client-side systemic details as fingerprint
    const fingerprint = await getFingerprint();

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: feedbackName,
          email: feedbackEmail,
          message: feedbackMessage,
          captchaToken: feedbackCaptchaToken,
          fingerprint,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      setFeedbackStatus({
        success: true,
        message: "Feedback submitted successfully! Thank you.",
      });
      showToast("Feedback Sent Successfully!");

      // Clear inputs
      setFeedbackName("");
      setFeedbackEmail("");
      setFeedbackMessage("");
      setFeedbackCaptchaToken("");
      if (feedbackTurnstileRef.current) {
        feedbackTurnstileRef.current.reset();
      }

      // Close modal after a short delay so the user sees the success checkmark
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackStatus(null);
      }, 1500);
    } catch (err: any) {
      setFeedbackStatus({
        success: false,
        message: err.message || "Failed to submit feedback.",
      });
      setFeedbackCaptchaToken("");
      if (feedbackTurnstileRef.current) {
        feedbackTurnstileRef.current.reset();
      }
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Circular gauge parameter calculation — use static constant to avoid SSR/client float mismatch
  const GAUGE_CIRCUMFERENCE = 314.159; // 2 * Math.PI * 50, pre-computed
  const getGaugeDashoffset = (score: number) =>
    GAUGE_CIRCUMFERENCE - (score / 100) * GAUGE_CIRCUMFERENCE;

  return (
    <div 
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: 'linear-gradient(rgba(8, 11, 17, 0.85), rgba(8, 11, 17, 0.95)), url(/bg-image.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-20 flex flex-col gap-8 md:gap-12 relative z-10">
      {/* Brand Header */}
      <header className="text-center flex flex-col items-center gap-3 md:gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
          AI Resume <span className="text-gradient">ATS Scorer</span>
        </h1>
        <p className="text-gray-400 max-w-xl text-sm sm:text-base md:text-lg px-2">
          Evaluate resume performance against industry-standard parser patterns.
          Upload PDF or DOCX format to receive matching metrics.
        </p>
      </header>

      {/* Main Grid Section */}
      <main className="w-full">
        {/* Left Side: Document Uploader and Scorer Results */}
        <section className="w-full max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
          <div className="glass-panel rounded-2xl p-4 sm:p-6 md:p-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload Document
            </h2>

            <form
              onSubmit={handleAnalyzeResume}
              className="flex flex-col gap-5 md:gap-6"
            >
              {/* Drag and drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center gap-3 bg-gray-800/10 ${
                  isDragOver ? "drag-over" : ""
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  className="hidden"
                />
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                {file ? (
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-blue-400 break-all px-2">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium px-2">
                      Drag & drop files here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports PDF or DOCX format up to 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Job Description (Optional) */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="jd-input"
                    className="text-sm font-semibold text-gray-300 flex items-center gap-1.5"
                  >
                    <svg
                      className="w-4 h-4 text-blue-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Job Description
                  </label>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium bg-gray-800/40 px-2 py-0.5 rounded border border-gray-800">
                    Optional
                  </span>
                </div>
                <textarea
                  id="jd-input"
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here to evaluate resume matching..."
                  className="w-full bg-gray-900/30 border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none transition-all resize-y min-h-[100px] text-white"
                />
              </div>

              {/* Document error reporting */}
              {docError && (
                <div className="bg-red-900/20 border border-red-900/40 px-4 py-3 rounded-lg text-red-400 text-sm flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>{docError}</span>
                </div>
              )}

              {/* CAPTCHA validation and submit row */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-900/20 p-3 sm:p-4 rounded-xl border border-gray-800 w-full overflow-hidden">
                <div className="min-h-[65px] w-full md:w-auto flex items-center justify-center py-1">
                  {isMounted ? (
                    <div className="w-full flex justify-center scale-90 min-[375px]:scale-95 sm:scale-100 origin-center transition-transform">
                      <Turnstile
                        ref={docTurnstileRef}
                        siteKey={TURNSTILE_SITE_KEY}
                        onSuccess={(token) => setDocCaptchaToken(token)}
                        onError={() => setDocCaptchaToken("")}
                        onExpire={() => setDocCaptchaToken("")}
                        options={{ size: "flexible" }}
                      />
                    </div>
                  ) : (
                    <div className="h-[65px] flex items-center justify-center text-gray-500 text-xs">
                      Loading verification...
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    !isMounted || isProcessing || !file || !docCaptchaToken
                  }
                  className="btn-primary px-8 py-3 rounded-xl font-bold text-white tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shrink-0 w-full md:w-auto"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white animate-spin-slow"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Analyzing Resume...
                    </span>
                  ) : (
                    "Analyze Resume"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results dashboard display */}
          {analysisResult && (
            <div className="glass-panel rounded-2xl p-4 sm:p-6 md:p-8 animate-fade-in glow-secondary">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 border-b border-gray-800 pb-4 md:pb-6 mb-4 md:mb-6">
                {/* Score gauge visual */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center shrink-0">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    {/* Background track circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="rgba(31, 41, 55, 0.5)"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* Progress indicator circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={
                        analysisResult.score >= 70
                          ? "#10b981"
                          : analysisResult.score >= 50
                            ? "#f59e0b"
                            : "#ef4444"
                      }
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={GAUGE_CIRCUMFERENCE}
                      strokeDashoffset={getGaugeDashoffset(
                        analysisResult.score,
                      )}
                      strokeLinecap="round"
                      className="progress-ring__circle transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {analysisResult.score}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      ATS Score
                    </span>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Evaluation Summary
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {analysisResult.summary}
                  </p>
                </div>
              </div>

              {/* Section Score Breakdown Bars */}
              {analysisResult.sectionScores && (
                <div className="border-b border-gray-800 pb-4 md:pb-6 mb-4 md:mb-6">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Score Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {[
                      {
                        label: "Keyword Match",
                        weight: "30%",
                        value: analysisResult.sectionScores.keywordMatch,
                      },
                      {
                        label: "Experience Quality",
                        weight: "20%",
                        value: analysisResult.sectionScores.experienceQuality,
                      },
                      {
                        label: "Resume Structure",
                        weight: "15%",
                        value: analysisResult.sectionScores.structure,
                      },
                      {
                        label: "Skills Section",
                        weight: "10%",
                        value: analysisResult.sectionScores.skills,
                      },
                      {
                        label: "Formatting",
                        weight: "10%",
                        value: analysisResult.sectionScores.formatting,
                      },
                      {
                        label: "Education",
                        weight: "10%",
                        value: analysisResult.sectionScores.education,
                      },
                      {
                        label: "Contact Info",
                        weight: "5%",
                        value: analysisResult.sectionScores.contactInfo,
                      },
                    ].map((factor) => (
                      <div key={factor.label} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {factor.label}{" "}
                            <span className="text-gray-600">
                              · {factor.weight}
                            </span>
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              factor.value >= 70
                                ? "text-emerald-400"
                                : factor.value >= 50
                                  ? "text-amber-400"
                                  : "text-red-400"
                            }`}
                          >
                            {factor.value}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                              factor.value >= 70
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                : factor.value >= 50
                                  ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                  : "bg-gradient-to-r from-red-500 to-red-400"
                            }`}
                            style={{ width: `${factor.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed match metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Identified Matching skills */}
                <div className="bg-gray-800/10 border border-gray-800 p-4 sm:p-5 rounded-xl">
                  <h4 className="text-xs sm:text-sm font-semibold text-green-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
                    Matching Keywords
                  </h4>
                  {analysisResult.matchingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {analysisResult.matchingKeywords.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-medium break-words max-w-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      No matching keywords found
                    </p>
                  )}
                </div>

                {/* Missing required keywords */}
                <div className="bg-gray-800/10 border border-gray-800 p-4 sm:p-5 rounded-xl">
                  <h4 className="text-xs sm:text-sm font-semibold text-amber-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                    Missing Skills
                  </h4>
                  {analysisResult.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {analysisResult.missingKeywords.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-medium break-words max-w-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      No critical missing keywords identified
                    </p>
                  )}
                </div>

                {/* ATS Optimization suggestions */}
                <div className="md:col-span-2 bg-gray-800/10 border border-gray-800 p-4 sm:p-5 rounded-xl">
                  <h4 className="text-xs sm:text-sm font-semibold text-blue-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                    Structural Recommendations
                  </h4>
                  {analysisResult.recommendations.length > 0 ? (
                    <ul className="space-y-2 sm:space-y-2.5">
                      {analysisResult.recommendations.map((step, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-gray-300 flex items-start gap-2 sm:gap-2.5"
                        >
                          <svg
                            className="w-4 h-4 text-blue-400 shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          <span className="break-words">{step}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Resume is perfectly formatted and optimization-ready
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Dynamic footer/feedback trigger */}
      {!showFeedback && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-800 bg-gray-900/40 hover:bg-gray-800/60 text-sm text-gray-400 hover:text-white transition-all duration-300 shadow-md cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Share Feedback or Report a Bug
          </button>
        </div>
      )}

      {/* Feedback Modal Popup */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 md:p-8 relative animate-scale-up glow-secondary border border-gray-800 bg-gray-950/95">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Feedback Form
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowFeedback(false);
                  setFeedbackStatus(null);
                }}
                className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                title="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Your systemic telemetry (IP, OS, browser) is recorded securely
              alongside your submission to mitigate spam and abuse.
            </p>

            <form
              onSubmit={handleFeedbackSubmit}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-gray-800/30 border border-gray-700 focus:border-purple-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="bg-gray-800/30 border border-gray-700 focus:border-purple-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Share your experience or report bugs..."
                  className="bg-gray-800/30 border border-gray-700 focus:border-purple-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Form submit response status */}
              {feedbackStatus && (
                <div
                  className={`px-4 py-3 rounded-lg text-sm flex items-start gap-2 ${
                    feedbackStatus.success
                      ? "bg-green-900/20 border border-green-900/40 text-green-400"
                      : "bg-red-900/20 border border-red-900/40 text-red-400"
                  }`}
                >
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {feedbackStatus.success ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    )}
                  </svg>
                  <span>{feedbackStatus.message}</span>
                </div>
              )}

              {/* Turnstile widget for Feedback */}
              <div className="flex justify-center border border-gray-800 bg-gray-900/20 p-2 sm:p-3 rounded-lg min-h-[65px] items-center overflow-hidden">
                {isMounted ? (
                  <div className="w-full flex justify-center scale-90 min-[375px]:scale-95 sm:scale-100 origin-center transition-transform">
                    <Turnstile
                      ref={feedbackTurnstileRef}
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={(token) => setFeedbackCaptchaToken(token)}
                      onError={() => setFeedbackCaptchaToken("")}
                      onExpire={() => setFeedbackCaptchaToken("")}
                      options={{ size: "flexible" }}
                    />
                  </div>
                ) : (
                  <div className="h-[65px] flex items-center justify-center text-gray-500 text-xs">
                    Loading verification...
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  !isMounted || isSubmittingFeedback || !feedbackCaptchaToken
                }
                className="btn-primary px-6 py-2.5 rounded-lg font-semibold text-white tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {isSubmittingFeedback ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center gap-6 max-w-sm text-center p-6 animate-scale-up">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 animate-spin"></div>
              <div className="absolute inset-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-400 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Analyzing Resume
              </h3>
              <p className="text-sm text-gray-400">
                Gemini is extracting resume content, checking keywords, matching
                with job requirements, and calculating score...
              </p>
            </div>
            <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-loading-bar absolute inset-y-0 left-0 w-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-down bg-green-500/10 border border-green-500/30 backdrop-blur-md px-6 py-3 rounded-full text-green-400 text-sm font-semibold shadow-2xl flex items-center gap-2">
          <svg
            className="w-4.5 h-4.5 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Semantic Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-8 mt-12 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>
          © {new Date().getFullYear()} ATS Resume Scorer. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/guide" className="hover:text-gray-300 transition-colors">
            Guide & FAQ
          </Link>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Terms of Service
          </a>
        </div>
      </footer>

      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                name: "ATS Resume Scorer",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Any",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                description:
                  "A free AI-powered tool to calculate your ATS resume score, identify missing keywords, and optimize your resume for Applicant Tracking Systems.",
                url: "https://ats-score-gamma.vercel.app/",
              },
            ],
          }),
        }}
      />
    </div>
    </div>
  );
}
