import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config.js";
import { closeConnections, redis } from "./db.js";
import { healthRoutes } from "./routes/health.js";

/**
 * OpenSecAI API Gateway
 *
 * Phase 1: skeleton — health check + dependency wiring.
 * Later phases add: auth (JWT), rate limiting, routing to
 * security/ai/file/recon services.
 */
async function buildServer() {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === "development" ? "info" : "warn",
    },
  });

  // CORS — allow the Vite dev server origin
  await app.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: true,
  });

  // Rate limiting — Redis-backed so limits survive restarts
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    redis,
  });

  // Routes
  await app.register(healthRoutes);

  return app;
}

async function start() {
  const app = await buildServer();

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    app.log.info(`${signal} received, shutting down...`);
    await app.close();
    await closeConnections();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    app.log.info(`Gateway listening on http://${config.HOST}:${config.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Only start when run directly (not when imported for tests)
if (import.meta.url === `file://${process.argv[1]}`) {
  void start();
}

export { buildServer };