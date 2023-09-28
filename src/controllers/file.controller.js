// import File from "../models/file.model";
import { fetchAllVideos, fetchFile } from "../utils/fetchUploads.js";

//@desc Return all locally stored videos to client
//@route GET /api/videos
//@access public
export const fetchVideos = async (req, res, next) => {
  try {
    const videos = await fetchAllVideos();
    if (videos) return res.status(200).send({ data: videos });
  } catch (err) {
    next(err);
  }
};

//@desc Return all locally stored videos to client
//@route GET /api/videos
//@access public
export const fetchSingleVideo = async (req, res, next) => {
  const { fileName } = req.params;
  if (!fileName) {
    const err = new Error("File name is missing");
    err.status_code = 404;
    next(err);
  }
  res.setHeader("Content-Type", "video/mp4");
  const file = await fetchFile(fileName);
  file.pipe(res);
};

//@desc Store uploaded video to local disk
//@route POST /api/videos
//@access public
export const uploadVideos = async (req, res, next) => {
  if (!req.file) {
    const err = new Error("Upload does not contain a file");
    res.status(400);
    next(err);
  } else {
    res
      .status(200)
      .send({ message: "File uploaded successfully", data: req.file });
  }
};
