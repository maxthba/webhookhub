import express from "express";
import cors from "cors";
import {db} from "./config/firebase";
import { authMiddleware } from "./middlewares/authMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando ");
});

app.get("/test-db", async (req, res) =>{
  const test = await db.collection("firebase-integration-test").add({
    message: "firebase funcionando",
    createdAt: new Date(),
  });

  res.json({
    id: test.id
  });
});

app.get("/private", authMiddleware, (req: any, res) => {
  res.json({
    message: "Acesso autorizado ",
    user: req.user,
  });
});

app.post("/webhooks", authMiddleware, async (req: any, res) => {
  const { description } = req.body;

  try {
    const webhook = await db.collection("webhooks").add({
      userId: req.user.uid,
      description,
      createdAt: new Date(),
    });

    res.json({
      id: webhook.id,
      message: "Webhook criado ",
    });
  } catch (err) {
    res.status(500).send("Erro ao criar webhook");
  }
});

app.get("/webhooks", authMiddleware, async (req: any, res) => {
  try {
    const snapshot = await db
      .collection("webhooks")
      .where("userId", "==", req.user.uid)
      .get();

    const webhooks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(webhooks);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Erro ao buscar webhooks",
      details: err.message,
    });
  }
});

app.post("/events/:webhookId", async (req, res) => {
  const { webhookId } = req.params;
  const payload = req.body;

  try {
    await db.collection("events").add({
      webhookId,
      payload,
      createdAt: new Date(),
    });

    res.send("Evento recebido");
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Erro ao receber evento",
      details: err.message,
    });
  }
});

app.get("/events/:webhookId", authMiddleware, async (req, res) => {
  try {
    const snapshot = await db
      .collection("events")
      .where("webhookId", "==", req.params.webhookId)
      .get();

    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(events);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Erro ao buscar eventos",
      details: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});