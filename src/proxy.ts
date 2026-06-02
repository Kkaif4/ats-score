import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Centralized sliding-window rate limit maps
// Tracks timestamps of requests per IP
const documentRateLimits = new Map<string, number[]>();
const feedbackRateLimits = new Map<string, number[]>();

const WINDOW_MS = 60 * 1000; // 1 minute window
const LIMIT_DOCUMENT = 5; // 5 document processing attempts per minute
const LIMIT_FEEDBACK = 3; // 3 feedback submissions per minute

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Return first IP address in the list
    const ip = forwardedFor.split(",")[0].trim();
    if (ip) return ip;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return (request as any).ip || "127.0.0.1";
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rate limit document submissions
  if (pathname === "/api/process-document") {
    const ip = getClientIp(request);
    const now = Date.now();
    const timestamps = documentRateLimits.get(ip) || [];

    // Filter out timestamps older than the sliding window
    const validTimestamps = timestamps.filter((time) => now - time < WINDOW_MS);

    if (validTimestamps.length >= LIMIT_DOCUMENT) {
      const oldestValid = validTimestamps[0];
      const timeRemainingSeconds = Math.ceil((WINDOW_MS - (now - oldestValid)) / 1000);

      return new NextResponse(
        JSON.stringify({
          error: "Too many document analysis requests. Please try again later.",
          retryAfter: timeRemainingSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(timeRemainingSeconds),
          },
        }
      );
    }

    // Add new timestamp and save
    validTimestamps.push(now);
    documentRateLimits.set(ip, validTimestamps);
  }

  // Rate limit feedback submissions
  if (pathname === "/api/feedback") {
    const ip = getClientIp(request);
    const now = Date.now();
    const timestamps = feedbackRateLimits.get(ip) || [];

    // Filter out timestamps older than the sliding window
    const validTimestamps = timestamps.filter((time) => now - time < WINDOW_MS);

    if (validTimestamps.length >= LIMIT_FEEDBACK) {
      const oldestValid = validTimestamps[0];
      const timeRemainingSeconds = Math.ceil((WINDOW_MS - (now - oldestValid)) / 1000);

      return new NextResponse(
        JSON.stringify({
          error: "Too many feedback submissions. Please try again later.",
          retryAfter: timeRemainingSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(timeRemainingSeconds),
          },
        }
      );
    }

    // Add new timestamp and save
    validTimestamps.push(now);
    feedbackRateLimits.set(ip, validTimestamps);
  }

  return NextResponse.next();
}

// Apply rate limiting proxy specifically to API endpoints
export const config = {
  matcher: ["/api/process-document", "/api/feedback"],
};
