import config from "config";
import { MongoClient } from "mongodb";
import { Config } from '../types/config'

const { host, port, dbName } = config.get<Config["db"]>("db") 
class DbHelper {
  static client?: MongoClient;

  static async connect() {
    if (DbHelper.client) {
      return DbHelper.client.db(dbName)
    }

    const url = `mongodb://${host}:${port}`
    const client = new MongoClient(url)
    DbHelper.client = client;

    await client.connect()

    return client.db(dbName)
  }

  static async disconnect(){
    if (DbHelper.client) {
      await DbHelper.client.close()
    }
  }

  static async getDb(){
    if (DbHelper.client) {
      return DbHelper.client.db(dbName)
    }

    return DbHelper.connect()
  }
}

export default DbHelper;
