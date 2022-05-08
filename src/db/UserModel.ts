import { ObjectId } from "mongodb";
import collectionsNames from "../consts/collectionsNames";
import { BaseModel } from "./BaseModel";

class UserModel extends BaseModel {
  constructor(){
    super(collectionsNames.user)
  }

  async create(data: any){
    const collection = await this.getCollection()

    return collection.insertOne(data)
  }

  async getById(id: string){
    const collection = await this.getCollection()

    return collection.findOne({ _id: new ObjectId(id) })
  }
}

export default UserModel