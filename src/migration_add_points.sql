-- Migración: Agregar sistema de puntos a usuarios

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;

CREATE TABLE IF NOT EXISTS points_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_id VARCHAR(50),
  points INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
