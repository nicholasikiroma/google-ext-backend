import { Readable } from "stream";
import { Buffer } from "buffer";
import { BASE_URL } from "../config/baseConfig.js";
import { fetchFile } from "../utils/fetchLocalUploads.js";
import {
  createVideoStream,
  generateUniqueSessionId,
} from "../utils/helpers.js";

// An object to store active session IDs
const activeSessions = {};

//@desc Start recording session with backend
//@route POST /start-recording
//@access public
export const startRecording = async (req, res, next) => {
  try {
    const sessionId = generateUniqueSessionId();

    activeSessions[sessionId] = {
      videoStream: createVideoStream(sessionId),
      mimetype: req.body.mimetype,
    };

    res.status(200).json({ sessionId });
  } catch (err) {
    next(err);
  }
};

//@desc Return a single video based in Node enviroment
//@route POST /record-data/:sessionId
//@access public
export const recordData = async (req, res, next) => {
  const { sessionId } = req.params;
  // Check if the session ID exists and is active
  if (activeSessions[sessionId]) {
    const { videoStream } = activeSessions[sessionId];

    // Write the data chunk to the video stream
    const jsonString = req.body;
    const binaryData = Buffer.from(jsonString.dataChunk, "base64");

    const readableStream = Readable.from(binaryData);

    readableStream.on("data", (chunk) => {
      videoStream.write(chunk);
    });

    readableStream.on("end", () => {
      console.log("Data written successfully");
      res.status(200).json({ message: "Data received and saved" });
    });
  } else {
    res.status(400).json({ error: "Invalid session ID" });
  }
};

//@desc Stop recording and save data
//@route POST /stop-recording/:sessionId
//@access public
export const stopRecordingData = async (req, res, next) => {
  const { sessionId } = req.params;
  // Check if the session ID exists and is active
  if (activeSessions[sessionId]) {
    const { videoStream } = activeSessions[sessionId];

    setTimeout(() => {
      videoStream.end();

      res.status(200).json({
        message: "Recording stopped and saved",
        videoURL: `${BASE_URL}/api/videos/${sessionId}`,
      });
    }, 5000);
    // Close the video stream to finalize the video file
  } else {
    res.status(400).json({ error: "Invalid session ID" });
  }
};

//@desc Return a single video based in Node enviroment
//@route GET /api/videos/:id
//@access public
export const fetchSingleVideo = async (req, res, next) => {
  const { sessionId } = req.params;
  const range = req.headers.range;
  if (activeSessions[sessionId]) {
    const fileName = sessionId + "." + "webm";
    if (range) {
      const { fileStream, chunkSize, start, end, fileSize } = await fetchFile(
        fileName,
        range
      );

      const head = {
        "Content-Type": "video/webm",
        "Content-Length": chunkSize,
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accepted-Ranges": "bytes",
      };
      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const { file, fileSize } = await fetchFile(fileName);
      const head = {
        "Content-Type": "video/webm",
        "Content-Length": fileSize,
      };
      res.writeHead(200, head);
      file.pipe(res);
    }
  } else {
    const err = new Error("Session does not exist");
    res.status(400);
    next(err);
  }
};
