-- Migracion unificada: admin + comunidad + rendimiento
-- Ejecutar despues de database_schema.sql

USE readzzi;

-- 1) Columnas de seguridad/roles en users (si no existen)
SET @db := DATABASE();

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = @db AND table_name = 'users' AND column_name = 'role'
    ),
    'SELECT "users.role ya existe" AS info',
    "ALTER TABLE users ADD COLUMN role ENUM('user','admin','logistics','marketing','publicity') NOT NULL DEFAULT 'user' AFTER alias"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = @db AND table_name = 'users' AND column_name = 'is_banned'
    ),
    'SELECT "users.is_banned ya existe" AS info',
    "ALTER TABLE users ADD COLUMN is_banned TINYINT(1) NOT NULL DEFAULT 0 AFTER role"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = @db AND table_name = 'users' AND column_name = 'ban_reason'
    ),
    'SELECT "users.ban_reason ya existe" AS info',
    "ALTER TABLE users ADD COLUMN ban_reason TEXT NULL AFTER is_banned"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = @db AND table_name = 'users' AND column_name = 'banned_at'
    ),
    'SELECT "users.banned_at ya existe" AS info',
    "ALTER TABLE users ADD COLUMN banned_at TIMESTAMP NULL AFTER ban_reason"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = @db AND table_name = 'users' AND column_name = 'avatar_url'
    ),
    'SELECT "users.avatar_url ya existe" AS info',
    "ALTER TABLE users ADD COLUMN avatar_url LONGTEXT NULL"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2) Tablas admin/comunidad
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('Pendiente','En Proceso','Enviado','Entregado','Cancelado') NOT NULL DEFAULT 'Pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  book_id VARCHAR(20),
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL
);

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

-- 3) Indices para rendimiento de login/admin/comunidad
SET @sql := (
  SELECT IF(
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='users' AND index_name='idx_users_email'),
    'SELECT "idx_users_email ya existe" AS info',
    'CREATE INDEX idx_users_email ON users(email)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='users' AND index_name='idx_users_alias'),
    'SELECT "idx_users_alias ya existe" AS info',
    'CREATE INDEX idx_users_alias ON users(alias)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='users' AND index_name='idx_users_role'),
    'SELECT "idx_users_role ya existe" AS info',
    'CREATE INDEX idx_users_role ON users(role)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='users' AND index_name='idx_users_is_banned'),
    'SELECT "idx_users_is_banned ya existe" AS info',
    'CREATE INDEX idx_users_is_banned ON users(is_banned)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='orders' AND index_name='idx_orders_status_created'),
    'SELECT "idx_orders_status_created ya existe" AS info',
    'CREATE INDEX idx_orders_status_created ON orders(status, created_at)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='posts' AND index_name='idx_posts_created_at'),
    'SELECT "idx_posts_created_at ya existe" AS info',
    'CREATE INDEX idx_posts_created_at ON posts(created_at)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='posts' AND index_name='idx_posts_community_created'),
    'SELECT "idx_posts_community_created ya existe" AS info',
    'CREATE INDEX idx_posts_community_created ON posts(community_id, created_at)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='post_reactions' AND index_name='idx_post_reactions_post'),
    'SELECT "idx_post_reactions_post ya existe" AS info',
    'CREATE INDEX idx_post_reactions_post ON post_reactions(post_id)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='post_reactions' AND index_name='idx_post_reactions_user'),
    'SELECT "idx_post_reactions_user ya existe" AS info',
    'CREATE INDEX idx_post_reactions_user ON post_reactions(user_id)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='post_comments' AND index_name='idx_post_comments_post'),
    'SELECT "idx_post_comments_post ya existe" AS info',
    'CREATE INDEX idx_post_comments_post ON post_comments(post_id)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT 'Migracion admin/comunidad/rendimiento completada' AS resultado;
