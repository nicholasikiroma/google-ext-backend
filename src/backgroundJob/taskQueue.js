import { connect } from "amqplib";
import { RABBITMQ_URL } from "../config/baseConfig.js";
import { logger } from "../config/logger.js";

/**
 *
 */

const queueVideo = async (queueName, msg) => {
  const connection = await connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });
  logger.info("[x] Video queued for transcription");
  setTimeout(() => {
    connection.close();
  }, 500);
};

export default queueVideo;
