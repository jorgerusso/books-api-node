import pino from "pino";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty", // Makes logs more readable in console
  },
});

export default logger;
