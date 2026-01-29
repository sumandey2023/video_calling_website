import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "./VideoRoom.css";

// Custom Control Bar with Icons
function CustomControlBar() {
  const { useCameraState, useMicrophoneState, useParticipants } =
    useCallStateHooks();
  const { camera, isCameraEnabled } = useCameraState();
  const { microphone, isMicrophoneEnabled } = useMicrophoneState();
  const participants = useParticipants();

  return (
    <div className="custom-controls">
      <div className="control-group">
        {/* Mic Toggle */}
        <button
          className={`control-btn ${isMicrophoneEnabled ? "active" : ""}`}
          onClick={() => {
            try {
              microphone.toggle();
            } catch (e) {
              console.error("Mic toggle error:", e);
            }
          }}
          title={isMicrophoneEnabled ? "Mute" : "Unmute"}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            {isMicrophoneEnabled ? (
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z M17.3 11c0 2.59 1.54 4.84 3.76 5.92v2.08h2V17c2.44-1.71 4-4.39 4-7.5h-2c0 2.21-1.13 4.15-2.82 5.29v-1.79c1.84-1.18 3.02-3.24 3.02-5.5H17.3z M3 9v6h4l5 5V4L7 9H3z" />
            ) : (
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L21.714504,3.67175564 C21.5575352,2.72916153 20.8563168,1.97788954 19.9145039,1.97788954 L4.13399899,0.0 C3.50612381,-0.0 2.40999575,0.106446701 1.77946707,0.58775485 C0.994623095,1.22131415 0.837654294,2.31033509 1.15159189,3.09583190 L3.03521743,9.53682488 C3.03521743,9.69392228 3.03521743,9.85101969 3.50612381,9.85101969 L16.6915026,10.6365066 C16.6915026,10.6365066 17.1624089,10.6365066 17.1624089,11.0578147 C17.1624089,11.4791228 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
            )}
          </svg>
          <span>{isMicrophoneEnabled ? "Mute" : "Unmute"}</span>
        </button>

        {/* Camera Toggle */}
        <button
          className={`control-btn ${isCameraEnabled ? "active" : ""}`}
          onClick={() => {
            try {
              camera.toggle();
            } catch (e) {
              console.error("Camera toggle error:", e);
            }
          }}
          title={isCameraEnabled ? "Stop Video" : "Start Video"}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            {isCameraEnabled ? (
              <path d="M17 10.5V7c0 .55-.45 1-1 1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            ) : (
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-5-14h-3.5v4H10v3h2.5v3H16V8h-5V5z" />
            )}
          </svg>
          <span>{isCameraEnabled ? "Video On" : "Video Off"}</span>
        </button>

        {/* Participants Count */}
        <div className="participants-badge">👥 {participants?.length || 1}</div>
      </div>
    </div>
  );
}

function VideoRoom({ apiKey, token, userId, callId }) {
  const clientRef = useRef(null);
  const callRef = useRef(null);
  const joinedRef = useRef(false);

  const [error, setError] = useState("");
  const [cameraWarning, setCameraWarning] = useState("");

  // Initialize client and call only once
  if (!clientRef.current) {
    clientRef.current = new StreamVideoClient({
      apiKey,
      user: { id: userId, name: userId },
      token,
    });
  }

  if (!callRef.current) {
    callRef.current = clientRef.current.call("default", callId);
  }

  const client = clientRef.current;
  const call = callRef.current;

  // Check device permissions and availability
  useEffect(() => {
    const checkDevices = async () => {
      try {
        const result = await navigator.mediaDevices.enumerateDevices();
        const hasVideo = result.some((device) => device.kind === "videoinput");
        const hasAudio = result.some((device) => device.kind === "audioinput");

        if (!hasVideo) {
          setCameraWarning("⚠️ No camera found on this device");
        }
        if (!hasAudio) {
          setCameraWarning((prev) =>
            prev ? prev + " | No microphone found" : "⚠️ No microphone found",
          );
        }
      } catch (err) {
        console.error("Permission check error:", err);
      }
    };

    checkDevices();
  }, []);

  // Join call only once
  useEffect(() => {
    if (joinedRef.current) return; // Prevent joining multiple times

    joinedRef.current = true;
    let isMounted = true;

    async function join() {
      try {
        const joinPromise = call.join({ create: true });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Join timeout")), 10000),
        );

        await Promise.race([joinPromise, timeoutPromise]);

        if (!isMounted) return;

        // Try to enable camera with error handling
        try {
          await call.camera.enable();
        } catch (camErr) {
          console.warn("Camera enable failed:", camErr);
          if (isMounted) {
            setCameraWarning("📷 Camera not available. Audio-only mode.");
          }
        }

        // Try to enable microphone
        try {
          await call.microphone.enable();
        } catch (micErr) {
          console.warn("Microphone enable failed:", micErr);
        }
      } catch (err) {
        console.error("Failed to join call:", err);
        if (!isMounted) return;

        if (err.message.includes("timeout")) {
          setError("Connection timeout. Backend might be down or slow.");
        } else if (
          err.message.includes("NotReadableError") ||
          err.message.includes("NotAllowedError")
        ) {
          setError(
            "Camera/microphone error. They may be in use by another app or permission denied.",
          );
        } else if (err.message.includes("Illegal State")) {
          setError("Call already in progress. Reload the page.");
        } else {
          setError("Failed to join call. Check credentials and backend.");
        }
      }
    }

    join();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - run only once

  const handleLeave = async () => {
    try {
      await call.leave();
      window.location.reload();
    } catch (e) {
      console.error("Leave error:", e);
    }
  };

  return (
    <div className="vr-root">
      <header className="vr-header">
        <div className="vr-info">
          <div className="vr-title">
            Room: <span className="vr-id">{callId}</span>
          </div>
          <div className="vr-user">👤 {userId}</div>
        </div>
        <button className="vr-leave" onClick={handleLeave}>
          ✕ Leave
        </button>
      </header>

      {error && <div className="vr-error">{error}</div>}
      {cameraWarning && <div className="vr-warning">{cameraWarning}</div>}

      <StreamVideo client={client}>
        <StreamCall call={call}>
          <div className="vr-layout">
            <SpeakerLayout />
          </div>

          <CustomControlBar />
        </StreamCall>
      </StreamVideo>
    </div>
  );
}

export default VideoRoom;
