import { ObjectId } from "mongodb";
import { COLLECTIONS, getCollection } from "../../lib/mongo";
import { IBook, IBookDocument } from "../../types";

export const getBookById = async (id: string): Promise<IBook | null> => {
  const booksCollection = getCollection<IBookDocument>(COLLECTIONS.BOOKS);
  return booksCollection.findOne({ _id: new ObjectId(id) });
};
