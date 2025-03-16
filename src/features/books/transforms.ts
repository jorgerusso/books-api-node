import { IBook } from "../../types";

export const transformIncomingBook = (book: IBook): IBook => {
  return {
    ...book,
    title: book.title.trim(),
    description: book.description?.trim(),
    author: book.author.trim(),
  };
};
