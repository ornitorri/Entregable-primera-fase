-- ====================================================
-- MIGRACIÓN SIMPLE - AGREGAR COLUMNAS DE ROL Y SEGURIDAD
-- ====================================================
-- INSTRUCCIÓN: Ejecuta este script completo en MySQL Workbench o tu cliente MySQL
-- ====================================================

USE readzzi;

-- 1. Agregar columna ROLE si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role ENUM('user','admin','logistics','marketing','publicity') NOT NULL DEFAULT 'user' AFTER alias;

-- 2. Agregar columna IS_BANNED si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_banned TINYINT(1) NOT NULL DEFAULT 0 AFTER role;

-- 3. Agregar columna BAN_REASON si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS ban_reason TEXT NULL AFTER is_banned;

-- 4. Agregar columna BANNED_AT si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP NULL AFTER ban_reason;

-- 5. Agregar columna AVATAR_URL si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url LONGTEXT NULL;

-- 6. Crear tabla ORDERS si no existe
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('Pendiente','En Proceso','Enviado','Entregado','Cancelado') NOT NULL DEFAULT 'Pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Crear tabla ORDER_ITEMS si no existe
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  book_id VARCHAR(20),
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL
);

-- 8. Crear tabla POSTS si no existe
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  community_id INT NULL,
  content TEXT NOT NULL,
  image_url LONGTEXT NULL,
  book_mention_id VARCHAR(20) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL,
  FOREIGN KEY (book_mention_id) REFERENCES books(id) ON DELETE SET NULL
);

-- 9. Crear tabla POST_REACTIONS si no existe
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

-- 10. Crear tabla POST_COMMENTS si no existe
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

-- 11. Crear tabla USER_BAN_LOGS si no existe
CREATE TABLE IF NOT EXISTS user_ban_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  banned_by INT NOT NULL,
  reason TEXT NULL,
  banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unbanned_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (banned_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_alias ON users(alias);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_banned ON users(is_banned);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_community_created ON posts(community_id, created_at);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user ON post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);

-- ====================================================
-- FIN DE LA MIGRACIÓN
-- ====================================================
-- Ahora ejecuta esta verificación:
-- SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='users' AND TABLE_SCHEMA='readzzi';
