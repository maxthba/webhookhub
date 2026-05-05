import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as eventService from "../services/eventService";

const router = Router();

router.post("/:webhookId", async (req, res) => {
  const { webhookId } = req.params;
  const payload = req.body;

  try {
    await eventService.createEvent(webhookId, payload);
    res.send("Evento recebido");
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Erro ao receber evento",
      details: err.message,
    });
  }
});

router.get("/:webhookId", authMiddleware, async (req, res) => {
  try {
    const events = await eventService.getWebhookEvents(req.params.webhookId);
    res.json(events);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Erro ao buscar eventos",
      details: err.message,
    });
  }
});

export default router;
