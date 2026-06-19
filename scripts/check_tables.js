#!/usr/bin/env node
const mysql = require('mysql2/promise');
(async () => {
  const c = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'readzzi' });
  const [orders] = await c.execute("SHOW TABLES LIKE 'orders'");
  console.log('orders:', orders.length ? orders : 'NOT FOUND');
  const [ph] = await c.execute("SHOW TABLES LIKE 'points_history'");
  console.log('points_history:', ph.length ? ph : 'NOT FOUND');
  try {
    const [cols] = await c.execute("SHOW COLUMNS FROM users LIKE 'points'");
    console.log('users.points column:', cols.length ? cols : 'NOT FOUND');
  } catch (e) {
    console.log('users table check error:', e.message);
  }
  await c.end();
})();
