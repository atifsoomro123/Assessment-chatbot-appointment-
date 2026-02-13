const API_BASE = "http://localhost:5000";

export async function getChatToken() {
  const r = await fetch(`${API_BASE}/api/chatbot/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json(); // { token, sessionId }
}

export async function sendChatMessage({ message, token, sessionId }) {
  const r = await fetch(`${API_BASE}/api/chatbot/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, token, sessionId }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json(); // { reply, sessionId, extracted? }
}
