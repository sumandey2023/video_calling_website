import React, { useState } from "react";

function CreateCall({ setCallData }) {
  const [username, setUsername] = useState("");
  const [callId, setCallId] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendData, setBackendData] = useState(null);
  const [error, setError] = useState("");

  async function createCall() {
    if (!username.trim()) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/create-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!res.ok) throw new Error("Create call failed");
      const data = await res.json();
      setCallId(data.callId);
      setBackendData(data);
    } catch (e) {
      console.error(e);
      setError(
        "Failed to create call. Make sure backend is running on http://localhost:5000",
      );
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(callId);
    alert("Call ID copied to clipboard!");
  };

  return (
    <div>
      <h2>Create Call</h2>
      <input
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && createCall()}
      />
      <button onClick={createCall} disabled={loading}>
        {loading ? "⏳ Creating..." : "✨ Create Call"}
      </button>

      {error && <div className="error-msg">{error}</div>}

      {callId && backendData && (
        <div className="success-msg" style={{ marginBottom: 0 }}>
          ✅ Call created successfully!
        </div>
      )}

      {callId && backendData && (
        <>
          <p
            style={{
              marginTop: 20,
              marginBottom: 8,
              fontWeight: 600,
              color: "#333",
            }}
          >
            Call ID:
          </p>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 15,
            }}
          >
            <input
              value={callId}
              readOnly
              style={{ flex: 1, fontFamily: "monospace", fontSize: "0.9rem" }}
            />
            <button
              onClick={copyToClipboard}
              style={{
                flex: 0,
                padding: "12px 16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              📋 Copy
            </button>
          </div>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#666",
              marginBottom: 15,
              fontStyle: "italic",
            }}
          >
            Share this ID with others to join your call
          </p>
          <button
            onClick={() => setCallData(backendData)}
            style={{
              background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
            }}
          >
            🚀 Enter Call Room
          </button>
        </>
      )}
    </div>
  );
}

export default CreateCall;
