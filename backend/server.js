// --- START OF FILE server.js ---

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables first
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "EMAIL_USER",
  "EMAIL_PASSWORD",
];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("Missing required environment variables:", missingVars);
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✨ --- FIX START --- ✨
// Refactored CORS configuration for better flexibility and standard practice.
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://cecc-test.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    // Allow the request if the origin is in our whitelist
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      // Otherwise, block the request
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-Timezone"],
  credentials: true,
};

app.use(cors(corsOptions));
// ✨ --- FIX END --- ✨

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", apiRoutes);

// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("MongoDB connection error:", err);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Environment variables loaded:", {
    mongodbConnected: !!process.env.MONGODB_URI,
    jwtSecret: !!process.env.JWT_SECRET,
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
  });
});
