import { db } from "../config/firebase";

export async function createWebhook(userId: string, description: string) {
  try {
    const webhook = await db.collection("webhooks").add({
      userId,
      description,
      createdAt: new Date(),
    });

    return {
      id: webhook.id,
      userId,
      description,
      createdAt: new Date(),
    };
  } catch (error) {
    throw new Error("Erro ao criar webhook");
  }
}

export async function getUserWebhooks(userId: string) {
  try {
    const snapshot = await db
      .collection("webhooks")
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error("Erro ao buscar webhooks");
  }
}
