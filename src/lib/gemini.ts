import { GoogleGenAI } from "@google/genai";
import mammoth from "mammoth";

// Lazy initialization of Gemini client to prevent build-time crashes if API key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export interface ATSAnalysisResult {
  score: number;
  summary: string;
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

const ATS_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    score: {
      type: "INTEGER",
      description: "Overall ATS match score from 0 to 100",
    },
    summary: {
      type: "STRING",
      description: "Brief professional summary of the resume evaluation",
    },
    matchingKeywords: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Keywords or skills identified in the resume that are strong matching points",
    },
    missingKeywords: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Important industry-standard keywords or skills missing from the resume",
    },
    recommendations: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Specific actionable steps to optimize the resume structure, formatting, or content",
    },
  },
  required: ["score", "summary", "matchingKeywords", "missingKeywords", "recommendations"],
};

export async function processDocument(
  fileBuffer: Buffer,
  mimeType: string,
  jobDescription?: string
): Promise<ATSAnalysisResult> {
  const ai = getGeminiClient();
  const modelName = "gemini-3.5-flash";

  let contents: any[] = [];

  if (mimeType === "application/pdf") {
    // For PDFs: Intercept as buffer and send inline via inlineData base64 encoding
    const base64Data = fileBuffer.toString("base64");
    contents = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
      {
        text: `Analyze this resume PDF and provide a structured ATS analysis. Score it objectively on a scale of 0 to 100 based on standard industry templates.${
          jobDescription && jobDescription.trim().length > 0
            ? ` Crucially, evaluate the resume specifically against the following target Job Description:\n\n=== JOB DESCRIPTION ===\n${jobDescription}\n=== END JOB DESCRIPTION ===`
            : ""
        }`,
      },
    ];
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    // For DOCX: Extract raw plain text using mammoth
    try {
      const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });
      const extractedText = docxResult.value;

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("Could not extract text content from the Word document.");
      }

      contents = [
        {
          text: `Analyze the following resume text extracted from a Word document and provide a structured ATS analysis. Score it objectively on a scale of 0 to 100 based on standard industry templates.${
            jobDescription && jobDescription.trim().length > 0
              ? ` Crucially, evaluate the resume specifically against the following target Job Description:\n\n=== JOB DESCRIPTION ===\n${jobDescription}\n=== END JOB DESCRIPTION ===`
              : ""
          }\n\n=== RESUME TEXT ===\n${extractedText}`,
        },
      ];
    } catch (err: any) {
      throw new Error(`Failed to parse DOCX file: ${err.message}`);
    }
  } else {
    throw new Error(`Unsupported MIME type: ${mimeType}`);
  }

  // Generate content using structured JSON schema output
  const response = await ai.models.generateContent({
    model: modelName,
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: ATS_RESPONSE_SCHEMA as any,
    },
  });

  if (!response.text) {
    throw new Error("Empty response received from the Gemini API model.");
  }

  try {
    const parsed: ATSAnalysisResult = JSON.parse(response.text);
    return parsed;
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON. Raw response:", response.text);
    throw new Error("Failed to parse the analyzer output format.");
  }
}
