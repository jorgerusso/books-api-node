import { ApolloServer } from "@apollo/server";
import cors from "cors";
import express, { json, Express, Request, Response } from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./graphql";
import { ValidationError } from "./exceptions/appError";
import { NextFunction } from "express-serve-static-core";
import booksRoutes from "./routes/books";

const startServer = async (): Promise<Express> => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await server.start();

  const app = express();

  app.use(json());
  app.use(cors<cors.CorsRequest>());

  app.use(
    "/graphql",
    // @ts-expect-error - The Express integration is not yet fully typed
    expressMiddleware(server),
  );

  const router = express.Router({ mergeParams: true });

  app.use("/api/books", router, booksRoutes);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- The error handler must have 4 parameters
  app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    if (err instanceof ValidationError) {
      res.status(err.code).json({
        message: err.message,
        errors: err.errors,
      });
      return;
    }

    res.status(500).json({ message: "Internal Server Error" });
  });

  return app;
};

export default startServer;
