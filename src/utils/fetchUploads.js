import { existsSync, createReadStream } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { readdir } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
const __parentDirname = path.dirname(__dirname);
const videoDirectory = path.join(__parentDirname, "storage");

console.log(videoDirectory);

export async function fetchAllVideos() {
  try {
    const files = await readdir(videoDirectory);
    console.log(files);

    const fileLinks = files.map((file) => {
      return {
        filename: file,
        downloadLink: `/videos/${encodeURIComponent(file)}`,
      };
    });

    return fileLinks;
  } catch (err) {
    throw new Error("Failed to read directory: " + err.message);
  }
}

export async function fetchFile(fileName) {
  const videoPath = path.join(videoDirectory, fileName);
  if (existsSync(videoPath)) {
    const fileStream = createReadStream(videoPath);
    return fileStream;
  } else {
    throw new Error("File not found");
  }
}
