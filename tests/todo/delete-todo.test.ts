import request from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { start } from "../../src"
import TodoModel from "../../src/db/TodoModel"
import DbHelper from "../../src/helpers/DbHelper"
import { 
  createUser,
  truncteAllCollections,
  createToDos,
  expectSuccessBody
} from "../helpers"

const baseUrl = "/todo"

const todoModel = new TodoModel()

jest.setTimeout(30_000);

describe("Delete todo", () => {
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
    const [ id ] = await createToDos(userId);

    const { status, body } = await client.delete(`${baseUrl}/${id}`)

    expectSuccessBody(body)
    expect(status).toBe(200)
    expect(body.data).toEqual(id)
  
    const data = await todoModel.getById(id)

    expect(data).toBe(null)
  })
})
