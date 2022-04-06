import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.json({ a: 1 });
});

export default router;
