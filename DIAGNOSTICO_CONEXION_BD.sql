-- ====================================================
-- SCRIPT DE DIAGNÓSTICO DE CONEXIÓN
-- ====================================================
-- Ejecuta este script para diagnosticar problemas
-- ====================================================

-- 1. Ver la versión de MySQL
SELECT VERSION() AS 'Versión de MySQL';

-- 2. Ver el usuario actual
SELECT USER() AS 'Usuario Actual';

-- 3. Ver las BD disponibles
SHOW DATABASES;

-- 4. Ver si readzzi existe
SELECT 'BD readzzi existe' AS Resultado WHERE EXISTS (
  SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'readzzi'
);

-- 5. Cambiar a la BD readzzi
USE readzzi;

-- 6. Ver todas las tablas
SHOW TABLES;

-- 7. Ver estructura de tabla users
DESC users;

-- 8. Contar usuarios
SELECT COUNT(*) AS 'Total de Usuarios' FROM users;

-- 9. Ver usuarios existentes
SELECT id, email, alias, role FROM users LIMIT 10;

-- 10. Verificar que role existe
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN 'Columna role EXISTE'
    ELSE 'Columna role NO EXISTE'
  END AS 'Verificación'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME='users' AND TABLE_SCHEMA='readzzi' AND COLUMN_NAME='role';

-- ====================================================
-- FIN DEL DIAGNÓSTICO
-- ====================================================
