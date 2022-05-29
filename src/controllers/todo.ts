import { Response, Request } from "express"
import config from "config"
import TodoModel from "../db/TodoModel"
import ApiHandler from "../helpers/ApiHandler"
import { Config } from "../types/config";

const { paginationLimit } = config.get<Config["options"]>("options");
const todoModel = new TodoModel()

const linkedQueryParam = "true"

export const createTodo = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const { body } = req
  
  try {
    const todo = await todoModel.create(body);

    apiHandler.sendSuccess(todo, 201)
  } catch (error) {
    apiHandler.sendFailure(error.message)
  }
}

export const getTodo = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const id = req.params.id;

  try {
    const todo = await todoModel.getById(id);
    apiHandler.sendSuccess(todo)
  } catch (error) {
    apiHandler.sendFailure(error.message)
  }
}


export const getTodos = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const { limit, offset, linked } = req.query

  const offsetNumber = +offset || 0
  const limitNumber = +limit || paginationLimit
  const isLinked = linked && linked === linkedQueryParam;

  try {
    const todos = await todoModel.getAll(offsetNumber, limitNumber, isLinked);
    apiHandler.sendSuccess(todos)
  } catch (error) {
    apiHandler.sendFailure(error.message)
  }
}

export const getTodosWithCursor = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const { limit, id, linked } = req.query

  const limitNumber = +limit || paginationLimit
  const isLinked = linked && linked === linkedQueryParam;

  try {
    const todos = await todoModel.getAllWithCursor(
      limitNumber,
      isLinked,
        id as string
    );
    apiHandler.sendSuccess(todos)
  } catch (error) {
    apiHandler.sendFailure(error.message)
  }
}

export const updateTodo = async (req: Request, res: Response) => {
  const apiHandler = new ApiHandler(req, res);
  const { body } = req

  try {
    const updateResult = await todoModel.updateOne(body);
    apiHandler.sendSuccess(updateResult)
  } catch (error) {
    apiHandler.sendFailure(error.message)
  }
}
