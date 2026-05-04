import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/private", authMiddleware, (req: any, res) => {
  res.json({
    message: "Acesso autorizado ",
    user: req.user,
  });
});

export default router;
