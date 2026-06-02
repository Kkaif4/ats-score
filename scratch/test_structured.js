const { GoogleGenAI } = require("@google/genai");

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

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", apiKey ? apiKey.substring(0, 10) + "..." : "undefined");
  const ai = new GoogleGenAI({ apiKey });

  try {
    console.log("Testing gemini-2.5-flash with structured output...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Analyze this resume text: 'John Doe, Software Engineer with 5 years experience in React and Node.js. Target Job: Senior React Developer.'",
      config: {
        responseMimeType: "application/json",
        responseSchema: ATS_RESPONSE_SCHEMA,
      },
    });
    console.log("gemini-2.5-flash response text:", response.text);
  } catch (err) {
    console.error("gemini-2.5-flash failed:", err);
  }
}

run();
