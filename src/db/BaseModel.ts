import DbHelper from "../helpers/DbHelper";

export class BaseModel {
  private _collectionName: string;

  constructor(collectionName: string) {
    this._collectionName = collectionName;
  }

  getDb() {
    return DbHelper.getDb()
  }

  async getCollection(){
    const db = await DbHelper.getDb()
    
    return db.collection(this._collectionName)
  }
}
