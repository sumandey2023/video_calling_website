import React, { useState } from "react";
import { joinCall as apiJoinCall } from "./api";

function JoinCall({ setCallData }) {
  const [username, setUsername] = useState("");
  const [callId, setCallId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function joinCall() {
    setError("");
    if (!username.trim() || !callId.trim()) {
      setError("Please enter your name and Call ID");
      return;
    }
    setLoading(true);
    try {
      const data = await apiJoinCall(username.trim(), callId.trim());
      setCallData(data);
    } catch (e) {
      console.error(e);
      setError("Failed to join. Check backend running and Call ID is valid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Join Call</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && !loading && joinCall()}
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Enter Call ID (from creator)"
        value={callId}
        onChange={(e) => setCallId(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && !loading && joinCall()}
        disabled={loading}
      />
      <button onClick={joinCall} disabled={loading}>
        {loading ? "⏳ Joining..." : "👥 Join Call"}
      </button>
      {error && <div className="error-msg">{error}</div>}
    </div>
  );
}

export default JoinCall;
