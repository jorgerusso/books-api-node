// test/mongo.ts (for in-memory MongoDB setup)
import { MongoClient, Db, Collection } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

// In-memory MongoDB setup
let mongoServer: MongoMemoryServer;
let mongoClient: MongoClient;
let mongoDatabase: Db;

export const connectMongo = async (): Promise<void> => {
  // Start the in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory MongoDB instance
  mongoClient = new MongoClient(uri);
  await mongoClient.connect();

  // Get the database
  mongoDatabase = mongoClient.db();
};

export const disconnectMongo = async (): Promise<void> => {
  // Close the connection to the in-memory MongoDB instance
  await mongoClient.close();
  await mongoServer.stop();
};

export const getCollection = <T extends Document>(
  collectionName: string,
): Collection<T> => {
  // Return the in-memory MongoDB collection
  return mongoDatabase.collection<T>(collectionName);
};

export { mongoClient, mongoDatabase };
