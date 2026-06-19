#!/usr/bin/env node
const mysql = require('mysql2/promise');
(async () => {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'readzzi'
  };
  console.log('Trying DB connection with config:', config);
  try {
    const conn = await mysql.createConnection(config);
    const [rows] = await conn.execute('SELECT 1 as ok');
    console.log('DB OK:', rows);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('DB connection error:', err && err.message ? { message: err.message, code: err.code } : err);
    process.exit(2);
  }
})();
