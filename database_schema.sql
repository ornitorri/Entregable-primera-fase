-- Crear base de datos Readzzi
CREATE DATABASE IF NOT EXISTS readzzi;
USE readzzi;

-- Tabla de usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  alias VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de libros
CREATE TABLE books (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  rating INT DEFAULT 5,
  cover VARCHAR(500),
  price VARCHAR(20),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías de libros
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

-- Tabla intermedia libros-categorías
CREATE TABLE book_categories (
  book_id VARCHAR(20),
  category_id INT,
  PRIMARY KEY (book_id, category_id),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabla de estantes de usuarios (libros guardados)
CREATE TABLE user_shelves (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id VARCHAR(20) NOT NULL,
  status ENUM('want_to_read', 'reading', 'read') DEFAULT 'want_to_read',
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_book (user_id, book_id)
);

-- Tabla de reseñas
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id VARCHAR(20) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Tabla de comunidades/clubes
CREATE TABLE communities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de miembros de comunidades
CREATE TABLE community_members (
  community_id INT,
  user_id INT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (community_id, user_id),
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de noticias/eventos
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id INT,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type ENUM('news', 'event') DEFAULT 'news',
  event_date DATE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de carrito de compras
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id VARCHAR(20) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_book_cart (user_id, book_id)
);

-- Tabla de pedidos
CREATE TABLE orders (
  id VARCHAR(20) PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de items de pedidos
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(20) NOT NULL,
  book_id VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Insertar datos de ejemplo para libros
INSERT INTO books (id, title, author, rating, cover, price, description) VALUES
('rdz-book-001', 'LA SOMBRA DEL VIENTO', 'Carlos Ruiz Zafón', 5, 'https://picsum.photos/seed/zafon/400/600', '45.000', 'Un libro misterioso en el Cementerio de los Libros Olvidados que cambiará la vida de Daniel Sempere para siempre.'),
('rdz-book-002', 'EL CODIGO DA VINCI', 'Dan Brown', 5, 'https://picsum.photos/seed/dan/400/600', '38.000', 'Un emocionante thriller conspiranoico sobre el Louvre, sociedades secretas y enigmas ocultos en la historia del arte.'),
('rdz-book-003', 'HARRY POTTER', 'J.K. Rowling', 5, 'https://picsum.photos/seed/hp/400/600', '52.000', 'El inicio de la saga del mago más famoso del mundo. Una historia de amistad, valor y magia en Hogwarts.'),
('rdz-book-004', 'LA CHICA DEL TREN', 'Paula Hawkins', 5, 'https://picsum.photos/seed/girl/400/600', '32.000', 'Un thriller psicológico absorbente sobre una desaparición misteriosa vista a través de los ojos de tres mujeres.'),
('rdz-book-005', 'DUNE', 'Frank Herbert', 5, 'https://picsum.photos/seed/dune/400/600', '65.000', 'La épica de ciencia ficción más importante de todos los tiempos, ambientada en el peligroso planeta Arrakis.'),
('rdz-book-006', '1984', 'George Orwell', 5, 'https://picsum.photos/seed/1984/400/600', '28.000', 'La distopía definitiva sobre la vigilancia total, el control del pensamiento y la pérdida de la libertad individual.'),
('rdz-book-007', 'CIEN AÑOS DE SOLEDAD', 'G. García Márquez', 5, 'https://picsum.photos/seed/gabo/400/600', '85.000', 'La obra maestra del realismo mágico colombiano que narra la historia de siete generaciones de la familia Buendía.'),
('rdz-book-008', 'EL ALQUIMISTA', 'Paulo Coelho', 5, 'https://picsum.photos/seed/coelho/400/600', '25.000', 'Un viaje espiritual inspirador sobre la búsqueda de los sueños y la escucha del lenguaje del corazón.');

-- Insertar categorías
INSERT INTO categories (name, description) VALUES
('Ficción', 'Libros de narrativa ficticia'),
('No Ficción', 'Libros basados en hechos reales'),
('Ciencia Ficción', 'Historias ambientadas en futuros o mundos alternos'),
('Fantasía', 'Historias con elementos mágicos y sobrenaturales'),
('Misterio', 'Libros de suspense y enigmas'),
('Romance', 'Historias de amor y relaciones'),
('Biografía', 'Vidas de personas reales'),
('Historia', 'Eventos y períodos históricos');

-- Asignar categorías a libros (ejemplo)
INSERT INTO book_categories (book_id, category_id) VALUES
('rdz-book-001', 1), ('rdz-book-001', 5),
('rdz-book-002', 1), ('rdz-book-002', 5),
('rdz-book-003', 4),
('rdz-book-004', 5),
('rdz-book-005', 3),
('rdz-book-006', 1), ('rdz-book-006', 2),
('rdz-book-007', 1),
('rdz-book-008', 1), ('rdz-book-008', 2);

-- Insertar logros de ejemplo
INSERT INTO achievements (name, description, icon, points) VALUES
('Primer Libro', 'Agrega tu primer libro al estante', 'book', 10),
('Lector Ávido', 'Lee 10 libros', 'reader', 50),
('Crítico', 'Escribe 5 reseñas', 'star', 25),
('Comunitario', 'Únete a una comunidad', 'users', 15),
('Coleccionista', 'Agrega 50 libros al estante', 'library', 100);