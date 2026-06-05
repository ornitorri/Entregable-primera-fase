-- ====================================================
-- SCRIPT DE VERIFICACIÓN POST-MIGRACIÓN
-- ====================================================
-- Ejecuta este script DESPUÉS de ejecutar SETUP_COMPLETO_BD_Y_USUARIOS.sql
-- Verifica que todo está configurado correctamente
-- ====================================================

USE readzzi;

-- 1. Verificar que la tabla tiene las columnas correctas
SELECT 
  'Estructura de tabla users' AS Verificacion,
  COUNT(*) AS Columnas_Esperadas
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users' 
  AND TABLE_SCHEMA = 'readzzi'
  AND COLUMN_NAME IN ('id', 'first_name', 'last_name', 'email', 'alias', 'password', 'role', 'is_banned', 'avatar_url');

-- 2. Listar todas las columnas de la tabla users
SELECT 
  'Columnas de users' AS Tipo,
  COLUMN_NAME,
  COLUMN_TYPE,
  IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = 'readzzi'
ORDER BY ORDINAL_POSITION;

-- 3. Contar usuarios
SELECT 
  'Cantidad de usuarios' AS Verificacion,
  COUNT(*) AS Total
FROM users;

-- 4. Ver todos los usuarios con sus detalles
SELECT 
  CONCAT('Usuario: ', id) AS 'Información',
  email AS 'Email',
  alias AS 'Alias',
  role AS 'Rol',
  CASE WHEN is_banned = 1 THEN 'BANEADO' ELSE 'Activo' END AS 'Estado'
FROM users
ORDER BY id;

-- 5. Verificar que hay al menos un usuario de cada rol
SELECT 
  'Usuarios por rol' AS Verificacion,
  role AS 'Rol',
  COUNT(*) AS 'Cantidad'
FROM users
GROUP BY role;

-- 6. Verificar que la contraseña de al menos un usuario no es nula
SELECT 
  'Verificación de contraseñas' AS Verificacion,
  COUNT(*) AS 'Usuarios con contraseña'
FROM users
WHERE password IS NOT NULL AND password != '';

-- 7. Resumen ejecutivo
SELECT '✅ VERIFICACIÓN COMPLETADA' AS Resultado;
SELECT 'Si ves todos los resultados arriba, todo está correctamente configurado.' AS Instrucción;
SELECT 'Ahora puedes intentar hacer login con:' AS ProxímoPaso;
SELECT '  Email: admin@readzzi.com' AS CredencialesDemo;
SELECT '  Contraseña: password123' AS CredencialesDemo2;
