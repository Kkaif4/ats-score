import { NextRequest, NextResponse } from "next/server";
import { connectDB, ResumeReport } from "@/lib/db";
import { RETENTION_DAYS } from "@/app/api/common";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Security: verify cron secret
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    await connectDB();

    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const result = await ResumeReport.deleteMany({
      createdAt: { $lt: cutoff },
    });

    console.log(
      `[Cron Cleanup] Deleted ${result.deletedCount} resume reports older than ${RETENTION_DAYS} days.`,
    );

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      cutoffDate: cutoff.toISOString(),
    });
  } catch (err: any) {
    console.error("[Cron Cleanup] Error:", err);
    return NextResponse.json(
      { error: err.message || "Cleanup failed" },
      { status: 500 },
    );
  }
}
