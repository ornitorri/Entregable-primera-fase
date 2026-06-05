const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    // Hashear password123 con bcryptjs (igual a como lo hace el sistema)
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('Hash generado:', hashedPassword);
    
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'readzzi'
    });
    
    const [result] = await conn.execute(
      'UPDATE users SET password = ? WHERE id = 2',
      [hashedPassword]
    );
    
    console.log('✅ Contraseña actualizada:', result.affectedRows, 'usuario(s)');
    
    await conn.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();
