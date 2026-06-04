"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SectionScores {
  keywordMatch: number;
  experienceQuality: number;
  structure: number;
  skills: number;
  formatting: number;
  education: number;
  contactInfo: number;
}

interface ReportData {
  atsScore: number;
  fileMeta: {
    originalName: string;
    mimeType: string;
    sizeInBytes: number;
    fileBase64: string;
  };
  insights: {
    summary: string;
    missingKeywords: string[];
    matchingKeywords: string[];
    recommendations: string[];
    sectionScores?: SectionScores;
  };
  createdAt: string;
}

interface ReportClientViewProps {
  report: ReportData;
}

export default function ReportClientView({ report }: ReportClientViewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"pdf" | "docx" | null>(null);
  const [previewError, setPreviewError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const GAUGE_CIRCUMFERENCE = 314.159;
  const getGaugeDashoffset = (score: number) => {
    return GAUGE_CIRCUMFERENCE - (score / 100) * GAUGE_CIRCUMFERENCE;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    if (!report?.fileMeta?.fileBase64) {
      setPreviewError("No document data found for preview.");
      return;
    }

    try {
      const mime = report.fileMeta.mimeType;
      const base64Data = report.fileMeta.fileBase64;

      // Decode base64 to binary array
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      if (mime === "application/pdf") {
        setPreviewType("pdf");
        const blob = new Blob([bytes], { type: mime });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } else if (
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        mime === "application/msword"
      ) {
        setPreviewType("docx");
        import("mammoth")
          .then((mammoth) => {
            mammoth
              .convertToHtml({ arrayBuffer: bytes.buffer })
              .then((result) => {
                setDocxHtml(result.value);
              })
              .catch((err) => {
                console.error("Mammoth conversion error:", err);
                setPreviewError("Failed to convert DOCX to preview format.");
              });
          })
          .catch((err) => {
            console.error("Mammoth loading error:", err);
            setPreviewError("Mammoth preview renderer unavailable.");
          });
      } else {
        setPreviewError("Unsupported file preview format.");
      }
    } catch (err) {
      console.error("Failed to construct resume preview:", err);
      setPreviewError("An error occurred loading the document preview.");
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [report]);

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage:
          "linear-gradient(rgba(8, 11, 17, 0.9), rgba(8, 11, 17, 0.97)), url(/bg-image.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex-1 w-full mx-auto px-4 py-8 sm:py-12 md:py-20 flex flex-col gap-8 md:gap-12 relative z-10 max-w-full px-6 lg:px-10">
        {/* Brand Header */}
        <header className="flex flex-col items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-900/40 hover:bg-gray-900/70 text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 transition-all text-xs font-semibold mb-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Scan Your Resume
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center">
            AI Resume <span className="text-gradient">ATS Report</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-xs sm:text-sm text-center">
            This is a read-only shared report for{" "}
            <span className="text-blue-400 font-semibold">
              {report.fileMeta.originalName}
            </span>
            .
          </p>
        </header>

        {/* Main Grid Section */}
        <main className="w-full">
          <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-[3fr_3fr] gap-6 md:gap-8 items-start">
            {/* Left Side: Score Results */}
            <section className="w-full flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
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
                          report.atsScore >= 70
                            ? "#10b981"
                            : report.atsScore >= 50
                              ? "#f59e0b"
                              : "#ef4444"
                        }
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={GAUGE_CIRCUMFERENCE}
                        strokeDashoffset={getGaugeDashoffset(report.atsScore)}
                        strokeLinecap="round"
                        className="progress-ring__circle transition-all duration-500 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        {report.atsScore}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        ATS Score
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        Evaluation Summary
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(window.location.href)
                            .then(() =>
                              showToast("Copied report link to clipboard!"),
                            )
                            .catch(() => showToast("Failed to copy link."));
                        }}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 border border-indigo-400/20 hover:border-indigo-400/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer relative overflow-hidden group animate-pulse-ring shrink-0"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine pointer-events-none" />
                        <svg
                          className="w-4 h-4 relative z-10 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 10.742l4.882-2.441m0 0A5.998 5.998 0 1121.8 12a5.998 5.998 0 01-8.234 5.258m4.882-2.441l-4.882-2.441m-4.882 2.44M10.8 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="relative z-10">Copy Report Link</span>
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      {report.insights.summary}
                    </p>
                  </div>
                </div>

                {/* Section Score Breakdown Bars */}
                {report.insights.sectionScores && (
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
                          value: report.insights.sectionScores.keywordMatch,
                        },
                        {
                          label: "Experience Quality",
                          weight: "20%",
                          value:
                            report.insights.sectionScores.experienceQuality,
                        },
                        {
                          label: "Resume Structure",
                          weight: "15%",
                          value: report.insights.sectionScores.structure,
                        },
                        {
                          label: "Skills Section",
                          weight: "10%",
                          value: report.insights.sectionScores.skills,
                        },
                        {
                          label: "Formatting",
                          weight: "10%",
                          value: report.insights.sectionScores.formatting,
                        },
                        {
                          label: "Education",
                          weight: "10%",
                          value: report.insights.sectionScores.education,
                        },
                        {
                          label: "Contact Info",
                          weight: "5%",
                          value: report.insights.sectionScores.contactInfo,
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
                    {report.insights.matchingKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {report.insights.matchingKeywords.map((tag, idx) => (
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
                    {report.insights.missingKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {report.insights.missingKeywords.map((tag, idx) => (
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
                    {report.insights.recommendations.length > 0 ? (
                      <ul className="space-y-2 sm:space-y-2.5">
                        {report.insights.recommendations.map((step, idx) => (
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
            </section>

            {/* Right Column: Sticky Resume Preview */}
            <aside
              className="hidden lg:block w-full order-2 lg:sticky lg:top-6"
              style={{ alignSelf: "start" }}
            >
              <div className="glass-panel rounded-2xl p-4 sm:p-5 animate-fade-in overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white">
                    <svg
                      className="w-5 h-5 text-cyan-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Resume Preview
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-gray-800/60 px-2.5 py-1 rounded-md border border-gray-700 truncate max-w-[200px]">
                      {report.fileMeta.originalName}
                    </span>
                    <span className="text-[10px] text-gray-500 bg-gray-800/40 px-2 py-0.5 rounded border border-gray-800">
                      {(report.fileMeta.sizeInBytes / 1024 / 1024).toFixed(2)}{" "}
                      MB
                    </span>
                  </div>
                </div>

                {previewError ? (
                  <div className="flex items-center justify-center p-8 bg-red-950/20 border border-red-900/30 rounded-lg text-red-400 text-xs">
                    {previewError}
                  </div>
                ) : previewType === "pdf" && previewUrl ? (
                  <iframe
                    src={previewUrl}
                    className="w-full rounded-lg border border-gray-700 bg-white"
                    style={{
                      height: "calc(100vh - 10rem)",
                      overflow: "hidden",
                    }}
                    title="Resume PDF Preview"
                  />
                ) : previewType === "docx" && docxHtml ? (
                  <div
                    className="w-full rounded-lg border border-gray-700 bg-white p-6 overflow-y-auto overflow-x-hidden text-gray-900 prose prose-sm max-w-none break-words"
                    style={{ maxHeight: "calc(100vh - 10rem)" }}
                    dangerouslySetInnerHTML={{ __html: docxHtml }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="relative w-8 h-8">
                      <div className="absolute inset-0 rounded-full border-2 border-blue-500/20"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-t-blue-500 animate-spin"></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      Preparing preview...
                    </span>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up-fade">
          <div className="bg-gray-900 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
