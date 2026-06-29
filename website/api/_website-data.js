import crypto from "node:crypto";
import pg from "pg";

const { Pool } = pg;

export const defaultEvents = [
  {
    date: "02 Jul",
    title: "Parent consultation morning",
    description: "Class teachers meet parents for academic and wellbeing updates.",
  },
  {
    date: "12 Jul",
    title: "Environmental club clean-up",
    description: "Learners practise community care and environmental responsibility.",
  },
  {
    date: "26 Jul",
    title: "Music and drama afternoon",
    description: "A friendly showcase for confidence, voice, rhythm, and teamwork.",
  },
];

let pool;

export function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_URL.includes("localhost") ||
        process.env.DATABASE_URL.includes("127.0.0.1")
          ? false
          : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function ensureEventsTable(client) {
  await client.query(`
    create table if not exists website_events (
      id serial primary key,
      event_date varchar(40) not null,
      title varchar(180) not null,
      description text not null,
      display_order integer not null default 0,
      is_published boolean not null default true,
      updated_at timestamptz not null default now()
    )
  `);

  const { rows } = await client.query("select count(*)::int as count from website_events");
  if (rows[0]?.count === 0) {
    for (const [index, event] of defaultEvents.entries()) {
      await client.query(
        `
          insert into website_events (event_date, title, description, display_order, is_published)
          values ($1, $2, $3, $4, true)
        `,
        [event.date, event.title, event.description, index],
      );
    }
  }
}

export function signAdminToken() {
  const secret = process.env.WEBSITE_ADMIN_SECRET || process.env.WEBSITE_ADMIN_PASSWORD;
  if (!secret) return null;

  const payload = {
    role: "website-admin",
    exp: Date.now() + 1000 * 60 * 60 * 8,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminToken(token) {
  const secret = process.env.WEBSITE_ADMIN_SECRET || process.env.WEBSITE_ADMIN_PASSWORD;
  if (!secret || !token || !token.includes(".")) return false;

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return false;
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  return payload.role === "website-admin" && payload.exp > Date.now();
}

export async function parseJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}
