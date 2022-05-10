import { NextFunction, Request, Response } from "express";
import logger from "../helpers/logger"

export const httpLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.http(req)
  next()
}