-- Script de verificación y creación de estructura para Global Feed (Feed Comunitario)
-- Este script asegura que todas las tablas necesarias existen y están correctamente configuradas
-- Ejecutar en MySQL después de database_schema.sql y migration_admin_features.sql

USE readzzi;

-- 1. VERIFICAR Y CREAR TABLA posts
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
  INDEX idx_user_id (user_id),
  INDEX idx_community_id (community_id),
  INDEX idx_created_at (created_at)
);

-- 2. VERIFICAR Y CREAR TABLA post_reactions
CREATE TABLE IF NOT EXISTS post_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_post_reaction (post_id, user_id),
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id)
);

-- 3. VERIFICAR Y CREAR TABLA post_comments
CREATE TABLE IF NOT EXISTS post_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- 4. VERIFICAR QUE EXISTAN COLUMNAS EN TABLA users
-- (Estas deberían estar del migration_admin_features.sql pero verificamos)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin', 'logistics', 'marketing', 'publicity') DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ban_reason TEXT,
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP NULL;

-- 5. VERIFICAR ÍNDICES IMPORTANTES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_users_is_banned ON users(is_banned);

-- 6. VERIFICAR EXISTENCIA DE TABLA communities (para validar foreign keys)
CREATE TABLE IF NOT EXISTS communities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. VISTA ÚTIL PARA OBTENER DATOS DE POSTS CON CONTEOS
CREATE OR REPLACE VIEW posts_with_counts AS
SELECT 
  p.id,
  p.user_id,
  p.community_id,
  p.content,
  p.image_url,
  p.book_mention_id,
  p.created_at,
  p.updated_at,
  u.first_name,
  u.last_name,
  u.avatar_url,
  u.role,
  u.is_banned,
  b.title as book_title,
  b.author as book_author,
  b.cover as book_cover,
  b.price as book_price,
  COALESCE(pr_count.reaction_count, 0) as total_reactions,
  COALESCE(pc_count.comment_count, 0) as total_comments
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN books b ON p.book_mention_id = b.id
LEFT JOIN (
  SELECT post_id, COUNT(*) as reaction_count 
  FROM post_reactions 
  GROUP BY post_id
) pr_count ON p.id = pr_count.post_id
LEFT JOIN (
  SELECT post_id, COUNT(*) as comment_count 
  FROM post_comments 
  GROUP BY post_id
) pc_count ON p.id = pc_count.post_id;

-- 8. ANÁLISIS DE TAMAÑO Y ROWS (para debugging)
SELECT 'Verificación completada' as status;
SELECT 'POSTS' as tabla, COUNT(*) as total_rows FROM posts UNION ALL
SELECT 'POST_REACTIONS', COUNT(*) FROM post_reactions UNION ALL
SELECT 'POST_COMMENTS', COUNT(*) FROM post_comments;

-- FIN DE VERIFICACIÓN
-- Si ves "Verificación completada" arriba, todas las tablas han sido creadas exitosamente
