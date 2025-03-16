import { ObjectId } from "mongodb";
import { getCollection, COLLECTIONS } from "../../lib/mongo";
import { IBook, IBookDocument } from "../../types";

export const updateBook = async (
  id: string,
  updatedBook: IBook,
): Promise<void> => {
  const booksCollection = getCollection<IBookDocument>(COLLECTIONS.BOOKS);

  await booksCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedBook },
  );
};
