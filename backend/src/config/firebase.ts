import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

// Inicializa o aplicativo Firebase usando as credenciais da conta de serviço.
admin.initializeApp({
  // Define a credencial que autoriza o acesso aos serviços do Firebase.
  credential: admin.credential.cert(serviceAccount as any),
});

// Exporta a instância do Firestore para consultas e gravações no banco.
export const db = admin.firestore();
// Exporta a instância de autenticação para criar, validar e gerenciar usuários.
export const auth = admin.auth();