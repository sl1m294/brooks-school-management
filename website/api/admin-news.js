import {
  defaultNews,
  ensureNewsTable,
  getPool,
  parseJsonBody,
  sendJson,
  verifyAdminToken,
} from "./_website-data.js";

function getToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function normalizeNews(news) {
  if (!Array.isArray(news)) return [];
  return news
    .slice(0, 24)
    .map((item) => ({
      title: String(item.title || "").trim().slice(0, 180),
      date: String(item.date || "").trim().slice(0, 60),
      category: String(item.category || "").trim().slice(0, 80),
      description: String(item.description || "").trim().slice(0, 1000),
    }))
    .filter((item) => item.title && item.date && item.category && item.description);
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
      await ensureNewsTable(pool);
      const { rows } = await pool.query(`
        select title, news_date as date, category, description
        from website_news
        where is_published = true
        order by display_order asc, id asc
      `);
      sendJson(res, 200, { data: rows.length ? rows : defaultNews });
    } catch (error) {
      console.error(error);
      sendJson(res, 500, { error: "Could not load news." });
    }
    return;
  }

  if (req.method === "PUT") {
    const body = await parseJsonBody(req);
    const news = normalizeNews(body.news);
    if (news.length === 0) {
      sendJson(res, 400, { error: "Add at least one complete news item." });
      return;
    }

    const client = await pool.connect();
    try {
      await ensureNewsTable(client);
      await client.query("begin");
      await client.query("delete from website_news");
      for (const [index, item] of news.entries()) {
        await client.query(
          `
            insert into website_news (title, news_date, category, description, display_order, is_published)
            values ($1, $2, $3, $4, $5, true)
          `,
          [item.title, item.date, item.category, item.description, index],
        );
      }
      await client.query("commit");
      sendJson(res, 200, { data: news });
    } catch (error) {
      await client.query("rollback");
      console.error(error);
      sendJson(res, 500, { error: "Could not save news." });
    } finally {
      client.release();
    }
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
}
