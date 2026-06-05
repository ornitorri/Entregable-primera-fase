#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'readzzi',
};

const statements = [
  `CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book_cart (user_id, book_id)
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    book_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
  )`,
  `ALTER TABLE books MODIFY COLUMN cover TEXT`,
  `ALTER TABLE books MODIFY COLUMN id VARCHAR(50)`,
];

async function main() {
  const pool = mysql.createPool(dbConfig);
  const conn = await pool.getConnection();
  try {
    for (const sql of statements) {
      try {
        await conn.execute(sql);
        console.log('OK:', sql.split('\n')[0].slice(0, 60) + '...');
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
          console.log('SKIP (ya existe):', sql.split('\n')[0].slice(0, 50));
        } else {
          console.warn('WARN:', err.message);
        }
      }
    }
    console.log('\nTablas de ecommerce listas.');
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
