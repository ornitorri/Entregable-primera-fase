-- Migración: Crear tabla de recompensas y registro de canjes

CREATE TABLE IF NOT EXISTS rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  points_cost INT NOT NULL,
  type VARCHAR(50) DEFAULT 'frame',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reward_id INT NOT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE
);

-- Insertar recompensas ejemplo (marcos de perfil)
INSERT INTO rewards (name, description, image_url, points_cost, type) VALUES
('Marco Dorado', 'Marco dorado elegante para tu avatar', '/uploads/rewards/gold-frame.png', 200, 'frame'),
('Marco Plateado', 'Marco plateado para tu perfil', '/uploads/rewards/silver-frame.png', 120, 'frame'),
('Descuento $5.000', 'Descuento automático de $5.000 COP en la próxima compra', '', 100, 'discount');
