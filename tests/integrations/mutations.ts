export const INSERT_BOOK_MUTATION = `
  mutation insertBook($input: InsertBook!) {
    insertBook(input: $input) {
      _id
      title
      author
      description
    }
  }
`;
