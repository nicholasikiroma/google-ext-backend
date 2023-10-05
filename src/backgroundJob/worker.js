import { config } from "dotenv";
import { connect } from "amqplib";
import OpenAI from "openai";
import fs from "fs";
import File from "../models/file.model.js";
import mongoose from "mongoose";

config({ path: "../../.env" });

await mongoose.connect(process.env.DB_URL);
const queueName = "transcribeQueue";

const consumeVideo = async () => {
  const connection = await connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  console.log(`Waiting for message in queue: ${queueName}`);
  channel.prefetch(1);
  channel.consume(
    queueName,
    async (msg) => {
      // Process video here
      console.log("[x] Received video file for transcription");
      const data = JSON.parse(msg.content);
      const { sessionId, videoPath } = data;

      try {
        const transcribedText = await transcribeAI(videoPath);
        console.log("Awaiting transcription results");
        console.log("\nTranscription: ", transcribedText);

        const recording = await File.findOneAndUpdate(
          { sessionId: sessionId },
          { transcriptions: transcribedText },
          { new: true }
        );

        console.log("Transcriptions and update complete", recording);
        channel.ack(msg);
      } catch (error) {
        console.error("Error processing recording: ", error);
        // An error occurred, negatively acknowledge and requeue the message
        channel.nack(msg);
      }
    },
    { noAck: false }
  );
};

// Transcriptions
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

async function transcribeAI(videoPath) {
  console.log("Sending file to OpenAI");
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(videoPath),
    model: "whisper-1",
  });

  return transcription.text;
}

consumeVideo();
