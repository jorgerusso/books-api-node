import { EachMessagePayload } from "kafkajs";
import { COLLECTIONS, getCollection } from "../../lib/mongo";
import { IBookDocument } from "../../types";
import { ObjectId } from "mongodb";
import logger from "../../lib/logger";

const actionHandler: { [key: string]: (id: string) => Promise<void> } = {
  update: async (id: string) => {
    const booksCollection = getCollection<IBookDocument>(COLLECTIONS.BOOKS);

    await booksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { numberOfUpdates: 1 } },
    );
  },
};

export const onBookMessageHandler = async (
  payload: EachMessagePayload,
): Promise<void> => {
  const { headers, key } = payload.message;

  if (headers?.action && headers?.action.toString() in actionHandler) {
    await actionHandler[headers?.action as string](key!.toString());

    logger.info(`Book with id ${key} has been updated`);
  }
};
