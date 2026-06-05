-- ====================================================
-- SCRIPT COMPLETO DE DIAGNÓSTICO Y SETUP
-- ====================================================
-- Ejecuta este script completo en MySQL Workbench
-- ====================================================

-- 1. DIAGNÓSTICO - Ver estado actual
USE readzzi;

-- Mostrar estructura de la tabla users
DESC users;

-- Mostrar todos los usuarios existentes
SELECT id, email, alias, first_name, last_name FROM users;

-- ====================================================
-- 2. EJECUTAR MIGRACIÓN (Si no se ha hecho)
-- ====================================================

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role ENUM('user','admin','logistics','marketing','publicity') NOT NULL DEFAULT 'user' AFTER alias;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_banned TINYINT(1) NOT NULL DEFAULT 0 AFTER role;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS ban_reason TEXT NULL AFTER is_banned;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP NULL AFTER ban_reason;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url LONGTEXT NULL;

-- ====================================================
-- 3. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- ====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_alias ON users(alias);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_banned ON users(is_banned);

-- ====================================================
-- 4. CREAR USUARIOS DE PRUEBA (IMPORTANTE!)
-- ====================================================
-- Contraseña de todos: password123
-- Hash generado con bcryptjs: $2a$10$REPLACE_WITH_HASHED_PASSWORD

-- USUARIO ADMIN
INSERT INTO users (first_name, last_name, email, alias, password, phone, role) 
VALUES (
  'Admin',
  'Usuario',
  'admin@readzzi.com',
  'admin_user',
  '$2a$10$ZeIx0hLfPmLjU/yYJ1XvseRtI.hLnDjNKCKL5jNmLPfSQKkTG0vGC', -- password123
  '1234567890',
  'admin'
)
ON DUPLICATE KEY UPDATE role='admin', first_name='Admin', last_name='Usuario';

-- USUARIO NORMAL
INSERT INTO users (first_name, last_name, email, alias, password, phone, role)
VALUES (
  'Usuario',
  'Normal',
  'user@readzzi.com',
  'usuario_normal',
  '$2a$10$ZeIx0hLfPmLjU/yYJ1XvseRtI.hLnDjNKCKL5jNmLPfSQKkTG0vGC', -- password123
  '1234567890',
  'user'
)
ON DUPLICATE KEY UPDATE role='user', first_name='Usuario', last_name='Normal';

-- USUARIO MARKETING
INSERT INTO users (first_name, last_name, email, alias, password, phone, role)
VALUES (
  'Marketing',
  'Manager',
  'marketing@readzzi.com',
  'marketing_user',
  '$2a$10$ZeIx0hLfPmLjU/yYJ1XvseRtI.hLnDjNKCKL5jNmLPfSQKkTG0vGC', -- password123
  '1234567890',
  'marketing'
)
ON DUPLICATE KEY UPDATE role='marketing', first_name='Marketing', last_name='Manager';

-- USUARIO PUBLICIDAD
INSERT INTO users (first_name, last_name, email, alias, password, phone, role)
VALUES (
  'Publicidad',
  'Manager',
  'publicidad@readzzi.com',
  'publicidad_user',
  '$2a$10$ZeIx0hLfPmLjU/yYJ1XvseRtI.hLnDjNKCKL5jNmLPfSQKkTG0vGC', -- password123
  '1234567890',
  'publicity'
)
ON DUPLICATE KEY UPDATE role='publicity', first_name='Publicidad', last_name='Manager';

-- USUARIO LOGÍSTICA
INSERT INTO users (first_name, last_name, email, alias, password, phone, role)
VALUES (
  'Logística',
  'Manager',
  'logistica@readzzi.com',
  'logistica_user',
  '$2a$10$ZeIx0hLfPmLjU/yYJ1XvseRtI.hLnDjNKCKL5jNmLPfSQKkTG0vGC', -- password123
  '1234567890',
  'logistics'
)
ON DUPLICATE KEY UPDATE role='logistics', first_name='Logística', last_name='Manager';

-- ====================================================
-- 5. VERIFICACIÓN FINAL
-- ====================================================

-- Ver todos los usuarios con sus roles
SELECT 
  id,
  CONCAT(first_name, ' ', last_name) AS nombre,
  email,
  alias,
  role,
  is_banned
FROM users
ORDER BY id;

-- Verificar que la columna role existe
SELECT COLUMN_NAME, COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME='users' AND TABLE_SCHEMA='readzzi' AND COLUMN_NAME='role';

-- ====================================================
-- FIN DEL SCRIPT
-- ====================================================
-- USUARIOS DE PRUEBA CREADOS:
-- ====================================================
-- Admin:
--   Email: admin@readzzi.com
--   Password: password123
--   Rol: admin
--
-- Usuario Normal:
--   Email: user@readzzi.com
--   Password: password123
--   Rol: user
--
-- Marketing:
--   Email: marketing@readzzi.com
--   Password: password123
--   Rol: marketing
--
-- Publicidad:
--   Email: publicidad@readzzi.com
--   Password: password123
--   Rol: publicity
--
-- Logística:
--   Email: logistica@readzzi.com
--   Password: password123
--   Rol: logistics
-- ====================================================
