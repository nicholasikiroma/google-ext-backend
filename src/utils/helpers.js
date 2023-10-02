import { v4 as UUID } from "uuid";
import { fileURLToPath } from "url";
import { createWriteStream, existsSync } from "fs";
import path from "path";

// Define a storage directory for video files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
const videoStorageDirectory = path.join(__dirname, "videos");

// Helper function to create a video stream for a session
export function createVideoStream(sessionId) {
  const videoPath = path.join(videoStorageDirectory, `${sessionId}.webm`);
  return createWriteStream(videoPath, { flags: "a" });
}

// Helper function to generate a unique session
export function generateUniqueSessionId() {
  return UUID();
}
