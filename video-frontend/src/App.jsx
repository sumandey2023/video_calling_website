import { useState } from "react";
import CreateCall from "./CreateCall";
import JoinCall from "./JoinCall";
import VideoRoom from "./VideoRoom";
import "./App.css";

function App() {
  const [mode, setMode] = useState(""); // create | join
  const [callData, setCallData] = useState(null);

  if (callData) {
    return <VideoRoom {...callData} />;
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="app-header">
          <h1>📱 Video Call</h1>
          <p>Crystal clear video calls, instantly</p>
        </div>

        {!mode && (
          <div className="mode-selector">
            <button
              className="mode-btn create-btn"
              onClick={() => setMode("create")}
            >
              <span className="icon">➕</span>
              <span>Create Call</span>
            </button>
            <button
              className="mode-btn join-btn"
              onClick={() => setMode("join")}
            >
              <span className="icon">👥</span>
              <span>Join Call</span>
            </button>
          </div>
        )}

        {mode === "create" && (
          <div className="form-container">
            <button className="back-btn" onClick={() => setMode("")}>
              ← Back
            </button>
            <CreateCall setCallData={setCallData} />
          </div>
        )}

        {mode === "join" && (
          <div className="form-container">
            <button className="back-btn" onClick={() => setMode("")}>
              ← Back
            </button>
            <JoinCall setCallData={setCallData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
