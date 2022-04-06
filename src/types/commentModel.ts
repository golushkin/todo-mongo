import { IUser } from "./userModel";

export interface IComment {
  id: string;
  creator: IUser['id'];
  createdAt: Date;
  updatedAt: Date;
}