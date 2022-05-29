import { Filter, Document, ObjectId, Collection } from "mongodb";
import collectionsNames from "../consts/collectionsNames";
import { ITodo } from "../types/todoModel";
import { BaseModel } from "./BaseModel";

class TodoModel extends BaseModel {
  constructor(){
    super(collectionsNames.todo)
  }

  async create(data: Omit<ITodo, "_id">){
    const collection = await this.getCollection()
    const todo = {
      ...data,
      creator: new ObjectId(data.creator),
      assignedTo: new ObjectId(data.assignedTo)
    }

    return collection.insertOne(todo)
  }

  async getById(id: string){
    const collection = await this.getCollection()
    
    return collection.findOne<ITodo>({ _id: new ObjectId(id) })
  }

  async getAll(offset: number, limit: number, isLinked: boolean){
    const collection = await this.getCollection()

    if (!isLinked) {
      return collection.find<ITodo>({}, { limit, skip: offset }).toArray()
    }

    return collection
      .aggregate([
        {
          $skip: offset
        },
        {
          $lookup:{
            from: collectionsNames.user,
            localField: "creator",
            foreignField: "_id",
            as: "creator"
          }
        },
        {
          $lookup:{
            from: collectionsNames.user,
            localField: "assignedTo",
            foreignField: "_id",
            as: "assignedTo"
          }
        },
        {
          $unwind: "$creator",
        },
        {
          $unwind: "$assignedTo",
        },
        {
          $limit: limit
        }
      ])
      .toArray()    
  }

  _getAllWithCursorUnLinked(collection: Collection, limit: number, id?: string){
    const filter: Filter<Document> = {}

    if (id) {
      filter["_id"] = {
        $gt: new ObjectId(id)
      }
    }
    
    return collection.find<ITodo>(filter, { limit }).toArray()
  }

  async getAllWithCursor(limit: number, isLinked: boolean, id?: string, ){
    const collection = await this.getCollection()

    if (!isLinked) {
      return this._getAllWithCursorUnLinked(collection, limit, id)
    }

    const aggreator: {[key: string]: any}[] = [
      {
        $lookup:{
          from: collectionsNames.user,
          localField: "creator",
          foreignField: "_id",
          as: "creator"
        }
      },
      {
        $lookup:{
          from: collectionsNames.user,
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo"
        }
      },
      {
        $unwind: "$creator",
      },
      {
        $unwind: "$assignedTo",
      },
      {
        $limit: limit
      } 
    ]

    if (id) {
      aggreator.unshift({
        $match: {
          _id: {
            $gt: new ObjectId(id)
          }
        }
      })
    }

    return collection
      .aggregate(aggreator)
      .toArray()    
  }

  async updateOne(data: Partial<ITodo> & {_id: string}){
    const collection = await this.getCollection()
    const { _id, ...todo } = data

    return collection.updateOne({ _id: new ObjectId(_id) }, { $set: todo })
  }
}

export default TodoModel