-- DIAGNÓSTICO: Verificar columnas existentes en tabla users
-- Ejecuta este script en MySQL para saber qué columnas ya existen

USE readzzi;

-- Ver estructura actual de la tabla users
DESCRIBE users;

-- Ver si las columnas específicas existen
SELECT 
  COLUMN_NAME,
  COLUMN_TYPE,
  IS_NULLABLE,
  COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = 'readzzi'
AND COLUMN_NAME IN ('role', 'is_banned', 'ban_reason', 'banned_at');

-- Si necesitas AGREGAR SOLO LAS COLUMNAS FALTANTES, ejecuta según el resultado arriba:

-- Opción A: Si NO existen NINGUNA de las columnas
-- (Ejecuta esto si el diagnóstico anterior no muestra filas)
/*
ALTER TABLE users 
ADD COLUMN role ENUM('user', 'admin', 'logistics', 'marketing', 'publicity') DEFAULT 'user' AFTER alias,
ADD COLUMN is_banned BOOLEAN DEFAULT FALSE,
ADD COLUMN ban_reason TEXT,
ADD COLUMN banned_at TIMESTAMP NULL;
*/

-- Opción B: Si EXISTEN ALGUNAS columnas pero faltan otras
-- (Ejecuta solo las líneas que necesites según el diagnóstico)
/*
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin', 'logistics', 'marketing', 'publicity') DEFAULT 'user' AFTER alias;
ALTER TABLE users ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN ban_reason TEXT;
ALTER TABLE users ADD COLUMN banned_at TIMESTAMP NULL;
*/

-- Opción C: Si TODAS existen (como en tu caso)
-- No necesitas hacer nada, las columnas ya están en la tabla

-- Después de agregar las columnas, continúa con el resto de la migración:
-- Las tablas: orders, order_items, posts, post_reactions, post_comments ya pueden crearse sin problemas
