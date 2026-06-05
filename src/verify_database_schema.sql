-- Verificación de compatibilidad de esquema para Readzzi
-- Ejecutar en MySQL Workbench sobre la base "readzzi"

USE readzzi;

-- 1) Tablas requeridas (core)
SELECT
  t.table_name,
  CASE WHEN t.table_name IS NULL THEN 'MISSING' ELSE 'OK' END AS status
FROM (
  SELECT 'users' AS table_name
  UNION ALL SELECT 'books'
  UNION ALL SELECT 'categories'
  UNION ALL SELECT 'book_categories'
  UNION ALL SELECT 'user_shelves'
  UNION ALL SELECT 'reviews'
  UNION ALL SELECT 'communities'
  UNION ALL SELECT 'community_members'
  UNION ALL SELECT 'news'
  UNION ALL SELECT 'achievements'
  UNION ALL SELECT 'user_achievements'
) req
LEFT JOIN information_schema.tables t
  ON t.table_schema = DATABASE() AND t.table_name = req.table_name;

-- 2) Columnas mínimas para autenticación (obligatorias)
SELECT
  req.column_name,
  CASE WHEN c.column_name IS NULL THEN 'MISSING' ELSE 'OK' END AS status
FROM (
  SELECT 'id' AS column_name
  UNION ALL SELECT 'first_name'
  UNION ALL SELECT 'last_name'
  UNION ALL SELECT 'email'
  UNION ALL SELECT 'alias'
  UNION ALL SELECT 'password'
  UNION ALL SELECT 'phone'
) req
LEFT JOIN information_schema.columns c
  ON c.table_schema = DATABASE()
  AND c.table_name = 'users'
  AND c.column_name = req.column_name;

-- 3) Columnas opcionales usadas por funcionalidades avanzadas
SELECT
  req.column_name,
  CASE WHEN c.column_name IS NULL THEN 'OPTIONAL_MISSING' ELSE 'OK' END AS status
FROM (
  SELECT 'role' AS column_name
  UNION ALL SELECT 'is_banned'
  UNION ALL SELECT 'avatar_url'
  UNION ALL SELECT 'bio'
  UNION ALL SELECT 'location'
) req
LEFT JOIN information_schema.columns c
  ON c.table_schema = DATABASE()
  AND c.table_name = 'users'
  AND c.column_name = req.column_name;

-- 4) Tablas opcionales de migración admin/comunidad extendida
SELECT
  req.table_name,
  CASE WHEN t.table_name IS NULL THEN 'OPTIONAL_MISSING' ELSE 'OK' END AS status
FROM (
  SELECT 'orders' AS table_name
  UNION ALL SELECT 'order_items'
  UNION ALL SELECT 'posts'
  UNION ALL SELECT 'post_reactions'
  UNION ALL SELECT 'post_comments'
  UNION ALL SELECT 'user_ban_logs'
) req
LEFT JOIN information_schema.tables t
  ON t.table_schema = DATABASE() AND t.table_name = req.table_name;

