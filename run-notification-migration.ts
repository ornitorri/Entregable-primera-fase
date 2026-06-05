import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'readzzi'
};

async function runMigration() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('[Migration] Iniciando migración de notificaciones...\n');
    
    // Crear tabla de notificaciones
    const createTableSQL = `
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
    `;
    
    await connection.execute(createTableSQL);
    console.log('✅ Tabla "notifications" creada exitosamente\n');
    
    // Verificar si hay datos en la tabla
    const [[{ count }]] = await connection.execute('SELECT COUNT(*) as count FROM notifications');
    
    if (count === 0) {
      console.log('Insertando datos de ejemplo...');
      
      // Obtener el primer usuario (admin o user)
      const [[firstUser]] = await connection.execute('SELECT id FROM users LIMIT 1');
      
      if (firstUser && firstUser.id) {
        const userId = firstUser.id;
        
        // Insertar notificaciones de ejemplo usando solo user_id válido
        const insertSQL = `
          INSERT INTO notifications (user_id, type, title, content, is_read, created_at) VALUES
          (?, 'like', 'Elena Martínez reaccionó a tu post', 'reaccionó a tu post en #RealismoMágico', FALSE, NOW() - INTERVAL 5 MINUTE),
          (?, 'comment', 'Julian Vance comentó tu reseña', 'comentó tu reseña de "1984"', FALSE, NOW() - INTERVAL 1 HOUR),
          (?, 'mention', 'Carlos Ruiz te mencionó', 'te mencionó en el grupo "Clásicos Eternos"', FALSE, NOW() - INTERVAL 2 HOUR),
          (?, 'group', 'Sofía Lectora solicitud de grupo', 'solicitó unirse a tu grupo "Escritores Bogotá"', TRUE, NOW() - INTERVAL 3 HOUR),
          (?, 'system', 'Nuevo lanzamiento disponible', 'Nuevo lanzamiento de Gabo disponible en catálogo', TRUE, NOW() - INTERVAL 5 HOUR);
        `;
        
        await connection.execute(insertSQL, [userId, userId, userId, userId, userId]);
        console.log(`✅ Datos de ejemplo insertados para user_id ${userId}\n`);
      } else {
        console.log('⚠️ No se encontraron usuarios en la BD. Tabla creada sin datos de ejemplo.\n');
      }
    } else {
      console.log(`ℹ️ La tabla ya contiene ${count} notificaciones\n`);
    }
    
    // Verificar el resultado
    const [notifications] = await connection.execute('SELECT COUNT(*) as total, SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as unread FROM notifications');
    const [notifCount] = notifications;
    
    console.log('📊 Estadísticas finales:');
    console.log(`   Total de notificaciones: ${notifCount.total}`);
    console.log(`   Sin leer: ${notifCount.unread || 0}\n`);
    
    console.log('✅ ¡Migración completada exitosamente!');
    
  } catch (error: any) {
    console.error('❌ Error durante la migración:');
    console.error(`   Código: ${error.code}`);
    console.error(`   Mensaje: ${error.message}\n`);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
