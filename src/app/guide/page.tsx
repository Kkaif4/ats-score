import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Check, X, FileText, Layout, Target, Zap, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Guide & FAQ - ATS Resume Score Calculator",
  description: "Learn how to optimize your resume using our free ATS Resume Score Calculator. Discover keyword strategies, formatting tips, and compare ATS parser features.",
  alternates: {
    canonical: "https://ats-score-gamma.vercel.app/guide",
  },
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
          ATS Resume Score <span className="text-gradient">Calculator Guide</span>
        </h1>
        <p className="text-gray-400 max-w-2xl text-sm sm:text-base px-2">
          Everything you need to know about Applicant Tracking Systems, optimizing your resume for search queries, and beating recruiter filters.
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto space-y-16">
        {/* Features Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center">Why Use Our ATS Resume Score Calculator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/10 border border-gray-850 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Beat the Bots</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Over 75% of resumes are rejected by Applicant Tracking Systems before a human ever reads them. Our ATS resume checker ensures your formatting and structure are parser-friendly.
              </p>
            </div>
            <div className="bg-gray-800/10 border border-gray-850 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Keyword Optimization</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Instantly calculate your ATS score against a specific job description. Identify missing hard skills and keywords that recruiters are actively filtering for.
              </p>
            </div>
            <div className="bg-gray-800/10 border border-gray-850 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Leveraging Google's advanced Gemini AI, we analyze critical dimensions of your resume—from action verbs to standard section headings—providing actionable feedback.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-900/40 border border-gray-805/80 rounded-2xl p-6 md:p-10">
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

        {/* Resume Optimization Tips Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Resume Optimization Tips</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Follow these expert strategies to score higher in our ATS Resume Score Calculator and pass initial automated candidate screenings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-gray-800/80">
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400"><FileText className="w-4 h-4" /></span>
                Keywords to Use
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Focus on matching the exact hard skills (e.g., "React.js", "Python", "Project Management") and methodology keywords listed in the job posting. Use strong action verbs (e.g., "Led", "Developed", "Optimized") at the start of each bullet point instead of passive phrasing.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800/80">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400"><Layout className="w-4 h-4" /></span>
                Formatting & Layout
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Always use a clean, single-column design. Avoid text boxes, tables, columns, graphics, or complex headers that trip up standard ATS parser engines. Standardize your page fonts to Arial, Calibri, or Helvetica, and use standard bullet lists.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800/80">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Target className="w-4 h-4" /></span>
                Content Optimizations
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Optimize your bullet points by incorporating clear, metrics-driven outcomes (e.g., "Increased sales by 15%", "Reduced load time by 40%"). Ensure section headers are labeled standardly: "Professional Experience", "Education", "Skills", and "Projects".
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800/80">
              <h3 className="text-lg font-semibold text-pink-400 mb-3 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400"><Zap className="w-4 h-4" /></span>
                How to Perform ATS Optimization
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Analyze the job description for recurring keywords. Cross-reference those keywords with your resume's experience section. Tailor your descriptors to reflect the employer's exact phrases to boost matching scoring index metrics.
              </p>
            </div>
          </div>

          {/* Comparison and Offer Callout */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-gray-800/80 space-y-6">
            <h3 className="text-xl font-bold text-white text-center">How We Compare to Other Tools</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400 border-collapse">
                <thead>
                  <tr className="border-b border-gray-850 text-white font-semibold">
                    <th className="py-3 px-4">Feature</th>
                    <th className="py-3 px-4 text-blue-400">Our ATS Checker</th>
                    <th className="py-3 px-4">Other Tools</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800/40">
                    <td className="py-3 px-4 font-medium text-gray-200">ATS Compatibility Check</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Full Structural Scan</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-400"><Check className="w-4 h-4 text-gray-400 shrink-0" /> Basic text parsing only</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800/40">
                    <td className="py-3 px-4 font-medium text-gray-200">Real-time Analysis</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Instant in seconds</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500"><X className="w-4 h-4 text-red-500 shrink-0" /> Queued / delayed reports</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800/40">
                    <td className="py-3 px-4 font-medium text-gray-200">Detailed Score Breakdown</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 7+ Category metrics</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500"><X className="w-4 h-4 text-red-500 shrink-0" /> Single generic percentage</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800/40">
                    <td className="py-3 px-4 font-medium text-gray-200">Job Description Matching</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Direct comparison</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500"><X className="w-4 h-4 text-red-500 shrink-0" /> Simple keyword counting</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800/40">
                    <td className="py-3 px-4 font-medium text-gray-200">Keyword Optimization</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Specific term suggestions</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500"><X className="w-4 h-4 text-red-500 shrink-0" /> Limited list or upsells</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800/40">
                    <td className="py-3 px-4 font-medium text-gray-200">Grammar & Spelling Check</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Complete vocabulary audit</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500"><X className="w-4 h-4 text-red-500 shrink-0" /> Often behind premium paywalls</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800/40">
                    <td className="py-3 px-4 font-medium text-gray-200">Style Recommendations</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Action verb & readability tips</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500"><X className="w-4 h-4 text-red-500 shrink-0" /> Requires template purchases</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800/40">
                    <td className="py-3 px-4 font-medium text-gray-200">Privacy Guaranteed</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> In-memory only (no logs saved)</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500"><X className="w-4 h-4 text-red-500 shrink-0" /> Resumes stored/sold for ads</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800/40">
                    <td className="py-3 px-4 font-medium text-gray-200">Unlimited Uploads</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 100% Free & Unlimited</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500"><X className="w-4 h-4 text-red-500 shrink-0" /> 1-2 scans, then paid plan</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800/40">
                    <td className="py-3 px-4 font-medium text-gray-200">No Registration Required</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 100% Anonymous Uploads</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500"><X className="w-4 h-4 text-red-500 shrink-0" /> Forces email signup to view score</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-center">
              <p className="text-sm text-blue-300">
                <Sparkles className="w-4 h-4 text-blue-400 inline-block align-middle mr-1" /> <strong>Our Guarantee:</strong> Free, anonymous, and unlimited resume scanning. Get access to detailed category metrics, action verb recommendations, and skill checklists instantly!
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-800/10 border border-gray-800 p-5 rounded-xl group cursor-pointer" open>
              <summary className="font-semibold text-gray-200 flex justify-between items-center outline-none">
                <h3 className="text-base font-semibold text-gray-200">What is a good ATS score?</h3>
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                A good ATS score is generally 80% or higher. Scoring in this range means your resume has a clean structure, uses standard headings, and contains enough relevant keywords to match the job description. Anything below 60% is highly likely to be automatically rejected by Applicant Tracking Systems.
              </p>
            </details>
            
            <details className="bg-gray-800/10 border border-gray-800 p-5 rounded-xl group cursor-pointer">
              <summary className="font-semibold text-gray-200 flex justify-between items-center outline-none">
                <h3 className="text-base font-semibold text-gray-200">How do Applicant Tracking Systems work?</h3>
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                ATS software parses (reads and extracts) text from your resume to populate digital profiles for recruiters. They struggle with complex formatting like tables, multiple columns, images, and non-standard fonts. Our tool simulates this parsing process to ensure your data is extracted correctly.
              </p>
            </details>

            <details className="bg-gray-800/10 border border-gray-800 p-5 rounded-xl group cursor-pointer">
              <summary className="font-semibold text-gray-200 flex justify-between items-center outline-none">
                <h3 className="text-base font-semibold text-gray-200">Why is my resume score low even with good experience?</h3>
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                A low score often results from poor formatting (like using multi-column templates from Canva), missing standard section headers (like "Experience" or "Education"), or failing to include the exact keywords found in the job description. Even the best experience won't get you an interview if the bots can't read it.
              </p>
            </details>

            <details className="bg-gray-800/10 border border-gray-800 p-5 rounded-xl group cursor-pointer">
              <summary className="font-semibold text-gray-200 flex justify-between items-center outline-none">
                <h3 className="text-base font-semibold text-gray-200">How often can I calculate my ATS resume score?</h3>
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                You can calculate your resume score as many times as you like! Our service provides unlimited evaluations so that you can make iterative changes, upload, and verify improvement metrics until you reach the target 80%+ threshold.
              </p>
            </details>

            <details className="bg-gray-800/10 border border-gray-800 p-5 rounded-xl group cursor-pointer">
              <summary className="font-semibold text-gray-200 flex justify-between items-center outline-none">
                <h3 className="text-base font-semibold text-gray-200">What file formats does the ATS Resume Score Calculator support?</h3>
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                We support standard PDF (.pdf) and Microsoft Word (.docx) formats. These are the most universally accepted formats across all enterprise Applicant Tracking Systems. We recommend avoiding image files or scan formats as text within them cannot be parsed.
              </p>
            </details>

            <details className="bg-gray-800/10 border border-gray-800 p-5 rounded-xl group cursor-pointer">
              <summary className="font-semibold text-gray-200 flex justify-between items-center outline-none">
                <h3 className="text-base font-semibold text-gray-200">Is my resume data stored after the scan?</h3>
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                Your uploaded documents are processed temporarily in-memory to generate your score report. We do not store or catalog your resume file itself. Only the scores and skill recommendations are saved in our database to facilitate the public share link functionality.
              </p>
            </details>

            <details className="bg-gray-800/10 border border-gray-800 p-5 rounded-xl group cursor-pointer">
              <summary className="font-semibold text-gray-200 flex justify-between items-center outline-none">
                <h3 className="text-base font-semibold text-gray-200">Does this ATS Resume Score Calculator guarantee a job interview?</h3>
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                While scoring highly on our calculator significantly increases the chances of passing automated recruitment filters, it does not guarantee a human interview. Elements such as specific employer preferences, geographic requirements, or internal hires also play a role.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer className="w-full max-w-7xl mx-auto py-8 mt-12 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} ATS Resume Score Calculator. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gray-300 transition-colors">
            Terms of Service
          </Link>
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
                  },
                  {
                    "@type": "Question",
                    "name": "How often can I calculate my ATS resume score?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "You can calculate your resume score as many times as you like! Our service provides unlimited evaluations so that you can make iterative changes, upload, and verify improvement metrics."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What file formats does the ATS Resume Score Calculator support?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We support standard PDF (.pdf) and Microsoft Word (.docx) formats, which are the most universally accepted formats across enterprise Applicant Tracking Systems."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is my resume data stored after the scan?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Your uploaded documents are processed temporarily in-memory. Only the scores and skill recommendations are saved in our database to facilitate the public share link functionality."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does this ATS Resume Score Calculator guarantee a job interview?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "While scoring highly on our calculator significantly increases the chances of passing automated recruitment filters, it does not guarantee a human interview."
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
