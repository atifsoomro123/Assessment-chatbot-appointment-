const express = require("express");
const router = express.Router();

const { callAiService } = require("../services/aiProxy.service");

// 🔹 1️⃣ TOKEN ENDPOINT (simple demo version)
router.post("/token", (req, res) => {
  // In real production, generate short-lived JWT
  res.json({
    token: "demo-token",
    sessionId: "session-" + Date.now()
  });
});

// 🔹 2️⃣ MESSAGE ENDPOINT
router.post("/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const aiResponse = await callAiService({
      sessionId,
      message
    });

    if (!aiResponse) {
      return res.json({
        reply: "AI service fallback (backend couldn't reach AI)."
      });
    }

    res.json(aiResponse);

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
