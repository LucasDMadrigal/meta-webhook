import logger from "../utils/logger.js";

export async function processWebhookPayload(payload) {
  // payload tiene estructura: entry[] -> changes[] -> value
  const entries = payload.entry || [];
  for (const entry of entries) {
    const changes = entry.changes || [];
    for (const change of changes) {
      const value = change.value || {};
      // Mensajes entrantes
      if (value.messages) {
        for (const msg of value.messages) {
          logger.info({ from: msg.from, id: msg.id, text: msg.text?.body }, "Mensaje recibido");
          // acá: guardar en BD, enrutar a sistema, push a cola, etc.
        }
      }
      // Estados (delivery/read)
      if (value.statuses) {
        for (const st of value.statuses) {
          logger.info({ id: st.id, status: st.status, recipient_id: st.recipient_id }, "Status recibido");
          // actualizar estado mensaje en BD
        }
      }
      // Otros eventos: contacts, messages_deliveries, etc.
    }
  }
}
