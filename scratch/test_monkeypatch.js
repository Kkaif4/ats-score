const { GoogleGenAI } = require("@google/genai");

// Monkey-patch Headers.prototype.append
const originalAppend = Headers.prototype.append;
Headers.prototype.append = function (name, value) {
  if (name.toLowerCase() === "x-goog-api-key" && (value.startsWith("AQ.") || value.startsWith("ya29."))) {
    console.log("[MONKEY-PATCH] Intercepted x-goog-api-key and converted to Authorization Bearer token");
    originalAppend.call(this, "Authorization", `Bearer ${value}`);
    return;
  }
  return originalAppend.call(this, name, value);
};

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", apiKey ? apiKey.substring(0, 10) + "..." : "undefined");
  const ai = new GoogleGenAI({ apiKey });

  try {
    console.log("Testing gemini-2.5-flash with monkey-patch...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello, tell me a 1-word greeting.",
    });
    console.log("gemini-2.5-flash response:", response.text);
  } catch (err) {
    console.error("gemini-2.5-flash failed:", err);
  }
}

run();
