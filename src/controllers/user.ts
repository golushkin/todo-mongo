import { Response, Request } from "express"
import UserModel from "../db/UserModel"
import ApiHandler from "../helpers/ApiHandler"

const userModel = new UserModel()

export const createUser = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const { body } = req

  try {
    const user = await userModel.create(body);

    apiHandler.sendSuccess(user, 201)
  } catch (error) {
    apiHandler.sendFailure(error.message)
  }
}

export const getUser = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const id = req.params.id;
 
  try {
    const user = await userModel.getById(id);

    apiHandler.sendSuccess(user)
  } catch (error) {
    apiHandler.sendFailure(error.message)
  }
}

