import { Router } from "express";
import {
  recordData,
  startRecording,
  stopRecordingData,
  fetchSingleVideo,
  fetchVideos,
  fetchVideoDetail,
} from "../controllers/file.controller.js";

const router = Router();

// Create recording session with backend
router.post("/start-recording", startRecording);

// Write chunks of recorded data to file
router.post("/record-data/:sessionId", recordData);

// Finalize write to file and save video
router.post("/stop-recording/:sessionId", stopRecordingData);

// play video
router.get("/videos/:sessionId", fetchSingleVideo);

// Fetch video detail
router.get("/videos/:sessionId/details", fetchVideoDetail);

router.get("/videos", fetchVideos);

export default router;
