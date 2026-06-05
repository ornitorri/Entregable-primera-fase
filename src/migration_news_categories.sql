USE readzzi;

SET @db := DATABASE();

-- summary
SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema=@db AND table_name='news' AND column_name='summary'
    ),
    'SELECT "news.summary ya existe" AS info',
    "ALTER TABLE news ADD COLUMN summary TEXT NULL AFTER title"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- image_url
SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema=@db AND table_name='news' AND column_name='image_url'
    ),
    'SELECT "news.image_url ya existe" AS info',
    "ALTER TABLE news ADD COLUMN image_url LONGTEXT NULL AFTER content"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- location
SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema=@db AND table_name='news' AND column_name='location'
    ),
    'SELECT "news.location ya existe" AS info',
    "ALTER TABLE news ADD COLUMN location VARCHAR(150) NULL AFTER image_url"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- category
SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema=@db AND table_name='news' AND column_name='category'
    ),
    'SELECT "news.category ya existe" AS info',
    "ALTER TABLE news ADD COLUMN category ENUM('noticias','giras','ferias','lanzamientos','entrevistas') NOT NULL DEFAULT 'noticias' AFTER location"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Índices
SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.statistics
      WHERE table_schema=@db AND table_name='news' AND index_name='idx_news_category'
    ),
    'SELECT "idx_news_category ya existe" AS info',
    "CREATE INDEX idx_news_category ON news(category)"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.statistics
      WHERE table_schema=@db AND table_name='news' AND index_name='idx_news_published_at'
    ),
    'SELECT "idx_news_published_at ya existe" AS info',
    "CREATE INDEX idx_news_published_at ON news(published_at)"
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT 'Migración de categorías de noticias completada' AS resultado;
