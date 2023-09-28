import { Router } from "express";
import {
  fetchSingleVideo,
  fetchVideos,
  uploadVideos,
} from "../controllers/file.controller.js";
import uploadUtil from "../utils/fileUpload.js";

const router = Router();

// Fetch All videos
router.get("/videos", fetchVideos);

// Fetch single video
router.get("/videos/:fileName", fetchSingleVideo);

// Upload videos
router.post("/videos", uploadUtil.single("video-uploads"), uploadVideos);

export default router;
