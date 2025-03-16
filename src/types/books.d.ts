import { ObjectId } from "mongodb";

export type IBookDocument = IBook & Document;

export interface IBook {
  _id?: ObjectId;
  title: string;
  author: string;
  description?: string;
  numberOfUpdates?: number;
}

export interface InsertBookMutation {
  title: string;
  author: string;
  description?: string;
}
