-- Script de migración para agregar campos de perfil
-- Ejecutar en MySQL Workbench si la tabla users ya existe

ALTER TABLE users 
ADD COLUMN avatar_url LONGTEXT,
ADD COLUMN bio TEXT,
ADD COLUMN location VARCHAR(100);

-- Si necesitas revertir estos cambios, usa:
-- ALTER TABLE users DROP COLUMN avatar_url, DROP COLUMN bio, DROP COLUMN location;