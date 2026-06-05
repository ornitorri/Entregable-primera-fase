
-- MIGRACIÓN RÁPIDA: Global Feed (Sin el ALTER TABLE users que causa error)
-- Ejecuta este script si ya tienes las columnas de role/is_banned en la tabla users
-- Este script crea solo las tablas nuevas necesarias para el feed global

USE readzzi;

-- ==================== TABLAS YA EXISTENTES ====================
-- Las siguientes tablas probablemente ya existen, pero se crean si faltan:

-- Tabla de transacciones/órdenes completa
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('Pendiente', 'En Proceso', 'Enviado', 'Entregado', 'Cancelado') DEFAULT 'Pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de items de órdenes
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  book_id VARCHAR(20),
  quantity INT DEFAULT 1,
  price DECIMAL(10, 2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL
);

-- ==================== TABLAS DEL FEED GLOBAL (CRÍTICAS) ====================

-- Crear tabla de publicaciones/posts en la comunidad
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  community_id INT,
  content TEXT NOT NULL,
  image_url LONGTEXT,
  book_mention_id VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL,
  FOREIGN KEY (book_mention_id) REFERENCES books(id) ON DELETE SET NULL,
  INDEX idx_post_user (user_id),
  INDEX idx_post_created_at (created_at),
  INDEX idx_post_community (community_id)
);

-- Tabla de reacciones a publicaciones
CREATE TABLE IF NOT EXISTS post_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_post_reaction (post_id, user_id),
  INDEX idx_post_reaction_post (post_id),
  INDEX idx_post_reaction_user (user_id)
);

-- Tabla de comentarios en publicaciones
CREATE TABLE IF NOT EXISTS post_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_post_comment_post (post_id),
  INDEX idx_post_comment_user (user_id),
  INDEX idx_post_comment_created (created_at)
);

-- ==================== AUDITORÍA ====================

-- Tabla de ban logs para auditoría
CREATE TABLE IF NOT EXISTS user_ban_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  banned_by INT NOT NULL,
  reason TEXT,
  banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unbanned_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (banned_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_ban_logs_user (user_id),
  INDEX idx_user_ban_logs_banned_at (banned_at)
);

-- ==================== ÍNDICES ADICIONALES PARA PERFORMANCE ====================

-- Índices en tabla users (si aún no existen)
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_is_banned ON users(is_banned);

-- Índices en tabla orders
CREATE INDEX IF NOT EXISTS idx_order_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON orders(status);

-- ==================== VERIFICACIÓN ====================

SELECT 'Migración del Feed Global completada exitosamente' as resultado;

-- Ver estadísticas
SELECT 
  'posts' as tabla, COUNT(*) as total FROM posts
UNION ALL
SELECT 'post_reactions', COUNT(*) FROM post_reactions
UNION ALL
SELECT 'post_comments', COUNT(*) FROM post_comments
UNION ALL
SELECT 'user_ban_logs', COUNT(*) FROM user_ban_logs
UNION ALL
SELECT 'orders', COUNT(*) FROM orders;
