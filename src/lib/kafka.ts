import { Kafka } from "kafkajs";
import { onBookMessageHandler } from "../messaging/books/consumer.handler";

const topic = "dev-books-manager-update";

const kafka = new Kafka({
  clientId: "books-manager-app",
  brokers: ["localhost:9092"], // Connects from outside Docker
});

const producer = kafka.producer({
  allowAutoTopicCreation: true,
});

const consumer = kafka.consumer({ groupId: "books-manager-group" });

export const initializeKafka = async (): Promise<void> => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: false });

  await consumer.run({
    eachMessage: onBookMessageHandler,
  });
};

export const sendMessageToBooksTopic = async (
  action: string,
  bookId: string,
  data: Record<string, unknown>,
): Promise<void> => {
  await producer.send({
    topic,
    messages: [
      {
        key: bookId,
        value: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
          id: bookId,
          createdAt: Date.now().toString(),
          action: action,
        },
      },
    ],
  });
};

export const closeKafka = async (): Promise<void> => {
  await producer.disconnect();
  await consumer.disconnect();
};
