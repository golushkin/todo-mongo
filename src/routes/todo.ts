import { Router } from "express";
import {
  createTodo,
  getTodos,
  getTodo,
  getTodosWithCursor
} from "../controllers/todo";

const router = Router();

router.post("/", createTodo);
router.get("/offset", getTodos);
router.get("/cursor", getTodosWithCursor);
router.get("/:id", getTodo);

export default router;
