import { Express } from "express";
import startServer from "./app";
import { config } from "./config";
import logger from "./lib/logger";
import { Server, IncomingMessage, ServerResponse } from "http";
import {
  closeConnection as closeMongoConnection,
  initializeConnection as initializeMongoConnection,
} from "./lib/mongo";
import { closeKafka, initializeKafka } from "./lib/kafka";

const { serverPort } = config;

let app: Express;
let server: Server<typeof IncomingMessage, typeof ServerResponse>;

const shutdownGracefully = async (): Promise<void> => {
  // gracefully shutdown the server
  await closeMongoConnection();
  await closeKafka();
  server.close();
};

const initializeServices = async (): Promise<void> => {
  await initializeMongoConnection();
  await initializeKafka();
};

const main = async () => {
  app = await startServer();
  await initializeServices();

  server = app.listen(serverPort, () => {
    logger.info(`Server listening on port ${serverPort}`);
  });

  process.on("SIGTERM", shutdownGracefully);
};

main()
  .then(() => {
    logger.info("Application started successfully");
  })
  .catch((error) => {
    logger.error(error);
  });
