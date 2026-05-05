import { Router } from "express";
import * as testService from "../services/testService";

const router = Router();

router.get("/", (req, res) => {
  res.send("API rodando ");
});

router.get("/test-db", async (req, res) => {
  try {
    const result = await testService.testFirebaseConnection();
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Erro ao testar Firebase",
      details: err.message,
    });
  }
});

export default router;
