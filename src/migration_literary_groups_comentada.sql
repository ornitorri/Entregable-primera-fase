-- ========================================
-- MIGRACIÓN RÁPIDA: GRUPOS LITERARIOS
-- Copia y ejecuta este archivo completo en MySQL
-- ========================================

USE readzzi;

-- ========================================
-- PASO 1: Agregar columna de plan a usuarios
-- ========================================
-- Si la columna ya existe, esto no causa error (ADD IF NOT EXISTS no existe en MySQL)
-- Ejecuta el siguiente ALTER TABLE solo si no tienes la columna subscription_plan

-- Descomenta la siguiente línea si la columna NO existe:
-- ALTER TABLE users ADD COLUMN subscription_plan ENUM('free', 'premium', 'embajador') DEFAULT 'free' AFTER alias;

-- Para verificar si la columna existe, ejecuta:
-- SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='users' AND COLUMN_NAME='subscription_plan';

-- ========================================
-- PASO 2: Crear tabla de Grupos Literarios
-- ========================================

CREATE TABLE IF NOT EXISTS literary_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  topic VARCHAR(100) NOT NULL COMMENT 'Tema de literatura (ej: ciencia ficción, romance, etc)',
  cover_image VARCHAR(500),
  created_by INT NOT NULL,
  status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  max_members INT DEFAULT 1000,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_created_by (created_by),
  INDEX idx_topic (topic),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PASO 3: Crear tabla de Miembros del Grupo
-- ========================================

CREATE TABLE IF NOT EXISTS group_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('admin', 'moderator', 'member') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES literary_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_group_member (group_id, user_id),
  INDEX idx_group_id (group_id),
  INDEX idx_user_id (user_id),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PASO 4: Crear tabla de Solicitudes de Entrada
-- ========================================

CREATE TABLE IF NOT EXISTS group_join_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  message TEXT COMMENT 'Mensaje opcional del usuario al solicitar entrada',
  reviewed_by INT COMMENT 'ID del admin/moderador que revisó',
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES literary_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_group_user_request (group_id, user_id),
  INDEX idx_group_id (group_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PASO 5: Crear tabla de Mensajes del Grupo
-- ========================================

CREATE TABLE IF NOT EXISTS group_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (group_id) REFERENCES literary_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_group_id (group_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PASO 6: Crear tabla de Auditoría
-- ========================================

CREATE TABLE IF NOT EXISTS group_audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL COMMENT 'create_group, add_member, remove_member, etc',
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES literary_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_group_id (group_id),
  INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PASO 7: Insertar Temas de Literatura (Categorías)
-- ========================================

INSERT IGNORE INTO categories (name, description) VALUES
('Ciencia Ficción', 'Historias futuristas y tecnológicas'),
('Romance', 'Historias de amor y relaciones'),
('Misterio', 'Novelas de intriga y detectives'),
('Fantasía', 'Mundos mágicos e imaginarios'),
('Suspenso', 'Historias emocionantes y de tensión'),
('Realismo Mágico', 'Mezcla de lo real con lo fantástico'),
('Poesía', 'Obras literarias en verso'),
('Clásicos', 'Literatura clásica e histórica'),
('Desarrollo Personal', 'Libros de autoayuda y crecimiento'),
('Historia', 'Relatos históricos y biográficos');

-- ========================================
-- VERIFICACIÓN: Ver si todo se creó correctamente
-- ========================================

-- Descomenta las siguientes líneas para verificar:

-- Ver tablas creadas:
-- SHOW TABLES LIKE 'literary%';
-- SHOW TABLES LIKE 'group%';

-- Ver estructura de tablas:
-- DESCRIBE literary_groups;
-- DESCRIBE group_members;
-- DESCRIBE group_join_requests;
-- DESCRIBE group_messages;
-- DESCRIBE group_audit_log;

-- Ver categorías insertadas:
-- SELECT * FROM categories WHERE name IN ('Ciencia Ficción', 'Romance', 'Realismo Mágico', 'Poesía', 'Clásicos', 'Historia', 'Desarrollo Personal', 'Misterio', 'Fantasía', 'Suspenso');

-- Ver usuarios y su plan:
-- SELECT id, alias, subscription_plan FROM users LIMIT 10;

-- ========================================
-- DATOS DE EJEMPLO (Descomenta si quieres)
-- ========================================

-- Crear un usuario embajador:
-- UPDATE users SET subscription_plan = 'embajador' WHERE id = 2;

-- Crear un grupo de prueba:
-- INSERT INTO literary_groups (name, description, topic, created_by) 
-- VALUES ('Amantes del Realismo Mágico', 'Discutimos la obra de García Márquez', 'Realismo Mágico', 1);

-- Agregar creador como admin del grupo:
-- INSERT INTO group_members (group_id, user_id, role) VALUES (1, 1, 'admin');

-- ========================================
-- ¡MIGRACIÓN COMPLETADA! ✅
-- ========================================

-- Próximos pasos:
-- 1. Los APIs están en: src/app/api/groups/
-- 2. Los componentes están en: src/components/groups/
-- 3. Las páginas están en: src/app/grupos/
-- 4. Lee GUIA_GRUPOS_LITERARIOS.md para documentación completa
-- 5. Lee QUICK_START_GRUPOS.md para comenzar rápido
