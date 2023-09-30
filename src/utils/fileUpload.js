import multer from "multer";
import { v2 as cloudinary  } from 'cloudinary';
import { CLOUD_NAME, API_KEY, SECRET_KEY } from '../configs/baseConfig.js'

// configure cloudinary
cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: API_KEY,
	api_secret: SECRET_KEY,
});

// configure storage location for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const export uploadUtil = multer({ storage: multerStorage });

export const uploadCloud = async (filePath, fileName) => {
	const video = await cloudinary.uploader.upload(
		filePath,
		{
			resource_type: "video",
			public_id: `/videoUploads/${fileName}`,
			chunk_size: 6000000,
		},
	)
	return video
}
