import { Response, Request } from "express"
import UserModel from "../db/UserModel"
import ApiHandler from "../helpers/ApiHandler"

const userModel = new UserModel()

export const createUser = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const { body } = req
  const user = await userModel.create(body);

  apiHandler.sendSuccess(user, 201)
}

export const getUser = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const id = req.params.id;
  const user = await userModel.getById(id);

  apiHandler.sendSuccess(user)
}

