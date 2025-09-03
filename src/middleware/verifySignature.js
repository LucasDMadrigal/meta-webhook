import crypto from "crypto";
import logger from "../utils/logger.js";

export function captureRawBody(req, _res, buf, _encoding) {
  // express.json verify hook -> guarda raw body para verificar firma
  req.rawBody = buf;
}

export function verifyXHubSignature(req, res, next) {
  const header = req.headers["x-hub-signature-256"];
  if (!header) {
    logger.warn("No X-Hub-Signature-256 header");
    return res.sendStatus(401);
  }

  const appSecret = process.env.APP_SECRET;
  if (!appSecret) return res.sendStatus(500);

  const expected = "sha256=" +
    crypto.createHmac("sha256", appSecret).update(req.rawBody || "").digest("hex");

  try {
    const a = Buffer.from(header);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      logger.warn({ header, expected: expected.slice(0,10) }, "Signature mismatch");
      return res.sendStatus(401);
    }
  } catch (err) {
    logger.error(err, "Error verificando firma");
    return res.sendStatus(401);
  }

  next();
}
