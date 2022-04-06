export class BaseModel {
  private _db;
  constructor(db = null) {
    this._db = db;
  }

  get db() {
    return this._db;
  }
}
