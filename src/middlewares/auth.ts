import { NextFunction, Request, Response } from "express";
import { httpErrs } from "../consts/errors";
import ApiHandler from "../helpers/ApiHandler";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const apiHandler = new ApiHandler(req, res)
  const authHeader = req.header('Authentication');
  
  if (!authHeader) {
    apiHandler.sendFailure(httpErrs.UNAUTHORIZED, [], 401)
  }

  const [ , token ] = authHeader.split(' ')

  if (!token) {
    apiHandler.sendFailure(httpErrs.UNAUTHORIZED, [], 401)
  }

  //todo: check if token is valid
  next()
}