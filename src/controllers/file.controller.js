import { Readable } from "stream";
import { Buffer } from "buffer";
import { BASE_URL } from "../config/baseConfig.js";
import { fetchAllVideos, fetchFile } from "../utils/fetchLocalUploads.js";
import {
  createVideoStream,
  generateUniqueSessionId,
} from "../utils/helpers.js";
import File from "../models/file.model.js";
import { APIError } from "../utils/error.js";
import { HttpStatusCode } from "../utils/error.js";
import { logger } from "../config/logger.js";
import queueVideo from "../backgroundJob/taskQueue.js";
import path from "path";
import { fileURLToPath } from "url";

// An object to store active session IDs
const activeSessions = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
const videoStorageDirectory = path.join(__dirname, "videos");

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
    logger.info("File created for recording session");
    res.status(HttpStatusCode.OK).json({ sessionId });
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

    logger.info("Convert data to binary...");
    const binaryData = Buffer.from(jsonString.dataChunk, "base64");

    logger.info("Read binary stream");
    const readableStream = Readable.from(binaryData);

    readableStream.on("data", (chunk) => {
      logger.info("write incoming chunk to file");
      videoStream.write(chunk);
    });

    readableStream.on("end", () => {
      logger.info("Data written successfully");
      res
        .status(HttpStatusCode.OK)
        .json({ message: "Data received and saved" });

      readableStream.on("error", (error) => {
        logger.fatal("Failed to write chunk to file", error);
        next(error);
      });
    });
  } else {
    throw new APIError(
      "BAD REQUEST",
      HttpStatusCode.BAD_REQUEST,
      true,
      "Invalid session ID"
    );
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
    const data = {
      sessionId: sessionId,
      videoUrl: `${BASE_URL}/api/videos/${sessionId}`,
      mimeType: "video/webm",
    };
    const recording = new File({ ...data });
    try {
      await recording.save();
      logger.info("Saving file to DB...");
    } catch (error) {
      logger.error("Error occured during save", error);
      next(error);
    }
    logger.info("Writing final chunk to file");
    setTimeout(() => {
      videoStream.end();
      logger.info("File saved successfully");
    }, 4000);

    const msg = {
      sessionId: sessionId,
      videoPath:
        `${path.join(videoStorageDirectory)}` + "/" + `${sessionId}` + ".webm",
    };

    logger.info("Video for queuing: ", msg.sessionId, msg.videoPath);
    await queueVideo("transcribeQueue", JSON.stringify(msg));

    res.status(HttpStatusCode.OK).send({
      message: "Recording stopped and saved",
      data: recording,
    });
    // Close the video stream to finalize the video file
  } else {
    throw new APIError(
      "BAD REQUEST",
      HttpStatusCode.BAD_REQUEST,
      true,
      "Invalid session ID"
    );
  }
};

//@desc Return a single video based in Node enviroment
//@route GET /api/videos/:sessionId
//@access public
export const fetchSingleVideo = async (req, res, next) => {
  const { sessionId } = req.params;
  const range = req.headers.range;

  const video = await File.findOne({ sessionId: sessionId });
  if (video !== undefined && video !== null) {
    const fileName = sessionId + "." + "webm";
    if (range) {
      const { fileStream, chunkSize, start, end, fileSize } = await fetchFile(
        fileName,
        range
      );

      // Validate that the destructured data is not undefined
      if (
        fileStream !== undefined &&
        chunkSize !== undefined &&
        start !== undefined &&
        end !== undefined &&
        fileSize !== undefined
      ) {
        const head = {
          "Content-Type": "video/webm",
          "Content-Length": chunkSize,
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accepted-Ranges": "bytes",
        };
        res.writeHead(206, head);
        fileStream.pipe(res);
      } else {
        throw new APIError(
          "INTERNAL SERVER ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          true,
          "Failed to fetch video file data"
        );
      }
    } else {
      const { file, fileSize } = await fetchFile(fileName);

      // Validate that the destructured data is not undefined
      if (file !== undefined && fileSize !== undefined) {
        const head = {
          "Content-Type": "video/webm",
          "Content-Length": fileSize,
        };
        res.writeHead(HttpStatusCode.OK, head);
        file.pipe(res);
      } else {
        throw new APIError(
          "INTERNAL SERVER ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          true,
          "Failed to fetch video file data"
        );
      }
    }
  } else {
    throw new APIError(
      "BAD REQUEST",
      HttpStatusCode.BAD_REQUEST,
      true,
      "Recording Session not found"
    );
  }
};

//@desc Return all locally stored videos to client
//@route GET /api/videos
//@access public
export const fetchVideos = async (req, res, next) => {
  try {
    const videos = await File.find();

    if (videos) {
      return res.status(200).send({ data: videos });
    } else {
      res.status(400).send({ message: "videos not found" });
    }
  } catch (err) {
    next(err);
  }
};

//@desc Return details of a video
//@route GET /api/videos/:sessionId/details
//@access public
export const fetchVideoDetail = async (req, res, next) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    throw new APIError(
      "BAD REQUEST",
      HttpStatusCode.BAD_REQUEST,
      true,
      "sessionId is missing"
    );
  }
  try {
    const video = await File.findOne({ sessionId: sessionId });
    if (video) {
      res.status(HttpStatusCode.OK).send({ data: video });
    } else {
      throw new APIError(
        "NOT FOUND",
        HttpStatusCode.NOT_FOUND,
        true,
        "Recording not foun"
      );
    }
  } catch (err) {
    res.status(400);
    next(err);
  }
};

//@desc Return details of a video
//@route GET /api/videos/:sessionId/details
//@access public
export const deleteRecord = async (req, res, next) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    throw new APIError(
      "BAD REQUEST",
      HttpStatusCode.BAD_REQUEST,
      true,
      "SessionId is missing"
    );
  }
  try {
    const video = await File.findOneAndDelete({ sessionId: sessionId });
    if (video) {
      res.status(200).send({ data: video });
    } else {
      res.status(404).send({ error: "video not found" });
    }
  } catch (err) {
    next(err);
  }
};
