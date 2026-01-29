import React, { useState } from "react";
import { createCall as apiCreateCall } from "./api";

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
      const data = await apiCreateCall(username.trim());
      setCallId(data.callId);
      setBackendData(data);
    } catch (e) {
      console.error(e);
      setError("Failed to create call. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(callId);
    alert("✅ Call ID copied to clipboard!");
  };

  return (
    <div>
      <h2>Create Call</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && !loading && createCall()}
        disabled={loading}
      />
      <button onClick={createCall} disabled={loading}>
        {loading ? "⏳ Creating..." : "✨ Create Call"}
      </button>

      {error && <div className="error-msg">{error}</div>}

      {callId && backendData && (
        <div className="success-msg">✅ Call created successfully!</div>
      )}

      {callId && backendData && (
        <>
          <label className="form-label">Call ID:</label>
          <div className="call-id-container">
            <input
              type="text"
              className="call-id-input"
              value={callId}
              readOnly
            />
            <button className="copy-btn" onClick={copyToClipboard}>
              📋 Copy
            </button>
          </div>
          <p className="hint-text">
            Share this ID with others to join your call
          </p>
          <button
            className="enter-btn"
            onClick={() => setCallData(backendData)}
          >
            🚀 Enter Call Room
          </button>
        </>
      )}
    </div>
  );
}

export default CreateCall;
