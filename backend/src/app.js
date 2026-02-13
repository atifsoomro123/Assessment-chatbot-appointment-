const express = require("express");
const cors = require("cors");

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3001";

// ✅ CORS must be BEFORE routes
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight for ALL routes
app.options("*", cors());

app.use(express.json());

// logger
const loggerMiddleware = require("./middleware/logger.middleware");
app.use(loggerMiddleware);

// routes
const chatbotRoutes = require("./routes/chatbot.routes");
app.use("/api/chatbot", chatbotRoutes);

module.exports = app;
