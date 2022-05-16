import { IComment } from "./commentModel";
import { IUser } from "./userModel";

export type ITodo = {
  _id: string;
  title: string;
  creator: IUser["_id"];
  assignedTo: IUser["_id"];
  comments: IComment[];
  state: null | string;
  expireAt: string;
  createdAt: string;
  updatedAt: string;
}


export type ITodoLinked = Omit<ITodo, "creator" | "assignedTo"> & {
  creator: IUser;
  assignedTo: IUser;
}