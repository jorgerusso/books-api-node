import { MongoClient, Db, ReadPreference, Collection } from "mongodb";

type MongoDBCollections = "BOOKS";

export const COLLECTIONS = {
  BOOKS: "BOOKS" as const,
};

export const mongoDbCollections: Record<MongoDBCollections, string> = {
  [COLLECTIONS.BOOKS]: "books",
};

let mongoDatabase: Db;

const mongoService = new MongoClient("mongodb://localhost:27017/bookdb", {
  ignoreUndefined: true,
  readPreference: ReadPreference.PRIMARY_PREFERRED,
});

export const initializeConnection = async (): Promise<Db> => {
  await mongoService.connect();
  mongoDatabase = mongoService.db();
  return mongoDatabase;
};

export const closeConnection = async (): Promise<void> => {
  await mongoService.close();
};

export const getCollection = <T>(
  collection: MongoDBCollections,
): Collection<T & Document> => {
  return mongoDatabase.collection<T & Document>(mongoDbCollections[collection]);
};
