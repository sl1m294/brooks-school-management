import { defaultEvents, ensureEventsTable, getPool, parseJsonBody, sendJson, verifyAdminToken } from "./_website-data.js";

function getToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function normalizeEvents(events) {
  if (!Array.isArray(events)) return [];
  return events
    .slice(0, 12)
    .map((event) => ({
      date: String(event.date || "").trim().slice(0, 40),
      title: String(event.title || "").trim().slice(0, 180),
      description: String(event.description || "").trim().slice(0, 800),
    }))
    .filter((event) => event.date && event.title && event.description);
}

export default async function handler(req, res) {
  if (!verifyAdminToken(getToken(req))) {
    sendJson(res, 401, { error: "Please log in again." });
    return;
  }

  const pool = getPool();
  if (!pool) {
    sendJson(res, 503, {
      error: "Database is not configured yet. Add DATABASE_URL in Vercel.",
    });
    return;
  }

  if (req.method === "GET") {
    try {
      await ensureEventsTable(pool);
      const { rows } = await pool.query(`
        select event_date as date, title, description
        from website_events
        where is_published = true
        order by display_order asc, id asc
      `);
      sendJson(res, 200, { data: rows.length ? rows : defaultEvents });
    } catch (error) {
      console.error(error);
      sendJson(res, 500, { error: "Could not load events." });
    }
    return;
  }

  if (req.method === "PUT") {
    const body = await parseJsonBody(req);
    const events = normalizeEvents(body.events);
    if (events.length === 0) {
      sendJson(res, 400, { error: "Add at least one complete event." });
      return;
    }

    const client = await pool.connect();
    try {
      await ensureEventsTable(client);
      await client.query("begin");
      await client.query("delete from website_events");
      for (const [index, event] of events.entries()) {
        await client.query(
          `
            insert into website_events (event_date, title, description, display_order, is_published)
            values ($1, $2, $3, $4, true)
          `,
          [event.date, event.title, event.description, index],
        );
      }
      await client.query("commit");
      sendJson(res, 200, { data: events });
    } catch (error) {
      await client.query("rollback");
      console.error(error);
      sendJson(res, 500, { error: "Could not save events." });
    } finally {
      client.release();
    }
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
}
