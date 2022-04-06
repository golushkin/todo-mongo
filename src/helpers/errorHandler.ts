import { Request, Response } from "express";
import { httpErrs } from '../consts/errors'
import ApiHandler from "./ApiHandler";

export function handle404(req: Request, res: Response,){
    const api = new ApiHandler(req, res)
    api.sendFailure(httpErrs[404], [], 404)
}
