import File from "../models/file.model.js";
import { BASE_URL, isDevelopment } from "../config/baseConfig.js";
import { fetchAllVideos, fetchFile } from "../utils/fetchLocalUploads.js";
import uploadCloud from "../utils/fileUpload.js"

//@desc Return all locally stored videos to client
//@route GET /api/videos
//@access public
export const fetchVideos = async (req, res, next) => {
  if (isDevelopment) {
    try {
      const videos = await fetchAllVideos();
      if (videos) return res.status(200).send({ data: videos });
    } catch (err) {
      next(err);
    }
  } else {
    // write code for production
    try {
      const videos = await File.find();
      res.send({ data: videos });
    } catch (err) {
      next(err);
    }
  }
};

//@desc Return a single video based in Node enviroment
//@route GET /api/videos
//@access public
export const fetchSingleVideo = async (req, res, next) => {
  const { fileName } = req.params;
  const range = req.headers.range;

  if (isDevelopment) {
    if (!fileName) {
      const err = new Error("File name is missing");
      res.status(400);
      next(err);
    }

    if (range) {
      const { fileStream, chunkSize, start, end, fileSize } = await fetchFile(
        fileName,
        range
      );

      const head = {
        "Content-Type": "video/mp4",
        "Content-Length": chunkSize,
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accepted-Ranges": "bytes",
      };
      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const { file, fileSize } = await fetchFile(fileName);
      const head = {
        "Content-Type": "video/mp4",
        "Content-Length": fileSize,
      };
      res.writeHead(200, head);
      file.pipe(res);
    }
  } else {
    // write code to use cloudinary
    const video = await File.findOne({ fileName: fileName });
    if (video) {
      res.send(video.videoUrl);
    } else {
      res.status(404);
      const err = new Error("Video not found");
      next(err);
    }
  }
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
    if (isDevelopment) {
      res
        .status(200)
        .send({ message: "File uploaded successfully", data: req.file });
    } else {
      // store to cloudinary and create entry in DB
	  const { video } = uploadCloud(req.file.path, req.file.originalname)

      const data = {
		publicId: video.public_id,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        videoUrl: video.secure_url, // change to cloudinary secure url
        mimeType: req.file.mimetype,
      };
      try {
        const newVideo = new File({ ...data });
        await newVideo.save();
        res.status(201).send({ data: newVideo });
      } catch (err) {
        res.status(500);
        next(err);
      }
    }
  }
};
