import { Pool } from "pg";
import { Redis } from "ioredis";
import { config } from "./config.js";

export const pgPool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

/**
 * Health check helper — verifies both Postgres and Redis are reachable.
 * Returns per-dependency status so the /health endpoint can report
 * exactly which dependency is down.
 */
export async function checkDependencies(): Promise<{
  postgres: boolean;
  redis: boolean;
}> {
  const [postgresOk, redisOk] = await Promise.all([
    checkPostgres(),
    checkRedis(),
  ]);
  return { postgres: postgresOk, redis: redisOk };
}

async function checkPostgres(): Promise<boolean> {
  try {
    await pgPool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

async function checkRedis(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}

/** Graceful shutdown — close both connections on SIGTERM/SIGINT. */
export async function closeConnections(): Promise<void> {
  await Promise.allSettled([pgPool.end(), redis.quit()]);
}