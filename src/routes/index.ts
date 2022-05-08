import { Router } from "express";
import { checkToken } from "../middlewares/auth";
import userRouter from "./user";
import todoRouter from "./todo";

const router = Router();

router.use("/user", userRouter);
router.use("/todo", checkToken, todoRouter);

export default router;
