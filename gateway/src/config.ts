import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  JWTSECRET: z.string().default("your-secret-key"),
  DATABASE_URL: z.string().default("postgres://opensecai:opensecai@localhost:5432/opensecai"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  ADMIN_EMAIL: z.string().default("admin"),
  ADMIN_PASSWORD: z.string().default("admin"),
  SALTROUNDS: z.coerce.number().default(12),
  AI_SERVICE_URL: z.string().default("http://localhost:8081")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;