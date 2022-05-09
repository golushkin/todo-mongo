import { Router } from "express";
import { createTodo, getTodos, getTodo } from "../controllers/todo";

const router = Router();

router.post("/", createTodo);
router.get("/offset", getTodos);
router.get("/cursor", getTodos);
router.get("/:id", getTodo);

export default router;
