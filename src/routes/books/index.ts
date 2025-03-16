import express, { Request, Response, Router } from "express";
import { getBookById } from "../../queries/books";
import { updateBook } from "../../commands/books";
import { IBook } from "../../types";
import { ValidationError } from "../../exceptions/appError";
import { NextFunction } from "express-serve-static-core";
import { sendMessageToBooksTopic } from "../../lib/kafka";
import { transformIncomingBook } from "../../features/books/transforms";

const router: Router = express.Router();

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const currentBook = await getBookById(id);
  if (!currentBook) {
    return next(
      new ValidationError(404, "Book does not exist", [
        {
          field: "id",
          message: "Book does not exist",
        },
      ]),
    );
  }

  const newBook: IBook = {
    ...currentBook,
    ...transformIncomingBook(req.body),
  };

  await updateBook(id, newBook);

  await sendMessageToBooksTopic("update", id, {});

  res.status(204).end();
});

export default router;
