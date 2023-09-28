import { Schema, model } from "mongoose";

const videosSchema = new Schema({
  fileName: {
    type: String,
    required: [true, "'Name' field cannot be blank"],
  },
  dateCreated: {
    type: Date,
    default: Date()
  }
});

const File = model("File", videosSchema);

export default File;
