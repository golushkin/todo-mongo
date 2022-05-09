import { Request, Response } from "express";
import { httpErrs } from "../consts/errors"
import ApiHandler from "./ApiHandler";

export function handle404(req: Request, res: Response,){
  const api = new ApiHandler(req, res)
  api.sendFailure(httpErrs.PAGE_WAS_NOT_FOUND, [], 404)
}
