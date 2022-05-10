import { Db } from "mongodb"
import TodoModel from "../src/db/TodoModel"
import UserModel from "../src/db/UserModel"
import { ITodo } from "../src/types/todoModel"

const userModel = new UserModel()
const todoModel = new TodoModel()

export const expectSuccessBody = (body: any) => {
  expect(typeof body).toBe("object")
  expect(body).toHaveProperty("success")
  expect(body).toHaveProperty("data")
}

export const expectDataHasTodoProps = (data: any) => {
  expect(typeof data).toBe("object")
  expect(data).toHaveProperty("_id")
  expect(data).toHaveProperty("creator")
  expect(data).toHaveProperty("assignedTo")
  expect(data).toHaveProperty("comments")
  expect(data).toHaveProperty("state")
  expect(data).toHaveProperty("expireAt")
  expect(data).toHaveProperty("createdAt")
  expect(data).toHaveProperty("updatedAt")
}

export const createUser = async (userName?: "test") => {
  const payload = { userName }
  const result = await userModel.create(payload);

  return result.insertedId.toString()
}

export const addDays = (date: Date, add = 1) => {
  date.setDate(date.getDate() + add)
  return date
}

export const truncteAllCollections = async(db: Db) => {
  const collections = await db.collections()
  const promises = collections.map(collection => collection.deleteMany({}))

  await Promise.all(promises)
}

export const getTodoPayload = (userId: string, title: string) => {
  const isoDay = (new Date()).toISOString()

  const payload:Omit<ITodo, "_id"> = {
    title,
    creator: userId,
    assignedTo: userId,
    comments: [],
    state: "test",
    expireAt: addDays(new Date()).toISOString(),
    createdAt: isoDay,
    updatedAt: isoDay
  }

  return payload
}

export const createToDos = async (userId: string, numberOfTodo = 1) => {
  const createTodoPromises = []

  for (let index = 0; index < numberOfTodo; index++) {
    const todo = getTodoPayload(userId, `title-${index}`);
    createTodoPromises.push(todoModel.create(todo))
  }

  await Promise.all(createTodoPromises)
}