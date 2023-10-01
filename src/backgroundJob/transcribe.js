import { Configuration, OpenAIApi } from "openai";
import path from "path";
import { createReadStream } from "fs/promises";
import { API_KEY } from "../config/baseConfig.js";

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

async function transcribeAI(filename) {
  try {
    const transcript = await openai.createTranscription(
      createReadStream(filename),
      "whisper-1"
    );
    return transcript.data.text;
  } catch (error) {
    console.error(error);
  }
}

export default transcribeAI;
