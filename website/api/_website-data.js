import crypto from "node:crypto";
import pg from "pg";

const { Pool } = pg;
const ADMIN_SESSION_MS = 1000 * 60 * 30;
const LOGIN_WINDOW_MINUTES = 15;
const LOGIN_MAX_FAILURES = 5;
const LOCKOUT_MINUTES = 30;

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

export const defaultNews = [
  {
    title: "Term 2 Opening Update",
    date: "June 28, 2026",
    category: "Administration",
    description:
      "Parents are reminded to review the term calendar, uniform checklist, and arrival routines.",
  },
  {
    title: "CBC Project Showcase",
    date: "July 5, 2026",
    category: "Academics",
    description:
      "Learners will present class projects in science, agriculture, creative arts, and ICT.",
  },
  {
    title: "Inter-House Games Day",
    date: "July 19, 2026",
    category: "School Life",
    description:
      "Families are invited for athletics, football, teamwork activities, and class displays.",
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

export async function ensureNewsTable(client) {
  await client.query(`
    create table if not exists website_news (
      id serial primary key,
      title varchar(180) not null,
      news_date varchar(60) not null,
      category varchar(80) not null,
      description text not null,
      display_order integer not null default 0,
      is_published boolean not null default true,
      updated_at timestamptz not null default now()
    )
  `);

  const { rows } = await client.query("select count(*)::int as count from website_news");
  if (rows[0]?.count === 0) {
    for (const [index, item] of defaultNews.entries()) {
      await client.query(
        `
          insert into website_news (title, news_date, category, description, display_order, is_published)
          values ($1, $2, $3, $4, $5, true)
        `,
        [item.title, item.date, item.category, item.description, index],
      );
    }
  }
}

export async function ensureAdminLoginAttemptsTable(client) {
  await client.query(`
    create table if not exists website_admin_login_attempts (
      identifier varchar(160) primary key,
      failed_count integer not null default 0,
      window_started_at timestamptz not null default now(),
      locked_until timestamptz,
      updated_at timestamptz not null default now()
    )
  `);
}

export function getClientIdentifier(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  const realIp = String(req.headers["x-real-ip"] || "").trim();
  const remoteAddress = String(req.socket?.remoteAddress || "").trim();

  return (forwardedFor || realIp || remoteAddress || "unknown").slice(0, 160);
}

export async function getAdminLoginAttemptState(client, identifier) {
  await ensureAdminLoginAttemptsTable(client);

  const { rows } = await client.query(
    `
      select
        failed_count,
        locked_until,
        locked_until is not null and locked_until > now() as is_locked
      from website_admin_login_attempts
      where identifier = $1
    `,
    [identifier],
  );

  return {
    failedCount: rows[0]?.failed_count || 0,
    isLocked: Boolean(rows[0]?.is_locked),
    lockedUntil: rows[0]?.locked_until || null,
  };
}

export async function recordAdminLoginFailure(client, identifier) {
  await ensureAdminLoginAttemptsTable(client);

  const { rows } = await client.query(
    `
      insert into website_admin_login_attempts (
        identifier,
        failed_count,
        window_started_at,
        locked_until,
        updated_at
      )
      values ($1, 1, now(), null, now())
      on conflict (identifier) do update set
        failed_count = case
          when website_admin_login_attempts.window_started_at < now() - ($2 * interval '1 minute')
            then 1
          else website_admin_login_attempts.failed_count + 1
        end,
        window_started_at = case
          when website_admin_login_attempts.window_started_at < now() - ($2 * interval '1 minute')
            then now()
          else website_admin_login_attempts.window_started_at
        end,
        locked_until = case
          when (
            case
              when website_admin_login_attempts.window_started_at < now() - ($2 * interval '1 minute')
                then 1
              else website_admin_login_attempts.failed_count + 1
            end
          ) >= $3
            then now() + ($4 * interval '1 minute')
          else null
        end,
        updated_at = now()
      returning
        failed_count,
        locked_until,
        locked_until is not null and locked_until > now() as is_locked
    `,
    [identifier, LOGIN_WINDOW_MINUTES, LOGIN_MAX_FAILURES, LOCKOUT_MINUTES],
  );

  return {
    failedCount: rows[0]?.failed_count || 1,
    isLocked: Boolean(rows[0]?.is_locked),
    lockedUntil: rows[0]?.locked_until || null,
  };
}

export async function clearAdminLoginFailures(client, identifier) {
  await ensureAdminLoginAttemptsTable(client);
  await client.query("delete from website_admin_login_attempts where identifier = $1", [
    identifier,
  ]);
}

export function compareSecrets(providedSecret, configuredSecret) {
  if (typeof providedSecret !== "string" || typeof configuredSecret !== "string") {
    return false;
  }

  const providedBuffer = Buffer.from(providedSecret);
  const configuredBuffer = Buffer.from(configuredSecret);
  if (providedBuffer.length !== configuredBuffer.length) return false;

  return crypto.timingSafeEqual(providedBuffer, configuredBuffer);
}

export function signAdminToken() {
  const secret = process.env.WEBSITE_ADMIN_SECRET || process.env.WEBSITE_ADMIN_PASSWORD;
  if (!secret) return null;

  const payload = {
    role: "website-admin",
    exp: Date.now() + ADMIN_SESSION_MS,
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

  try {
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
  } catch {
    return false;
  }
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
