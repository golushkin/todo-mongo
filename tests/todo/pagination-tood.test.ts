import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { start } from "../../src"
import TodoModel from "../../src/db/TodoModel"
import DbHelper from "../../src/helpers/DbHelper"
import { 
  createUser, 
  expectSuccessBody,
  truncteAllCollections,
  getTodoPayload,
  createToDos,
  expectDataHasTodoProps
} from "../helpers"
import { TestResponseSuccess } from "../types/supertest"
import { ITodo } from "../../src/types/todoModel"

const baseUrl = "/todo"

const todoModel = new TodoModel()
const numberOfTodos = 100

jest.setTimeout(30_000);

describe("Pagination todo", () => {
  let client: request.SuperTest<request.Test>
  let memoryServer: MongoMemoryServer
  let userId: string
  
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
    truncteAllCollections(db);

    userId = await createUser();
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

    expect(data).toMatchObject(payload)
  })

  test("Should paginate through offset/limit without query params", async() => {
    const { status, body } = await client.get(`${baseUrl}/offset`)
    
    expectSuccessBody(body)
    expect(status).toBe(200)

    const { data } = body as TestResponseSuccess<ITodo[]>
    expect(data).toHaveLength(10)
    const firstTodo = data[0]
    expectDataHasTodoProps(firstTodo)
  })

  test("Should paginate through offset/limit with query params", async() => {
    const result1 = await client.get(`${baseUrl}/offset`)
    
    expectSuccessBody(result1.body)
    expect(result1.status).toBe(200)
    
    const result1Data = result1.body.data as ITodo[]
    expect(result1Data).toHaveLength(10)

    const result2 = await client.get(`${baseUrl}/offset?offset=10`)
    
    expectSuccessBody(result2.body)
    expect(result2.status).toBe(200)

    const result2Data = result2.body.data as ITodo[]
    expect(result2Data).toHaveLength(10)

    const result1Ids = result1Data.map(todo => todo._id)
    const result2Ids = result2Data.map(todo => todo._id)
    const intersectIds = result1Ids.filter(value => result2Ids.includes(value))

    expect(intersectIds).toHaveLength(0)
    const allTodos = [ ...result1Data, ...result2Data ]
    allTodos.forEach((todo, i) => expect(todo.title).toBe(`title-${i}`))
  })

  test("Should paginate through cursor", () => {
    //
  })
})
