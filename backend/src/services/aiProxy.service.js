const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000/chat";

async function callAiService({ sessionId, message }) {
  console.log(`Calling AI service with sessionId=${sessionId} and message="${message}"`);
  
  const r = await fetch(AI_SERVICE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: String(sessionId), message }),
  });

  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`AI service error ${r.status}: ${t}`);
  }

  return r.json(); // { reply, extracted? }
}

module.exports = { callAiService };
