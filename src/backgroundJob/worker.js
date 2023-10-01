import { connect } from "amqplib";
import transcribeAI from "./transcribe";

const queueName = "VideoTrancription";

const transcribeVideo = async () => {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  console.log(`waiting for message in queue: ${queueName}`);
  channel.prefetch(1);
  channel.consume(
    queueName,
    async (video) => {
      // process video here
      console.log("[x] Received video file for transcription");
      const transcribedText = await transcribeAI(video);
      console.log("Transcribing...");
      if (transcribedText) {
        console.log("Trancription completed: ", transcribedText);
        channel.ack(video);
      }
    },
    { noAck: false }
  );
};

transcribeVideo();
