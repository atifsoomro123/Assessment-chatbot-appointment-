import React, { useEffect, useState } from "react";
import ChatWindow from "./Components/Chat/ChatWindow";

export default function App() {
  const [status, setStatus] = useState("Frontend loaded ✅");

  useEffect(() => {
    setStatus("Ready. Use Signup/Login then open Chat.");
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>AI Chatbot — Appointment Booking (Assessment)</h1>

      {/* Assessment Entities (Visible on screen) */}
      <div style={{ marginBottom: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <h3>Assessment Entities</h3>
        <ul style={{ margin: 0 }}>
          <li>✅ Frontend: React UI + Chat Widget</li>
          <li>✅ Auth: Signup/Login (session/JWT)</li>
          <li>✅ Chat: Token-based access + Session handling</li>
          <li>✅ Backend: Express endpoints</li>
          <li>✅ AI: Python LangChain microservice</li>
          <li>✅ DB: PostgreSQL (users / chat_sessions / appointments)</li>
        </ul>
        <p style={{ marginTop: 10, opacity: 0.8 }}>Status: {status}</p>
      </div>

      {/* Chat UI */}
      <ChatWindow />
    </div>
  );
}
