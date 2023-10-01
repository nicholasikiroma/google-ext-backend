import { Readable } from "stream";
import { Buffer } from "buffer";
import {
  createVideoStream,
  generateUniqueSessionId,
} from "../utils/helpers.js";

//@desc Start recording session with backend
//@route POST /start-recording
//@access public
export const startRecording = async (req, res, next) => {
  try {
    // Generate a unique session ID (you can use a UUID library for this)
    const sessionId = generateUniqueSessionId();

    // Store the session ID temporarily
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

    // Write the data chunk to the video stream\
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
      res.status(200).json({ message: "Recording stopped and saved" });
    }, 5000);
    // Close the video stream to finalize the video file
  } else {
    res.status(400).json({ error: "Invalid session ID" });
  }
};
