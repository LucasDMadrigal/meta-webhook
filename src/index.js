/*import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import router from "./routes/webhook.router.js";
import { captureRawBody } from "./middleware/verifySignature.js";
import helmet from "helmet";
import logger from "./utils/logger.js";

const app = express();
const port = process.env.PORT || 3000

app.use(express.json({ limit: "1mb", verify: captureRawBody }))
app.use(helmet())
app.use("/webhooks/meta", rateLimit({ windowMs: 60_000, max: 120 }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(router);

app.use((err, _req, _res, next) => {
    logger.error(err)
    _res.status(500)
})

app.listen(port, () =>{
    logger.info(`Server listening on http://localhost:${port}`);
})*/

// Import Express.js
import express from "express";

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.WEBHOOKVTOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
