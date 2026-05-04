import { db } from "../config/firebase";

export async function createEvent(webhookId: string, payload: any) {
  try {
    const event = await db.collection("events").add({
      webhookId,
      payload,
      createdAt: new Date(),
    });

    return {
      id: event.id,
      webhookId,
      payload,
      createdAt: new Date(),
    };
  } catch (error) {
    throw new Error("Erro ao receber evento");
  }
}

export async function getWebhookEvents(webhookId: string) {
  try {
    const snapshot = await db
      .collection("events")
      .where("webhookId", "==", webhookId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error("Erro ao buscar eventos");
  }
}
