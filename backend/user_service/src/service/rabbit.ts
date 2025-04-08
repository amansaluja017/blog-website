import amqp from "amqplib";
import { queues } from "../queues/queue";

let channel: amqp.Channel | null = null;

async function connect() {
  if (!process.env.RABBIT_URL) {
    throw new Error("RABBIT_URL environment variable is not defined");
  }
  const conn = await amqp.connect(process.env.RABBIT_URL);
  channel = await conn.createChannel();
  console.log("Connected to RabbitMQ");
  queues();
}

async function subscribeToQueue(
  queueName: string,
  callback: (message: string) => void
): Promise<void> {
  if (!channel) {
    await connect();
  }
  if (!channel) {
    throw new Error("Channel is not initialized");
  }
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      callback(msg.content.toString());
      channel!.ack(msg);
    }
  });
}

async function publishToQueue(
  queueName: string,
  message: string
): Promise<void> {
  if (!channel) {
    await connect();
  }
  if (!channel) {
    throw new Error("Channel is not initialized");
  }
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
}

export { subscribeToQueue, publishToQueue };
export default connect;
