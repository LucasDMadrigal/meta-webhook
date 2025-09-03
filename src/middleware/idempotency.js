const seen = new Map();
const TTL = 10 * 60 * 1000; // 10 min

setInterval(() => {
  const now = Date.now();
  for (const [k, t] of seen.entries()) if (now - t > TTL) seen.delete(k);
}, TTL).unref();

export function idempotency(req, res, next) {
  const body = req.body || {};
  // Extraer ids posibles: message id, status id, etc.
  const id = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id
          || body?.entry?.[0]?.changes?.[0]?.value?.statuses?.[0]?.id
          || body?.entry?.[0]?.id;

  if (!id) return next();

  if (seen.has(id)) return res.sendStatus(200);
  seen.set(id, Date.now());
  next();
}
