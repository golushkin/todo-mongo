import { MongoMemoryServer } from "mongodb-memory-server"
import request from "supertest"
import { start } from "../../src"
import UserModel from "../../src/db/UserModel"
import DbHelper from "../../src/helpers/DbHelper"
import { expectSuccessBody, truncteAllCollections } from "../helpers"

const baseUrl = "/user/"

const userModel = new UserModel()

jest.setTimeout(30_000);

describe("Create user", () => {
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
    const payload = { userName: "test" }
    const { status, body } = await client.post(baseUrl).send(payload)
    
    expectSuccessBody(body)
    expect(status).toBe(201)
    expect(body.data).toHaveProperty("insertedId")

    const insertedId = body.data.insertedId
    const data = await userModel.getById(insertedId)

    expect(data).toMatchObject(payload)
  })
})
