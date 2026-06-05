-- ========================================
-- MIGRACIÓN: Sistema de Grupos Literarios
-- ========================================
-- Crear tablas para gestionar grupos literarios
-- donde admins y embajadores pueden crear grupos
-- con aprobación de miembros

USE readzzi;

-- 1. Agregar columna de plan de suscripción a usuarios si no existe
ALTER TABLE users ADD COLUMN subscription_plan ENUM('free', 'premium', 'embajador') DEFAULT 'free' AFTER alias;

-- 2. Tabla de Grupos Literarios
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

-- 3. Tabla de Miembros del Grupo
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

-- 4. Tabla de Solicitudes de Entrada al Grupo
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

-- 5. Tabla de Conversaciones/Mensajes del Grupo
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

-- 6. Insertar temas de literatura por defecto
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

-- 7. Tabla de auditoría de acciones del grupo
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
-- RESUMEN DE MIGRACIONES
-- ========================================
-- Tablas creadas:
-- 1. literary_groups - Información principal de grupos
-- 2. group_members - Miembros del grupo
-- 3. group_join_requests - Solicitudes de entrada pendientes
-- 4. group_messages - Mensajes/conversaciones del grupo
-- 5. group_audit_log - Auditoría de acciones

-- Permisos por rol:
-- ADMIN: Crear grupos, aprobar/rechazar miembros, gestionar grupo
-- EMBAJADOR (usuario con subscription_plan='embajador'): Mismos permisos que admin
-- USER: Solicitar entrada a grupos, ver grupos públicos
