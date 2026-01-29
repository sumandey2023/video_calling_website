import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("ERROR: STREAM_API_KEY or STREAM_API_SECRET not set in .env");
  process.exit(1);
}

// Helper to generate JWT token for Stream
function generateToken(userId) {
  const payload = {
    user_id: userId,
  };
  return jwt.sign(payload, apiSecret, { algorithm: "HS256" });
}

// Create Call
app.post("/create-call", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  const callId = uuidv4();
  const token = generateToken(username);

  res.json({
    callId,
    token,
    apiKey,
    userId: username,
  });
});

// Join Call
app.post("/join-call", (req, res) => {
  const { username, callId } = req.body;

  if (!username || !callId) {
    return res.status(400).json({ error: "Username and Call ID required" });
  }

  const token = generateToken(username);

  res.json({
    callId,
    token,
    apiKey,
    userId: username,
  });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
