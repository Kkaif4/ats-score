import { NextRequest, NextResponse } from "next/server";
import { processDocument } from "@/lib/gemini";
import { verifyCaptcha } from "@/lib/security";
import { connectDB, RateLimit } from "@/lib/db";
import crypto from "crypto";
import { LIMIT_THRESHOLD, RESET_HOURS } from "@/app/api/common";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const captchaToken = formData.get("captchaToken") as string | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    // 1. CAPTCHA verification
    if (!captchaToken) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 },
      );
    }

    const captchaVerification = await verifyCaptcha(captchaToken);
    if (!captchaVerification.success) {
      return NextResponse.json(
        { error: captchaVerification.error || "CAPTCHA verification failed" },
        { status: 403 },
      );
    }

    // 2. File verification
    if (!file) {
      return NextResponse.json(
        { error: "No file was uploaded" },
        { status: 400 },
      );
    }

    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only PDF and DOCX documents are accepted.",
        },
        { status: 400 },
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds the maximum size limit of 5MB" },
        { status: 400 },
      );
    }

    // 3. Strict Fingerprint-Based Rate Limiting
    const fingerprintStr = formData.get("fingerprint") as string | null;
    let uniqueId = "unknown";

    if (fingerprintStr) {
      try {
        const fp = JSON.parse(fingerprintStr);
        const forwardedFor = request.headers.get("x-forwarded-for");
        const ip = forwardedFor
          ? forwardedFor.split(",")[0].trim()
          : (request as any).ip || "127.0.0.1";

        // Construct composite key
        const compositeKey = `${ip}-${fp.browserFingerprint}-${fp.screenResolution}-${fp.language}-${fp.timezone}`;
        uniqueId = crypto
          .createHash("sha256")
          .update(compositeKey)
          .digest("hex");
      } catch (e) {
        console.error("Failed to parse fingerprint data", e);
      }
    }

    // Connect to DB and check rate limit
    await connectDB();
    const rateLimitRecord = await RateLimit.findOne({ uniqueId });

    if (rateLimitRecord) {
      if (rateLimitRecord.tries >= LIMIT_THRESHOLD) {
        // Check if reset period has passed
        const now = new Date();
        const limitReachedAt = rateLimitRecord.limitReachedAt || now;

        // If the timestamp was missing (e.g. threshold changed or first block), save it so the timer ticks down
        if (!rateLimitRecord.limitReachedAt) {
          rateLimitRecord.limitReachedAt = limitReachedAt;
          await rateLimitRecord.save();
        }

        const hoursSinceLimit =
          Math.abs(now.getTime() - limitReachedAt.getTime()) / 3600000;

        if (hoursSinceLimit < RESET_HOURS) {
          // Still within the blocked period
          const resetAt = new Date(
            limitReachedAt.getTime() + RESET_HOURS * 3600000,
          );
          return NextResponse.json(
            {
              error: `Limit Reached. Please try again !`,
              resetAt: resetAt.toISOString(),
            },
            { status: 429 },
          );
        } else {
          // Reset period elapsed, reset the record
          rateLimitRecord.tries = 0;
          rateLimitRecord.limitReachedAt = null;
        }
      }
    }

    // 4. Process the stream in memory
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Send payload to Gemini and parse analysis output
    const analysis = await processDocument(
      buffer,
      file.type,
      jobDescription || undefined,
    );

    // 5. Update Rate Limit (only if analysis was successful)
    if (uniqueId !== "unknown") {
      const now = new Date();
      if (rateLimitRecord) {
        rateLimitRecord.tries += 1;
        if (rateLimitRecord.tries >= LIMIT_THRESHOLD) {
          rateLimitRecord.limitReachedAt = now;
        }
        await rateLimitRecord.save();
      } else {
        await RateLimit.create({
          uniqueId,
          tries: 1,
          limitReachedAt: 1 >= LIMIT_THRESHOLD ? now : null,
        });
      }
    }

    return NextResponse.json({ success: true, analysis });
  } catch (err: any) {
    console.error("Error in process-document route:", err);
    return NextResponse.json(
      {
        error:
          err.message ||
          "An unexpected error occurred during document processing",
      },
      { status: 500 },
    );
  }
}
