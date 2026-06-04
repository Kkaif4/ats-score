import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ats-score-gamma.vercel.app/"),
  title: {
    default: "AI-Powered ATS Resume Scorer & Analyzer",
    template: "%s | ATS Scorer",
  },
  description:
    "Evaluate your resume matching score using Gemini AI. Get instant keyword matching, missing skills analysis, and structural recommendations to beat Applicant Tracking Systems.",
  keywords: [
    "ATS resume checker",
    "resume score",
    "AI resume analyzer",
    "Gemini AI",
    "job description match",
    "ATS optimization",
    "resume parsing",
  ],
  authors: [{ name: "Mohammad Kaif Shaikh" }],
  creator: "Mohammad Kaif Shaikh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ats-score-gamma.vercel.app/",
    title: "AI-Powered ATS Resume Scorer & Analyzer",
    description:
      "Evaluate your resume matching score using Gemini AI. Get instant keyword matching, missing skills analysis, and structural recommendations to beat Applicant Tracking Systems.",
    siteName: "ATS Resume Scorer",
    images: [
      {
        url: "/ats-scorer-image.png",
        width: 1200,
        height: 630,
        alt: "ATS Resume Scorer Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Powered ATS Resume Scorer & Analyzer",
    description:
      "Evaluate your resume matching score using Gemini AI. Get instant keyword matching and structural recommendations.",
    images: ["/ats-scorer-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
