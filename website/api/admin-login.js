import {
  clearAdminLoginFailures,
  compareSecrets,
  getAdminLoginAttemptState,
  getClientIdentifier,
  getPool,
  parseJsonBody,
  recordAdminLoginFailure,
  sendJson,
  signAdminToken,
} from "./_website-data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (!process.env.WEBSITE_ADMIN_PASSWORD) {
    sendJson(res, 503, {
      error: "Website admin password is not configured yet.",
    });
    return;
  }

  const pool = getPool();
  if (!pool) {
    sendJson(res, 503, {
      error: "Website admin security database is not configured yet.",
    });
    return;
  }

  const body = await parseJsonBody(req);
  const password = body.password;
  const identifier = getClientIdentifier(req);
  const attemptState = await getAdminLoginAttemptState(pool, identifier);

  if (attemptState.isLocked) {
    sendJson(res, 429, {
      error: "Too many failed attempts. Please try again in 30 minutes.",
    });
    return;
  }

  if (!compareSecrets(password, process.env.WEBSITE_ADMIN_PASSWORD)) {
    const failureState = await recordAdminLoginFailure(pool, identifier);
    if (failureState.isLocked) {
      sendJson(res, 429, {
        error: "Too many failed attempts. Please try again in 30 minutes.",
      });
      return;
    }

    sendJson(res, 401, { error: "Invalid password" });
    return;
  }

  await clearAdminLoginFailures(pool, identifier);
  sendJson(res, 200, { token: signAdminToken() });
}
