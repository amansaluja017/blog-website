import amqp from "amqplib";

let channel: amqp.Channel | null = null;

async function connect() {
  const conn = await amqp.connect(process.env.RABBIT_URL!);
  channel = await conn.createChannel();
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
