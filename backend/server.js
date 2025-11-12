// --- START OF FILE server.js ---

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import { Server } from "socket.io"; // 👈 EMOJI: Import Server from socket.io
import http from "http"; // 👈 EMOJI: Import http

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
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://cecc-test.vercel.app",
];

// --- SETUP SOCKET.IO ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use the shared array
    methods: ["GET", "POST"],
  },
});

// --- SETUP EXPRESS CORS MIDDLEWARE ---
const corsOptions = {
  origin: allowedOrigins, // Use the shared array
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-Timezone"],
  credentials: true,
};

app.use(cors(corsOptions));

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user connects, they should send an 'addUser' event with their ID
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    // Remove user from the map on disconnect
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log("A user disconnected:", socket.id);
  });
});

// Middleware to make 'io' and 'onlineUsers' accessible in your controllers
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors(corsOptions));

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
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Environment variables loaded:", {
    mongodbConnected: !!process.env.MONGODB_URI,
    jwtSecret: !!process.env.JWT_SECRET,
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
  });
});
