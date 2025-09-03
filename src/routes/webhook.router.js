import { Router } from "express";
import { verifyWebhook, handleWebhook } from "../controllers/webhook.controller.js";
import { verifyXHubSignature } from "../middleware/verifySignature.js";
import { idempotency } from "../middleware/idempotency.js";

const router = Router();

// GET para verificación inicial (hub.challenge)
router.get("/webhooks/meta", verifyWebhook);

// POST eventos: validar firma y evitar duplicados
router.post("/webhooks/meta", verifyXHubSignature, idempotency, handleWebhook);

export default router;
