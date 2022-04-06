import { IComment } from "./commentModel";
import { IUser } from "./userModel";

export interface ITodo {
  id: string;
  text: string;
  creator: IUser['id'];
  assignedTo: IUser['id'];
  comments: IComment[];
  state: null | string;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
}