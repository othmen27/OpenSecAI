import type { FastifyInstance } from "fastify";
import { checkDependencies } from "../db.js";

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async (_request, reply) => {
    const deps = await checkDependencies();
    const healthy = deps.postgres && deps.redis;

    const body = {
      status: healthy ? "ok" : "degraded",
      service: "gateway",
      version: "0.1.0-skeleton",
      timestamp: new Date().toISOString(),
      dependencies: deps,
    };

    return reply.code(healthy ? 200 : 503).send(body);
  });
}