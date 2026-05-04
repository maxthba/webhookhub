import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as webhookService from "../services/webhookService";

const router = Router();

router.post("/", authMiddleware, async (req: any, res) => {
  const { description } = req.body;

  try {
    const webhook = await webhookService.createWebhook(
      req.user.uid,
      description
    );

    res.json({
      id: webhook.id,
      message: "Webhook criado ",
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Erro ao criar webhook",
      details: err.message,
    });
  }
});

router.get("/", authMiddleware, async (req: any, res) => {
  try {
    const webhooks = await webhookService.getUserWebhooks(req.user.uid);
    res.json(webhooks);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Erro ao buscar webhooks",
      details: err.message,
    });
  }
});

export default router;
