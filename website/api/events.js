import { defaultEvents, ensureEventsTable, getPool, sendJson } from "./_website-data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const pool = getPool();
  if (!pool) {
    sendJson(res, 200, { data: defaultEvents, source: "fallback" });
    return;
  }

  try {
    await ensureEventsTable(pool);
    const { rows } = await pool.query(`
      select event_date as date, title, description
      from website_events
      where is_published = true
      order by display_order asc, id asc
    `);
    sendJson(res, 200, { data: rows.length ? rows : defaultEvents, source: "database" });
  } catch (error) {
    console.error(error);
    sendJson(res, 200, { data: defaultEvents, source: "fallback" });
  }
}
