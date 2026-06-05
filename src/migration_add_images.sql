-- Agregar campo para imágenes en mensajes de grupo
ALTER TABLE group_messages 
ADD COLUMN image_data LONGBLOB NULL AFTER message;

-- Agregar índice para búsquedas rápidas
ALTER TABLE group_messages 
ADD INDEX idx_group_created (group_id, created_at);

-- Opcional: Agregar campo para imágenes en posts de comunidad
ALTER TABLE community_posts 
ADD COLUMN image_url VARCHAR(500) NULL AFTER content;

ALTER TABLE community_posts 
ADD COLUMN image_data LONGBLOB NULL AFTER image_url;
