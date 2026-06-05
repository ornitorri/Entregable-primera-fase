-- Script de migración para agregar funcionalidades de admin, roles y comunidad mejorada
-- Ejecutar en MySQL después de ejecutar database_schema.sql y migration_add_profile_fields.sql

USE readzzi;

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

-- Agregar columnas de rol y estado de baneo a la tabla users (si no existen)
-- Nota: MySQL no soporta IF NOT EXISTS en ALTER TABLE directamente
-- Por eso usamos la sintaxis de ALTER TABLE IGNORE para evitar duplicados
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin', 'logistics', 'marketing', 'publicity') DEFAULT 'user' AFTER alias;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE AFTER role;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS ban_reason TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP NULL;

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
  FOREIGN KEY (book_mention_id) REFERENCES books(id) ON DELETE SET NULL
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
  UNIQUE KEY unique_user_post_reaction (post_id, user_id)
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de ban logs para auditoría
CREATE TABLE IF NOT EXISTS user_ban_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  banned_by INT NOT NULL,
  reason TEXT,
  banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unbanned_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (banned_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Crear índices para mejorar performance
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_user_is_banned ON users(is_banned);
CREATE INDEX idx_post_user ON posts(user_id);
CREATE INDEX idx_post_community ON posts(community_id);
CREATE INDEX idx_post_created_at ON posts(created_at);
CREATE INDEX idx_post_reaction_user ON post_reactions(user_id);
CREATE INDEX idx_post_reaction_post ON post_reactions(post_id);
CREATE INDEX idx_post_comment_user ON post_comments(user_id);
CREATE INDEX idx_post_comment_post ON post_comments(post_id);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);

-- Ver datos actuales de usuarios (para verificar)
SELECT 'Migración completada correctamente' as resultado;
