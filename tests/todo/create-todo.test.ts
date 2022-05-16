import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { start } from "../../src"
import TodoModel from "../../src/db/TodoModel"
import DbHelper from "../../src/helpers/DbHelper"
import { 
  createUser, 
  expectSuccessBody,
  truncteAllCollections,
  getTodoPayload
} from "../helpers"

const baseUrl = "/todo"

const todoModel = new TodoModel()

jest.setTimeout(30_000);

describe("Create todo", () => {
  let client: request.SuperTest<request.Test>
  let memoryServer: MongoMemoryServer
  
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
})
