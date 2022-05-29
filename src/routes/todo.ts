import { Router } from "express";
import {
  createTodo,
  getTodos,
  getTodo,
  getTodosWithCursor,
  updateTodo
} from "../controllers/todo";

const router = Router();

router.post("/", createTodo);
router.patch("/", updateTodo);
router.get("/offset", getTodos);
router.get("/cursor", getTodosWithCursor);
router.get("/:id", getTodo);

export default router;
