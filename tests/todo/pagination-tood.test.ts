/* eslint-disable max-len */
import request, { SuperTest, Test } from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import config from "config"
import { start } from "../../src"
import TodoModel from "../../src/db/TodoModel"
import DbHelper from "../../src/helpers/DbHelper"
import { 
  createUser, 
  expectSuccessBody,
  truncteAllCollections,
  createToDos,
  expectDataHasTodoProps,
  getTodoPayload,
  expectTodoIsLinked
} from "../helpers"
import { ITodo, ITodoLinked } from "../../src/types/todoModel"
import { Config } from "../../src/types/config"
import { TestResponseSuccess } from "../types/supertest"
const baseUrl = "/todo"

const todoModel = new TodoModel()
const numberOfTodos = 100
const { paginationLimit } = config.get<Config["options"]>("options")

jest.setTimeout(30_000);

const offsetPaginationWithParams = async(
  client: SuperTest<Test>,
  isLinked = false
) => {
  const result1 = await client.get(`${baseUrl}/offset?linked=${isLinked}`)
  
  expectSuccessBody(result1.body)
  expect(result1.status).toBe(200)
  
  const result1Data = result1.body.data as any[]
  expect(result1Data).toHaveLength(paginationLimit)

  const result2 = await client.get(
    `${baseUrl}/offset?offset=10&linked=${isLinked}`
  )
  
  expectSuccessBody(result2.body)
  expect(result2.status).toBe(200)

  const result2Data = result2.body.data as any[]
  expect(result2Data).toHaveLength(paginationLimit)

  const result1Ids = result1Data.map(todo => todo._id)
  const result2Ids = result2Data.map(todo => todo._id)
  const intersectIds = result1Ids.filter(value => result2Ids.includes(value))

  expect(intersectIds).toHaveLength(0)
  result1Data.forEach((todo, i) => expect(todo.title).toBe(`title-${i}`))
  result2Data.forEach(
    (todo, i) => expect(todo.title).toBe(`title-${i + paginationLimit}`)
  )

  return { result1Data, result2Data }
}

const cursorPaginationWithParams = async(
  client: SuperTest<Test>,
  isLinked = false
) => {
  const result1 = await client.get(`${baseUrl}/cursor?linked=${isLinked}`)
  
  expectSuccessBody(result1.body)
  expect(result1.status).toBe(200)
  
  const result1Data = result1.body.data as any[]
  expect(result1Data).toHaveLength(paginationLimit)
  const lastTodoId = result1Data[result1Data.length - 1]._id

  const result2 = await client.get(`${baseUrl}/cursor?id=${lastTodoId}&linked=${isLinked}`)
  
  expectSuccessBody(result2.body)
  expect(result2.status).toBe(200)

  const result2Data = result2.body.data as any[]
  expect(result2Data).toHaveLength(paginationLimit)

  const result1Ids = result1Data.map(todo => todo._id)
  const result2Ids = result2Data.map(todo => todo._id)
  const intersectIds = result1Ids.filter(value => result2Ids.includes(value))

  expect(intersectIds).toHaveLength(0)
  result1Data.forEach((todo, i) => expect(todo.title).toBe(`title-${i}`))
  result2Data.forEach(
    (todo, i) => expect(todo.title).toBe(`title-${i + paginationLimit}`)
  )

  return { result1Data, result2Data }
}

describe("Pagination todo", () => {
  let client: request.SuperTest<request.Test>
  let memoryServer: MongoMemoryServer
  let userId: string
  const userName = "test"
  
  beforeAll(async () => {
    memoryServer = await MongoMemoryServer.create({
      binary: { 
        version: "4.4.0" 
      } 
    })
    const app = await start(memoryServer.getUri())
    client = request(app)
  })

  afterAll(async() => {
    const db = await DbHelper.getDb()
    
    await db.dropDatabase();
    await DbHelper.disconnect()
    await memoryServer.stop()
  })

  beforeEach(async () => {
    const db = await DbHelper.getDb()
    await truncteAllCollections(db);

    userId = await createUser(userName);
    await createToDos(userId, numberOfTodos)
  })

  test("Should be success", async () => {
    const userId = await createUser()
    const payload = getTodoPayload(userId, "test")

    const { status, body } = await client.post(baseUrl).send(payload)
    
    expectSuccessBody(body)
    expect(status).toBe(201)
    expect(body.data).toHaveProperty("insertedId")

    const insertedId = body.data.insertedId
    const data = await todoModel.getById(insertedId)

    expect(JSON.parse(JSON.stringify(data))).toMatchObject(payload)
  })

  test("Should paginate through offset/limit without query params", async() => {
    const { status, body } = await client.get(`${baseUrl}/offset`)
    
    expectSuccessBody(body)
    expect(status).toBe(200)

    const { data } = body as TestResponseSuccess<ITodo[]>
    expect(data).toHaveLength(paginationLimit)
    const firstTodo = data[0]
    expectDataHasTodoProps(firstTodo)
  })

  test("Should paginate through offset/limit with query params", async () => {
    await offsetPaginationWithParams(client)
  })

  test("Should paginate through cursor without options", async() => {
    const { status, body } = await client.get(`${baseUrl}/cursor`)
    
    expectSuccessBody(body)
    expect(status).toBe(200)

    const { data } = body as TestResponseSuccess<ITodo[]>
    expect(data).toHaveLength(paginationLimit)
    const firstTodo = data[0]
    expectDataHasTodoProps(firstTodo)
  })

  test("Should paginate through cursor with options", async() => {
    await cursorPaginationWithParams(client)
  })

  test("Should get linked todos", async() => {
    const { status, body } = await client.get(`${baseUrl}/offset?linked=true`)
      
    expectSuccessBody(body)
    expect(status).toBe(200)
  
    const { data } = body as TestResponseSuccess<ITodoLinked[]>
    expect(data).toHaveLength(paginationLimit)
    const firstTodo = data[0]
    expectDataHasTodoProps(firstTodo)
    expectTodoIsLinked(firstTodo, userName)
  })

  test(
    "Should paginate through offset/limit with query params, linked", 
    async () => {
      const isLinked = true
      const {
        result1Data, 
        result2Data
      } = await offsetPaginationWithParams(client, isLinked)

      const firstTodo = result1Data[0] as ITodoLinked;
      const secondTodo = result2Data[0] as ITodoLinked
      expectTodoIsLinked(firstTodo, userName)
      expectTodoIsLinked(secondTodo, userName)
    }
  )

  test("Should paginate through cursor with options, linked", async() => {
    const isLinked = true
    const { result1Data, result2Data } = await cursorPaginationWithParams(client, isLinked)

    const firstTodo = result1Data[0] as ITodoLinked;
    const secondTodo = result2Data[0] as ITodoLinked
    expectTodoIsLinked(firstTodo, userName)
    expectTodoIsLinked(secondTodo, userName)
  })
})