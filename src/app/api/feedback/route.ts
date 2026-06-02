import { NextRequest, NextResponse } from "next/server";
import { connectDB, Feedback } from "@/lib/db";
import { sendFeedbackEmail } from "@/lib/mailer";
import { verifyCaptcha } from "@/lib/security";

export const dynamic = "force-dynamic";

function parseUserAgent(userAgentString: string) {
  let os = "Unknown OS";
  let browser = "Unknown Browser";

  if (!userAgentString) return { os, browser };

  const ua = userAgentString.toLowerCase();

  // OS detection
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("macintosh") || ua.includes("mac os")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";

  // Browser detection
  if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("msie") || ua.includes("trident")) browser = "Internet Explorer";

  return { os, browser };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, captchaToken, fingerprint } = body;

    // 1. Inputs validation
    if (!name || !email || !message || !captchaToken) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, message, captchaToken)" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 2. CAPTCHA verification
    const captchaVerification = await verifyCaptcha(captchaToken);
    if (!captchaVerification.success) {
      return NextResponse.json(
        { error: captchaVerification.error || "CAPTCHA verification failed" },
        { status: 403 }
      );
    }

    // 3. Systemic telemetry collection
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : ((request as any).ip || "127.0.0.1");
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    // Parse systemic metadata
    const { os, browser } = parseUserAgent(userAgent);
    
    // Combine with client-side fingerprint if provided
    const clientBrowser = fingerprint?.browser || browser;
    const clientOS = fingerprint?.os || os;

    // 4. Save feedback in local MongoDB Database
    await connectDB();
    const feedbackRecord = await Feedback.create({
      name,
      email,
      message,
      ip,
      userAgent,
      os: clientOS,
      browser: clientBrowser,
    });

    // 5. Send structured email notification using Nodemailer
    await sendFeedbackEmail({
      name,
      email,
      message,
      telemetry: {
        ip,
        userAgent,
        os: clientOS,
        browser: clientBrowser,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted and logged successfully",
      id: feedbackRecord._id,
    });
  } catch (err: any) {
    console.error("Error in feedback route:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while saving feedback" },
      { status: 500 }
    );
  }
}
