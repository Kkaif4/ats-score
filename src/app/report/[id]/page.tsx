import { connectDB, ResumeReport } from "@/lib/db";
import { notFound } from "next/navigation";
import ReportClientView from "./ReportClientView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;
  console.log(id);
  if (!id) {
    return notFound();
  }

  await connectDB();

  // Find the report in MongoDB
  const reportDoc = await ResumeReport.findOne({ shareId: id }).lean();

  if (!reportDoc) {
    return notFound();
  }

  // Serialize Mongoose document to plain object
  const serializedReport = {
    atsScore: reportDoc.atsScore,
    fileMeta: {
      originalName: reportDoc.fileMeta.originalName,
      mimeType: reportDoc.fileMeta.mimeType,
      sizeInBytes: reportDoc.fileMeta.sizeInBytes,
      fileBase64: reportDoc.fileMeta.fileBase64,
    },
    insights: {
      summary: reportDoc.insights?.summary || "",
      missingKeywords: reportDoc.insights?.missingKeywords || [],
      matchingKeywords: reportDoc.insights?.matchingKeywords || [],
      recommendations: reportDoc.insights?.recommendations || [],
      sectionScores: reportDoc.insights?.sectionScores
        ? {
            keywordMatch: reportDoc.insights.sectionScores.keywordMatch || 0,
            experienceQuality:
              reportDoc.insights.sectionScores.experienceQuality || 0,
            structure: reportDoc.insights.sectionScores.structure || 0,
            skills: reportDoc.insights.sectionScores.skills || 0,
            formatting: reportDoc.insights.sectionScores.formatting || 0,
            education: reportDoc.insights.sectionScores.education || 0,
            contactInfo: reportDoc.insights.sectionScores.contactInfo || 0,
          }
        : undefined,
    },
    createdAt: reportDoc.createdAt
      ? new Date(reportDoc.createdAt).toISOString()
      : new Date().toISOString(),
  };

  return <ReportClientView report={serializedReport} />;
}
