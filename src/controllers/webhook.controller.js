import logger from "../utils/logger.js";
import { processWebhookPayload } from "../services/event-processor.js";

export function verifyWebhook(req, res) {
    console.log(req);
    console.log(res);
    
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    logger.info("Webhook verificado por Meta (challenge enviado)");
    return res.status(200).send(challenge);
  }
  logger.warn("Webhook verification failed");
  return res.sendStatus(403);
}

export function handleWebhook(req, res) {
  // ACK rápido
  res.sendStatus(200);

  const payload = req.body;
  if (!payload) return logger.warn("Webhook con body vacío");

  // procesar en background
  setImmediate(async () => {
    try {
      await processWebhookPayload(payload);
    } catch (err) {
      logger.error(err, "Error procesando webhook");
    }
  });
}
