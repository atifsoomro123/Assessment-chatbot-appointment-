import React, { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText("");
    await onSend(t);
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="Type a message…"
        style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
      />
      <button disabled={disabled || !text.trim()} style={{ padding: "10px 12px", borderRadius: 8 }}>
        Send
      </button>
    </form>
  );
}
