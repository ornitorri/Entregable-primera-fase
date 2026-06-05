-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('like', 'comment', 'mention', 'group', 'system', 'message') NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  related_user_id INT,
  related_post_id INT,
  related_group_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

-- Insertar notificaciones de ejemplo (usando solo user_id válidos)
INSERT IGNORE INTO notifications (user_id, type, title, content, is_read, created_at) VALUES
(1, 'like', 'Elena Martínez reaccionó a tu post', 'reaccionó a tu post en #RealismoMágico', FALSE, NOW() - INTERVAL 5 MINUTE),
(1, 'comment', 'Julian Vance comentó tu reseña', 'comentó tu reseña de "1984"', FALSE, NOW() - INTERVAL 1 HOUR),
(1, 'mention', 'Carlos Ruiz te mencionó', 'te mencionó en el grupo "Clásicos Eternos"', FALSE, NOW() - INTERVAL 2 HOUR),
(1, 'group', 'Sofía Lectora solicitud de grupo', 'solicitó unirse a tu grupo "Escritores Bogotá"', TRUE, NOW() - INTERVAL 3 HOUR),
(1, 'system', 'Nuevo lanzamiento disponible', 'Nuevo lanzamiento de Gabo disponible en catálogo', TRUE, NOW() - INTERVAL 5 HOUR);
