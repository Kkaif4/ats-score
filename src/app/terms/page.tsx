import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read our terms of service to understand the conditions of using our anonymous resume scoring service.",
  alternates: {
    canonical: "https://ats-score-gamma.vercel.app/terms",
  },
};

export default function TermsPage() {
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
          Terms of <span className="text-gradient">Service</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Last Updated: June 4, 2026. Please read these terms carefully before accessing or using our services.
        </p>
      </header>

      {/* Content Container */}
      <main className="w-full space-y-8 text-sm sm:text-base text-gray-300 leading-relaxed">
        <article className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-800/80 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">1. Service Scope & Acceptable Use</h2>
            <p>
              ATS Resume Scorer provides an anonymous, AI-driven evaluation tool to check resume structure, keyword matching, and general ATS optimization criteria. You agree to use this service only for lawful purposes related to personal job search preparation. Automated scraping, bulk uploads, or attempting to bypass security/Turnstile validation is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">2. Rate Limits & Access Verification</h2>
            <p>
              To protect database resources, anonymous users are subject to a rate limit of 3 resume upload checks per 5-hour period. We verify unique requests using browser fingerprints and server-side IP hashes. Evading or attempting to reset these limits constitutes a violation of these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">3. Shared Report Links</h2>
            <p>
              By selecting the "Share Report" feature, you authorize the generation of a unique, public URL showing the compiled score breakdown, missing skills, and recommendations. While we actively sanitize files to prevent raw data exposure, you are responsible for review before publishing this link on third-party forums.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">4. Disclaimer of Warranties</h2>
            <p>
              This service is provided "as is" without warranties of any kind. ATS configurations and hiring filters vary dynamically by company and applicant tracking software. Our score represents a heuristic evaluation generated via Gemini AI and does not guarantee job matching, recruiter interviews, or career placement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">5. Termination & Modifications</h2>
            <p>
              We reserve the right to restrict access, delete shared reports, or modify site layouts at any time without notice. Terms of service updates are automatically posted directly to this route and become effective immediately.
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
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
