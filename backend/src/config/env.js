import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const defaultAccessSecret = "development-access-secret-change-before-production";
const defaultRefreshSecret = "development-refresh-secret-change-before-production";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z
    .string()
    .url()
    .default("postgresql://postgres:postgres@localhost:5432/school_management?schema=public"),
  JWT_ACCESS_SECRET: z.string().min(32).default(defaultAccessSecret),
  JWT_REFRESH_SECRET: z.string().min(32).default(defaultRefreshSecret),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  PRODUCTION_DOMAIN: z.string().default("brooksschool.sc.ke"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid backend environment configuration");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

if (
  parsed.data.NODE_ENV === "production" &&
  (parsed.data.JWT_ACCESS_SECRET === defaultAccessSecret ||
    parsed.data.JWT_REFRESH_SECRET === defaultRefreshSecret)
) {
  console.error("Production requires explicit JWT secrets.");
  process.exit(1);
}

export const env = {
  ...parsed.data,
  CORS_ORIGINS: parsed.data.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};
