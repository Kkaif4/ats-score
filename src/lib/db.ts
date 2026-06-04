import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGOURI || "mongodb://localhost:27017/ats";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGOURI environment variable inside .env",
  );
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

// Define Schema for Feedback and Telemetry parameters
const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
  },
  ip: {
    type: String,
    default: "unknown",
  },
  userAgent: {
    type: String,
    default: "unknown",
  },
  os: {
    type: String,
    default: "unknown",
  },
  browser: {
    type: String,
    default: "unknown",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model duplication in development
export const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

const RateLimitSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  tries: {
    type: Number,
    default: 0,
  },
  limitReachedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const RateLimit =
  mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);

// Resume Report Schema — stores file binary (base64), metadata, and full ATS analysis
const ResumeReportSchema = new mongoose.Schema(
  {
    fingerprintId: { type: String, required: true, index: true },
    ipAddress: { type: String, required: true },
    atsScore: { type: Number, required: true },

    // File Storage — binary stored as base64 string directly in MongoDB
    fileMeta: {
      originalName: { type: String, required: true },
      mimeType: { type: String, required: true },
      sizeInBytes: { type: Number },
      fileBase64: { type: String, required: true },
    },

    // Full analysis results for instant retrieval
    insights: {
      summary: { type: String },
      missingKeywords: [String],
      matchingKeywords: [String],
      recommendations: [String],
      sectionScores: {
        keywordMatch: Number,
        experienceQuality: Number,
        structure: Number,
        skills: Number,
        formatting: Number,
        education: Number,
        contactInfo: Number,
      },
    },
    shareId: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true },
);

// Efficient lookup: find all reports for a user, newest first
ResumeReportSchema.index({ fingerprintId: 1, createdAt: -1 });

if (mongoose.models.ResumeReport && !mongoose.models.ResumeReport.schema.paths.shareId) {
  delete (mongoose.models as any).ResumeReport;
}

export const ResumeReport =
  mongoose.models.ResumeReport ||
  mongoose.model("ResumeReport", ResumeReportSchema);
