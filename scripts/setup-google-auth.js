require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'readzzi',
};

async function main() {
  const conn = await mysql.createConnection(dbConfig);
  try {
    const [cols] = await conn.execute(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'google_id'`,
      [dbConfig.database]
    );
    if (cols.length === 0) {
      await conn.execute(
        'ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL UNIQUE AFTER password'
      );
      console.log('Columna google_id agregada.');
    } else {
      console.log('Columna google_id ya existe.');
    }
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
