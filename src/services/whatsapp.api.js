import axios from "axios";
import logger from "../utils/logger.js";

const API_BASE = "https://graph.facebook.com";

function getUrl(phoneNumberId) {
  const ver = process.env.API_VERSION || "v19.0";
  return `${API_BASE}/${ver}/${phoneNumberId}/messages`;
}

export async function sendText(phoneNumberId, to, text) {
  const url = getUrl(phoneNumberId);
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text }
  };
  const res = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` }
  });
  logger.info({ data: res.data }, "Mensaje enviado (respuesta de Meta)");
  return res.data;
}

export async function sendTemplate(phoneNumberId, to, templateName, language="en_US", components=[]) {
  const url = getUrl(phoneNumberId);
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: language },
      components
    }
  };
  const res = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` }
  });
  logger.info({ data: res.data }, "Template enviado (respuesta de Meta)");
  return res.data;
}
