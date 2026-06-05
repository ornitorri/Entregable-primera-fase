require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

(async () => {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  const [tables] = await c.execute(
    "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? AND table_name IN ('cart','orders','order_items')",
    [process.env.DB_NAME]
  );
  console.log('Tables:', tables.map((t) => t.TABLE_NAME));
  const [book] = await c.execute(
    "SELECT id, LEFT(cover, 80) as cover_preview, LENGTH(cover) as cover_len FROM books WHERE id LIKE 'BK-%' ORDER BY created_at DESC LIMIT 1"
  );
  console.log('Latest admin book:', book[0]);
  await c.end();
})();
