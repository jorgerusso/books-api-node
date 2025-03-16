import { COLLECTIONS, getCollection } from "../lib/mongo";
import { IBook, IBookDocument, InsertBookMutation } from "../types";

export const typeDefs = `
    type Book {
        _id: ID!
        title: String
        author: String
        description: String
        numberOfUpdates: Int
    }

    input InsertBook {
        title: String!
        author: String
        description: String
    } 

    type Query {
        books: [Book]
    }

    type Mutation {
        insertBook(input: InsertBook!): Book
    }   
`;

export const resolvers = {
  Query: {
    books: (): Promise<IBook[]> => {
      const booksCollection = getCollection<IBookDocument>(COLLECTIONS.BOOKS);
      return booksCollection.find().toArray();
    },
  },
  Mutation: {
    insertBook: async (
      _: unknown,
      { input }: { input: InsertBookMutation },
    ): Promise<IBook> => {
      const booksCollection = getCollection<IBookDocument>(COLLECTIONS.BOOKS);
      const book: IBook = {
        ...input,
        numberOfUpdates: 0,
      };
      await booksCollection.insertOne(book as IBookDocument);
      return book;
    },
  },
};
