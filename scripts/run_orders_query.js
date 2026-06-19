#!/usr/bin/env node
const mysql = require('mysql2/promise');
(async ()=>{
  const c = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'readzzi' });
  try{
    const [rows] = await c.execute(`
      SELECT
        o.id,
        o.total_amount,
        o.status,
        o.shipping_address,
        o.payment_method,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `, [3, 20]);
    console.log('Query OK, rows:', rows);
  }catch(e){
    console.error('Query error:', e.message);
  }finally{ await c.end(); }
})();
