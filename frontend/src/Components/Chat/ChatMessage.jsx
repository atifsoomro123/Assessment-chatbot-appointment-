import React from "react";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  return (
    <div
      style={{
        margin: "8px 0",
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "10px 12px",
          borderRadius: 10,
          background: isUser ? "#2b7cff" : "#f3f3f3",
          color: isUser ? "white" : "black",
          whiteSpace: "pre-wrap",
        }}
      >
        {message.content}
      </div>
    </div>
  );
}
