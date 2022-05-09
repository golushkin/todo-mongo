import { Response, Request } from "express"
import TodoModel from "../db/TodoModel"
import ApiHandler from "../helpers/ApiHandler"

const todoModel = new TodoModel()

export const createTodo = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const { body } = req
  
  try {
    const user = await todoModel.create(body);

    apiHandler.sendSuccess(user, 201)
  } catch (error) {
    apiHandler.sendFailure(error.message)
  }
}

export const getTodo = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const id = req.params.id;

  try {
    const user = await todoModel.getById(id);
    apiHandler.sendSuccess(user)
  } catch (error) {
    apiHandler.sendFailure(error.message)
  }
}


export const getTodos = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const { limit, offset } = req.query

  const offsetNumber = +offset || 0
  const limitNumber = +limit || 10

  try {
    const user = await todoModel.getAll(offsetNumber, limitNumber);
    apiHandler.sendSuccess(user)
  } catch (error) {
    apiHandler.sendFailure(error.message)
  }
}
