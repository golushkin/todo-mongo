import { Request, Response } from "express";

class ApiHandler{
  private _req: Request;
  private _res: Response;

  constructor(req: Request, res: Response){
    this._req = req
    this._res = res
  }

  get req(){
    return this._req
  }

  get res(){
    return this._res
  }

  sendSuccess(data: any, statusCode = 200){
    this.res
      .status(statusCode)
      .json({
        success: true,
        data
      })
  }

  sendFailure(errorMsg: string, additionalInfo: any[] = [], statusCode= 500){
    this.res
      .status(statusCode)
      .json({
        success: false,
        error: errorMsg,
        additionalInfo
      })
  }
}

export default ApiHandler