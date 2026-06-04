import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide & FAQ",
  description: "Learn how to calculate your ATS resume score, understand Applicant Tracking Systems, and optimize your resume for recruiters.",
};

export default function GuidePage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-20 flex flex-col gap-8 md:gap-12">
      {/* Navigation */}
      <nav className="w-full mb-4">
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
      <header className="text-center flex flex-col items-center gap-3 md:gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          ATS Scorer <span className="text-gradient">Guide & FAQ</span>
        </h1>
        <p className="text-gray-400 max-w-2xl text-sm sm:text-base px-2">
          Everything you need to know about Applicant Tracking Systems, how our scoring works, and how to optimize your resume to beat the bots.
        </p>
      </header>

      {/* SEO Content Sections */}
      <main className="w-full max-w-4xl mx-auto space-y-16">
        {/* Features Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Why Use Our Free ATS Resume Scorer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/10 border border-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Beat the Bots</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Over 75% of resumes are rejected by Applicant Tracking Systems before a human ever reads them. Our ATS resume checker ensures your formatting and structure are parser-friendly.
              </p>
            </div>
            <div className="bg-gray-800/10 border border-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Keyword Optimization</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Instantly calculate your ATS score against a specific job description. Identify missing hard skills and keywords that recruiters are actively filtering for.
              </p>
            </div>
            <div className="bg-gray-800/10 border border-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Leveraging Google's advanced Gemini AI, we analyze 7 critical dimensions of your resume—from action verbs to standard section headings—providing actionable feedback.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center">How to Calculate Your ATS Score</h2>
          <div className="space-y-6 md:space-y-0 md:flex md:gap-8 relative">
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-blue-500/30">1</div>
              <h3 className="text-md font-semibold text-gray-200 mb-2">Upload Resume</h3>
              <p className="text-xs text-gray-400">Upload your PDF or DOCX file. Ensure you use standard fonts and a single-column layout for the best parsing results.</p>
            </div>
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-purple-500/30">2</div>
              <h3 className="text-md font-semibold text-gray-200 mb-2">Add Job Description</h3>
              <p className="text-xs text-gray-400">Paste the target job description (optional but highly recommended) to check your keyword match rate and skills alignment.</p>
            </div>
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-emerald-500/30">3</div>
              <h3 className="text-md font-semibold text-gray-200 mb-2">Get Actionable Feedback</h3>
              <p className="text-xs text-gray-400">Receive an instant, detailed ATS score breakdown covering structure, formatting, contact info, and experience quality.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-800/10 border border-gray-800 p-5 rounded-xl group cursor-pointer">
              <summary className="font-semibold text-gray-200 flex justify-between items-center outline-none">
                What is a good ATS score?
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                A good ATS score is generally 80% or higher. Scoring in this range means your resume has a clean structure, uses standard headings, and contains enough relevant keywords to match the job description. Anything below 60% is highly likely to be automatically rejected by Applicant Tracking Systems.
              </p>
            </details>
            <details className="bg-gray-800/10 border border-gray-800 p-5 rounded-xl group cursor-pointer">
              <summary className="font-semibold text-gray-200 flex justify-between items-center outline-none">
                How do Applicant Tracking Systems work?
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                ATS software parses (reads and extracts) text from your resume to populate digital profiles for recruiters. They struggle with complex formatting like tables, multiple columns, images, and non-standard fonts. Our tool simulates this parsing process to ensure your data is extracted correctly.
              </p>
            </details>
            <details className="bg-gray-800/10 border border-gray-800 p-5 rounded-xl group cursor-pointer">
              <summary className="font-semibold text-gray-200 flex justify-between items-center outline-none">
                Why is my resume score low even with good experience?
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                A low score often results from poor formatting (like using multi-column templates from Canva), missing standard section headers (like "Experience" or "Education"), or failing to include the exact keywords found in the job description. Even the best experience won't get you an interview if the bots can't read it.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer className="w-full max-w-7xl mx-auto py-8 mt-12 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} ATS Resume Scorer. All rights reserved.</p>
      </footer>

      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is a good ATS score?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "A good ATS score is generally 80% or higher. Scoring in this range means your resume has a clean structure, uses standard headings, and contains enough relevant keywords to match the job description."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do Applicant Tracking Systems work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "ATS software parses text from your resume to populate digital profiles for recruiters. They struggle with complex formatting like tables, multiple columns, images, and non-standard fonts."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why is my resume score low even with good experience?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "A low score often results from poor formatting, missing standard section headers, or failing to include the exact keywords found in the job description."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
    </div>
  );
}
