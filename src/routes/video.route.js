import { Router } from "express";
import {
  recordData,
  startRecording,
  stopRecordingData,
} from "../controllers/file.controller.js";

const router = Router();

// Create recording session with backend
router.post("/start-recording", startRecording);

// Write chunks of recorded data to file
router.post("/record-data/:sessionId", recordData);

// Finalize write to file and save video
router.post("/stop-recording/:sessionId", stopRecordingData);

// Fetch single video (not implemented)
// router.get("/videos/:id", fetchSingleVideo);

export default router;
