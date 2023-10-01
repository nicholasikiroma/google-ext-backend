import { Mongoose, Schema, model } from "mongoose";

const videosSchema = new Schema({
  fileName: {
    type: String,
    required: [true, "'Name' field cannot be blank"],
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  fileSize: {
    type: Number,
    required: [true, "File size must be provided"],
  },
  videoUrl: {
    type: String,
    required: [true, "Provide video url"],
  },
  mimeType: {
    type: String,
    required: [true, "Provide mimetype"],
  },
  transcriptions: {
    type: String,
    required: [false],
  },
});

const File = model("File", videosSchema);

export default File;
