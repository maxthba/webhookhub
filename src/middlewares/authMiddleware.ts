import { Request, Response, NextFunction } from "express";
// Importa o SDK administrativo do Firebase para validar tokens.
import admin from "firebase-admin";

// Middleware assíncrono que verifica o token de autenticação enviado pelo cliente.
export async function authMiddleware(
    req: any,
    res: Response,
    next: NextFunction
) {
    // Lê o cabeçalho `Authorization` da requisição.
    const authHeader = req.headers.authorization;

    // Se não existir o cabeçalho, retorna 401 (não autorizado).
    if (!authHeader) {
        return res.status(401).send("token nao enviado");
    }

    // Espera o formato `Bearer <token>` e pega somente o token.
    const token = authHeader.split(" ")[1];

    try {
        // Valida o ID token usando o admin SDK do Firebase.
        const decoded = await admin.auth().verifyIdToken(token);

        // Anexa os dados decodificados do usuário na requisição para uso posterior.
        req.user = decoded;

        // Continua o fluxo para o próximo middleware ou rota.
        next();
    } catch (error) {
        // Se a validação falhar, retorna 401 (token inválido).
        return res.status(401).send("token invalido");
    }
}