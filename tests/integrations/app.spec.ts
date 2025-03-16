import request from "supertest";
import { Server } from "http";
import { Express } from "express";
import startServer from "../../src/app";
import { INSERT_BOOK_MUTATION } from "./mutations";
import { getCollection } from "../../src/lib/mongo";
import { connectMongo, disconnectMongo, mongoDatabase } from "../mongo";

jest.mock("../../src/lib/kafka", () => ({
  initializeKafka: jest.fn().mockResolvedValue(true),
  closeKafka: jest.fn().mockResolvedValue(true),
}));

let app: Express;
let server: Server;

jest.mock("../../src/lib/mongo", () => {
  const original = jest.requireActual("../../src/lib/mongo");

  return {
    ...original,
    getCollection: jest.fn(),
  };
});

beforeAll(async () => {
  await connectMongo();

  const mockCollection = mongoDatabase.collection("books");
  (getCollection as jest.Mock).mockReturnValue(mockCollection);

  app = await startServer();
  server = app.listen(4000);
});

afterAll(async () => {
  await server.close();
  await disconnectMongo();
});

describe("Graphql post /books", () => {
  it("should insert a new book", async () => {
    const newBook = {
      title: "New Book",
      description: "This is a new book",
      author: "Jane Doe",
    };

    const response = await request(server)
      .post("/graphql") // GraphQL endpoint
      .send({
        query: INSERT_BOOK_MUTATION,
        variables: {
          input: newBook,
        },
      });
    expect(200);
    // Expect success status code

    const { insertBook } = response.body.data;

    expect(insertBook).toBeTruthy();
    expect(insertBook.title).toBe(newBook.title);
    expect(insertBook.author).toBe(newBook.author);
  });
});
