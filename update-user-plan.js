const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'readzzi'
    });
    
    const [result] = await conn.execute(
      "UPDATE users SET subscription_plan = 'embajador' WHERE id = 2"
    );
    
    console.log('✅ Actualizado:', result.affectedRows, 'usuario(s)');
    
    // Verificar el cambio
    const [user] = await conn.execute(
      'SELECT id, email, alias, subscription_plan FROM users WHERE id = 2'
    );
    console.log('Nuevo plan:', user[0]);
    
    await conn.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();
