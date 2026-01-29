// API Configuration
// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = "https://video-calling-website-yc99.onrender.com";
/**
 * Create a new call
 * @param {string} username - The user's name
 * @returns {Promise<Object>} - Call data with callId, token, apiKey, userId
 */
export async function createCall(username) {
  const response = await fetch(`${API_BASE_URL}/create-call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error("Failed to create call");
  }

  return response.json();
}

/**
 * Join an existing call
 * @param {string} username - The user's name
 * @param {string} callId - The call ID to join
 * @returns {Promise<Object>} - Call data with callId, token, apiKey, userId
 */
export async function joinCall(username, callId) {
  const response = await fetch(`${API_BASE_URL}/join-call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, callId }),
  });

  if (!response.ok) {
    throw new Error("Failed to join call");
  }

  return response.json();
}

export default {
  API_BASE_URL,
  createCall,
  joinCall,
};
