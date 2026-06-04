import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  alternates: {
    canonical: "https://ats-score-gamma.vercel.app/",
  },
  title: {
    default: "Free ATS Resume Scorer - AI Resume Analyzer & Scanner",
    template: "%s | ATS Resume Scorer",
  },
  description:
    "Evaluate your resume matching score for free using Gemini AI. Get a free resume analysis with instant keyword matching, missing skills, and optimization recommendations.",
  applicationName: "ATS Resume Scorer",
  appleWebApp: {
    title: "ATS Resume Scorer",
    statusBarStyle: "default",
    capable: true,
  },
  keywords: [
    "free ATS resume checker",
    "free resume score",
    "AI resume analyzer",
    "free resume analysis",
    "Gemini AI resume scanner",
    "job description match",
    "ATS optimization",
    "free resume check",
  ],
  authors: [{ name: "Mohammad Kaif Shaikh" }],
  creator: "Mohammad Kaif Shaikh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ats-score-gamma.vercel.app/",
    title: "Free ATS Resume Scorer - AI Resume Analyzer",
    description:
      "Evaluate your resume matching score for free using Gemini AI. Get a free resume analysis with instant keyword matching, missing skills, and optimization recommendations.",
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
    title: "Free ATS Resume Scorer - AI Resume Analyzer",
    description:
      "Evaluate your resume matching score for free using Gemini AI. Get a free resume analysis with instant keyword matching, missing skills, and optimization recommendations.",
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
  verification: {
    google: "tCttZq1r1CGel4d6wcJU1rRim7-ZsrrOz3Xa-KF5j4A",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
