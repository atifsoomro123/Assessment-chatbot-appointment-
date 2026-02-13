import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { getChatToken, sendChatMessage } from "../../services/apiClient";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me to book an appointment (e.g., 'Book tomorrow 4pm')." },
  ]);

  const [token, setToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await getChatToken();
      setToken(t.token);
      setSessionId(t.sessionId);
    })().catch((e) => {
      setMessages((prev) => [...prev, { role: "assistant", content: `Token error: ${e.message}` }]);
    });
  }, []);

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const data = await sendChatMessage({ message: text, token, sessionId });
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {messages.map((m, i) => <ChatMessage key={i} message={m} />)}
      <ChatInput onSend={handleSend} disabled={!token || loading} />
    </div>
  );
}
