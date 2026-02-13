const jwt = require("jsonwebtoken");
const { pool } = require("../db/postgres");
const { callAiService } = require("../services/aiProxy.service");

const CHAT_TOKEN_SECRET = process.env.CHAT_TOKEN_SECRET || "dev_secret_key";
const CHAT_TOKEN_TTL_SEC = parseInt(process.env.CHAT_TOKEN_TTL_SEC || "600", 10); // 10 min

async function issueToken(req, res, next) {
  try {
    // If you have auth middleware: const userId = req.user.id;
    const userId = null;

    // Create chat session
    const s = await pool.query(
      `INSERT INTO chat_sessions (user_id, created_at)
       VALUES ($1, NOW())
       RETURNING id`,
      [userId]
    );
    const sessionId = s.rows[0].id;

    const token = jwt.sign({ sessionId }, CHAT_TOKEN_SECRET, { expiresIn: CHAT_TOKEN_TTL_SEC });

    return res.json({ token, sessionId, expiresIn: CHAT_TOKEN_TTL_SEC });
  } catch (e) {
    next(e);
  }
}

async function chatMessage(req, res, next) {
  try {
    const { message, token, sessionId } = req.body || {};

    if (!message) return res.status(400).json({ error: "message is required" });
    if (!token) return res.status(401).json({ error: "chat token missing" });

    let payload;
    try {
      payload = jwt.verify(token, CHAT_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ error: "invalid or expired token" });
    }

    const activeSessionId = sessionId || payload.sessionId;

    // Save USER message
    await pool.query(
      `INSERT INTO chat_messages (session_id, role, content, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [activeSessionId, "user", message]
    );

    // Call Python AI
    let ai;
    try {
      ai = await callAiService({ sessionId: activeSessionId, message });
    } catch (err) {
      ai = { reply: "AI service is not available yet. (Fallback)", extracted: null };
    }

    const reply = ai?.reply || "No reply from AI.";

    // Save ASSISTANT message
    await pool.query(
      `INSERT INTO chat_messages (session_id, role, content, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [activeSessionId, "assistant", reply]
    );

    // If AI says booking is confirmed, save appointment
    // expected extracted:
    // { confirmed: true, name, service_type, appointment_time_iso, timezone, contact }
    if (ai?.extracted?.confirmed === true) {
      const e = ai.extracted;

      await pool.query(
        `INSERT INTO appointments (user_id, session_id, service_type, appointment_time, timezone, contact, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          null,
          activeSessionId,
          e.service_type || null,
          e.appointment_time_iso || null,
          e.timezone || "Asia/Dubai",
          e.contact || null,
          "confirmed",
        ]
      );
    }

    return res.json({ reply, sessionId: activeSessionId, extracted: ai?.extracted || null });
  } catch (e) {
    next(e);
  }
}

module.exports = { issueToken, chatMessage };
