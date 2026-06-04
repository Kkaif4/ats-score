import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read our privacy policy to understand how we process, store, and safeguard your resume data and security assets.",
  alternates: {
    canonical: "https://ats-score-gamma.vercel.app/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-20 flex flex-col gap-8">
      {/* Navigation */}
      <nav className="w-full">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to ATS Scorer
        </Link>
      </nav>

      {/* Header */}
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Privacy <span className="text-gradient">Policy</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Last Updated: June 4, 2026. Your privacy and the confidentiality of your career documentation is our highest priority.
        </p>
      </header>

      {/* Content Container */}
      <main className="w-full space-y-8 text-sm sm:text-base text-gray-300 leading-relaxed">
        <article className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-800/80 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">1. Data We Process</h2>
            <p>
              We process the files (resumes, CVs, and text documents) and job descriptions you upload solely to generate your ATS analysis report. Document parsing is performed in-memory, and only the structured scoring report is persisted in our database to facilitate the public share link functionality. We do not sell or share your document contents with third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">2. Rate Limiting & Captchas</h2>
            <p>
              To maintain system performance and verify anonymous traffic, we run rate limits (3 requests per 5 hours) and CloudFree Turnstile bot-detection captchas. We check your IP address and security identifiers strictly to protect developer system APIs against abuse.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">3. Public Report Sharing</h2>
            <p>
              When you generate a shared report link, a view-only dashboard becomes publicly accessible under a unique hash ID. This view contains no personal identifiers (such as raw email or phone details) and exposes only the parsed scores and skill gap insights. You can request deletion of a report at any time by contacting us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">4. Analytics & Cookies</h2>
            <p>
              We use Google Analytics to monitor application usage metrics. This service uses anonymous cookies to track site sessions, click traffic, and device characteristics to optimize user interface performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">5. Contact Info</h2>
            <p>
              If you have any questions or would like to request manual deletion of a shared document, please open an issue or contact our development team through the project source repository.
            </p>
          </section>
        </article>
      </main>

      {/* Semantic Footer */}
      <footer className="w-full py-8 mt-8 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} ATS Resume Scorer. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link href="/guide" className="hover:text-gray-300 transition-colors">
            Guide & FAQ
          </Link>
          <Link href="/terms" className="hover:text-gray-300 transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
