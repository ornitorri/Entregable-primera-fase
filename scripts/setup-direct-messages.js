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
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS direct_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        image_data LONGTEXT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_sender (sender_id),
        INDEX idx_receiver (receiver_id),
        INDEX idx_conversation (sender_id, receiver_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Tabla direct_messages creada correctamente.');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
