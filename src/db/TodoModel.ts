import { ObjectId } from "mongodb";
import collectionsNames from "../consts/collectionsNames";
import { ITodo } from "../types/todoModel";
import { BaseModel } from "./BaseModel";

class TodoModel extends BaseModel {
  constructor(){
    super(collectionsNames.todo)
  }

  async create(data: Omit<ITodo, "_id">){
    const collection = await this.getCollection()

    return collection.insertOne(data)
  }

  async getById(id: string){
    const collection = await this.getCollection()
    
    return collection.findOne<ITodo>({ _id: new ObjectId(id) })
  }

  async getAll(offset: number, limit: number){
    const collection = await this.getCollection()
    
    return collection.find<ITodo>({}, { limit, skip: offset }).toArray()
  }
}

export default TodoModel