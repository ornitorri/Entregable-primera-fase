const fs = require('fs');
const mysql = require('mysql2/promise');
(async () => {
  const sqlFile = 'src/migration_rewards_store.sql';
  if (!fs.existsSync(sqlFile)) {
    console.error('SQL file not found:', sqlFile);
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlFile, 'utf8');
  // Split by semicolon to get individual statements (robust frente a diferentes finales de línea)
  const statements = sql.split(';').map(s => s.trim()).filter(Boolean);

  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'readzzi'
  };

  const conn = await mysql.createConnection(config);
  try {
    for (const stmt of statements) {
      console.log('Executing statement...');
      await conn.query(stmt);
    }
    const [rows] = await conn.execute('SELECT id, name, points_cost, type FROM rewards ORDER BY id');
    console.log('Rewards in DB:');
    console.table(rows);
  } catch (err) {
    console.error('Error running migration:', err.message || err);
    process.exit(2);
  } finally {
    await conn.end();
  }
})();
