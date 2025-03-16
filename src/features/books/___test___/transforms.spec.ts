import { IBook } from "../../../types";
import { transformIncomingBook } from "../transforms";

describe("transformIncomingBook", () => {
  it("should trim spaces from title, description, and author", () => {
    const inputBook: IBook = {
      title: "  The Great Gatsby  ",
      description: "  A classic novel.  ",
      author: "  F. Scott Fitzgerald  ",
    };

    const expectedOutput: IBook = {
      title: "The Great Gatsby",
      description: "A classic novel.",
      author: "F. Scott Fitzgerald",
    };

    expect(transformIncomingBook(inputBook)).toEqual(expectedOutput);
  });

  it("should handle missing description", () => {
    const inputBook: IBook = {
      title: "  1984  ",
      description: undefined,
      author: "  George Orwell  ",
    };

    const expectedOutput: IBook = {
      title: "1984",
      description: undefined,
      author: "George Orwell",
    };

    expect(transformIncomingBook(inputBook)).toEqual(expectedOutput);
  });

  it("should handle empty strings", () => {
    const inputBook: IBook = {
      title: "   ",
      description: "   ",
      author: "   ",
    };

    const expectedOutput: IBook = {
      title: "",
      description: "",
      author: "",
    };

    expect(transformIncomingBook(inputBook)).toEqual(expectedOutput);
  });
});
