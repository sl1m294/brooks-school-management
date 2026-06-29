import { defaultNews, ensureNewsTable, getPool, sendJson } from "./_website-data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const pool = getPool();
  if (!pool) {
    sendJson(res, 200, { data: defaultNews, source: "fallback" });
    return;
  }

  try {
    await ensureNewsTable(pool);
    const { rows } = await pool.query(`
      select title, news_date as date, category, description
      from website_news
      where is_published = true
      order by display_order asc, id asc
    `);
    sendJson(res, 200, { data: rows.length ? rows : defaultNews, source: "database" });
  } catch (error) {
    console.error(error);
    sendJson(res, 200, { data: defaultNews, source: "fallback" });
  }
}
