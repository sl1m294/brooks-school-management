import { parseJsonBody, sendJson, signAdminToken } from "./_website-data.js";

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

  const body = await parseJsonBody(req);
  const password = body.password;
  if (password !== process.env.WEBSITE_ADMIN_PASSWORD) {
    sendJson(res, 401, { error: "Invalid password" });
    return;
  }

  sendJson(res, 200, { token: signAdminToken() });
}
