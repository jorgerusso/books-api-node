export class ValidationError extends Error {
  code: number;
  errors: { field: string; message: string }[];

  constructor(
    code: number,
    message: string,
    errors: { field: string; message: string }[],
  ) {
    super(message);
    this.code = code;
    this.errors = errors;
  }
}
