import { v4 as UUID } from "uuid";
import { createWriteStream } from "fs";

// Helper function to create a video stream for a session
export function createVideoStream(sessionId, mimetype) {
  const videoPath = path.join(
    videoStorageDirectory,
    `${sessionId}.${mimetype}`
  );
  return createWriteStream(videoPath, { flags: "a" });
}

// Helper function to generate a unique session ID (you can use a UUID library)
export function generateUniqueSessionId() {
  return UUID();
}
