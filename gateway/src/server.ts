import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { pathToFileURL } from "node:url";
import { config } from "./config.js";
import { closeConnections, redis } from "./db.js";
import { healthRoutes } from "./routes/health.js";

async function buildServer() {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === "development" ? "info" : "warn",
    },
  });

  await app.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: true,
  });
// Rate Limiter
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    redis,
  });

  await app.register(healthRoutes);

  return app;
}

async function start() {
  const app = await buildServer();

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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  void start();
}

export { buildServer };