import convict from "convict";

interface IConfig {
  env: string;
  serverPort: number;
}

const convictConfig = convict<IConfig>({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  serverPort: {
    doc: "The port to bind the API.",
    format: "port",
    default: 3005,
    env: "SERVER_PORT",
  },
});

export const config: IConfig = {
  env: convictConfig.get("env"),
  serverPort: convictConfig.get("serverPort"),
};
