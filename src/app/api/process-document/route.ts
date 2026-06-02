import { NextRequest, NextResponse } from "next/server";
import { processDocument } from "@/lib/gemini";
import { verifyCaptcha } from "@/lib/security";

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
        { status: 400 }
      );
    }

    const captchaVerification = await verifyCaptcha(captchaToken);
    if (!captchaVerification.success) {
      return NextResponse.json(
        { error: captchaVerification.error || "CAPTCHA verification failed" },
        { status: 403 }
      );
    }

    // 2. File verification
    if (!file) {
      return NextResponse.json(
        { error: "No file was uploaded" },
        { status: 400 }
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
          error: "Invalid file type. Only PDF and DOCX documents are accepted." 
        },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds the maximum size limit of 5MB" },
        { status: 400 }
      );
    }

    // 3. Process the stream in memory
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Send payload to Gemini and parse analysis output
    const analysis = await processDocument(buffer, file.type, jobDescription || undefined);

    return NextResponse.json({ success: true, analysis });
  } catch (err: any) {
    console.error("Error in process-document route:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during document processing" },
      { status: 500 }
    );
  }
}
