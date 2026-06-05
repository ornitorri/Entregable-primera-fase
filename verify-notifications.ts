import mysql from 'mysql2/promise';

(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'readzzi'
  });

  try {
    const [results] = await connection.execute('SELECT id, type, title, is_read, created_at FROM notifications ORDER BY created_at DESC');
    
    console.log('\n✅ NOTIFICACIONES EN LA BD:\n');
    results.forEach((notif, i) => {
      console.log(`${i+1}. [${notif.type.toUpperCase()}] ${notif.title}`);
      console.log(`   Estado: ${notif.is_read ? '✅ Leído' : '🔴 Sin leer'}`);
      console.log(`   ID: ${notif.id}\n`);
    });

    const [[{ total, unread }]] = await connection.execute(`
      SELECT COUNT(*) as total, SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread 
      FROM notifications
    `);
    
    console.log('📊 RESUMEN:');
    console.log(`   Total: ${total}`);
    console.log(`   Sin leer: ${unread || 0}\n`);
    
    console.log('✅ ¡LA MIGRACIÓN ESTÁ LISTA PARA USAR!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
})();
