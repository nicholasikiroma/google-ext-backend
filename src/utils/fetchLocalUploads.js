import { existsSync, createReadStream, statSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { readdir } from "fs/promises";
import { BASE_URL } from "../config/baseConfig.js";
import { logger } from "../config/logger.js";
import { APIError, HttpStatusCode } from "./error.js";

// Define a storage directory for video files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
const videoStorageDirectory = path.join(__dirname, "videos");

/**
 * Fetches all videos from local storage.
 *
 * @returns {Object[]} An array of objects representing video files.
 * @throws {Error} If there is an error reading the directory.
 */
export async function fetchAllVideos() {
  try {
    const files = await readdir(videoStorageDirectory);
    const fileLinks = [];

    for (const file of files) {
      const videoPath = path.join(videoStorageDirectory, file);
      const size = statSync(videoPath);

      if (size.size === 0) {
        continue; // Skip files with size 0 bytes
      }
      const sessionId = file.split(".")[0];
      fileLinks.push({
        filename: file,
        videoUrl: `${BASE_URL}/api/videos/${sessionId}`,
      });
    }

    return fileLinks;
  } catch (err) {
    next(err);
  }
}

/**
 * Fetches a video file by its filename and optionally supports range requests.
 *
 * @param {string} fileName - The name of the video file to fetch.
 * @param {string|null} range - An optional HTTP range request header (e.g., 'bytes=0-999').
 *
 * @returns {Object} An object containing the file stream, file size, and related information.
 *
 * @throws {Error} If the file is not found or if there is an error while processing the request.
 */
export async function fetchFile(fileName, range = null) {
  const videoPath = path.join(videoStorageDirectory, fileName);
  if (existsSync(videoPath)) {
    logger.info("File exists");
    const stat = statSync(videoPath);
    const fileSize = stat.size;
    if (fileSize === 0) {
      throw new APIError(
        "INTERNAL SERVER ERROR",
        HttpStatusCode.INTERNAL_SERVER,
        true,
        "File is empty or corrupted"
      );
    }
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const fileStream = createReadStream(videoPath, { start, end });
      return { fileStream, chunkSize, start, end, fileSize };
    } else {
      const file = createReadStream(videoPath);
      return { file, fileSize };
    }
  } else {
    throw new APIError(
      "NOT FOUND",
      HttpStatusCode.NOT_FOUND,
      true,
      "Recording not found"
    );
  }
}
