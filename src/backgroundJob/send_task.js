import { connect } from "amqplib";

const queueName = "VideoTrancription";
const video = null; //get video path

const sendVideo = async () => {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(video), { persistent: true });
  console.log("Video sent");
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendVideo();
