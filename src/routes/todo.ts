import { Router } from "express";
import {
  createTodo,
  getTodos,
  getTodo,
  getTodosWithCursor,
  updateTodo,
  deleteTodo
} from "../controllers/todo";

const router = Router();

router.post("/", createTodo);
router.patch("/", updateTodo);
router.get("/offset", getTodos);
router.get("/cursor", getTodosWithCursor);
router.get("/:id", getTodo);
router.delete("/:id", deleteTodo);

export default router;
