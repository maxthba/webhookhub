import { db } from "../config/firebase";

export async function testFirebaseConnection() {
  try {
    const test = await db.collection("firebase-integration-test").add({
      message: "firebase funcionando",
      createdAt: new Date(),
    });

    return {
      id: test.id,
      message: "firebase funcionando",
    };
  } catch (error) {
    throw new Error("Erro ao conectar ao Firebase");
  }
}
