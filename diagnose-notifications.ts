import mysql from 'mysql2/promise';

(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'readzzi'
  });

  try {
    console.log('\n🔍 DIAGNÓSTICO DEL SISTEMA DE NOTIFICACIONES\n');
    console.log('='.repeat(60));

    // 1. Verificar estructura de tablas
    console.log('\n1️⃣ VERIFICANDO ESTRUCTURAS DE TABLAS:');
    
    const [tableCheck] = await connection.execute(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'readzzi' 
      AND TABLE_NAME IN ('notifications', 'posts', 'post_comments', 'post_reactions', 'users')
    `);
    
    console.log(`   ✅ Tablas encontradas: ${tableCheck.length}/5`);
    tableCheck.forEach((row: any) => console.log(`      - ${row.TABLE_NAME}`));

    // 2. Verificar usuarios
    console.log('\n2️⃣ VERIFICANDO USUARIOS:');
    const [users] = await connection.execute(`
      SELECT id, CONCAT(first_name, ' ', last_name) as name FROM users LIMIT 5
    `);
    console.log(`   Total de usuarios: ${users.length}`);
    users.forEach((user: any) => console.log(`      - ID ${user.id}: ${user.name}`));

    // 3. Verificar posts
    console.log('\n3️⃣ VERIFICANDO POSTS EN LA COMUNIDAD:');
    const [posts] = await connection.execute(`
      SELECT id, user_id, LEFT(content, 50) as preview FROM posts LIMIT 5
    `);
    console.log(`   Total de posts: ${posts.length}`);
    posts.forEach((post: any) => console.log(`      - ID ${post.id}: Autor ${post.user_id} - "${post.preview}..."`));

    // 4. Verificar comentarios
    console.log('\n4️⃣ VERIFICANDO COMENTARIOS:');
    const [comments] = await connection.execute(`
      SELECT COUNT(*) as total FROM post_comments
    `);
    console.log(`   Total de comentarios: ${comments[0].total}`);

    // 5. Verificar reacciones
    console.log('\n5️⃣ VERIFICANDO REACCIONES:');
    const [reactions] = await connection.execute(`
      SELECT COUNT(*) as total FROM post_reactions
    `);
    console.log(`   Total de reacciones: ${reactions[0].total}`);

    // 6. Verificar notificaciones
    console.log('\n6️⃣ VERIFICANDO NOTIFICACIONES:');
    const [notifications] = await connection.execute(`
      SELECT 
        n.id, 
        n.user_id, 
        n.type, 
        n.title,
        n.is_read,
        u.first_name,
        u.last_name
      FROM notifications n
      JOIN users u ON n.user_id = u.id
      ORDER BY n.created_at DESC
      LIMIT 10
    `);
    
    console.log(`   Total de notificaciones: ${notifications.length}`);
    notifications.forEach((notif: any, i) => {
      console.log(`   ${i+1}. [${notif.type}] Para ${notif.first_name} ${notif.last_name}`);
      console.log(`      ${notif.title}`);
      console.log(`      Estado: ${notif.is_read ? '✅ Leído' : '🔴 Sin leer'}\n`);
    });

    // 7. Estadísticas de notificaciones
    console.log('\n7️⃣ ESTADÍSTICAS:');
    const [[stats]] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread,
        COUNT(DISTINCT CASE WHEN type = 'like' THEN 1 END) as likes,
        COUNT(DISTINCT CASE WHEN type = 'comment' THEN 1 END) as comments,
        COUNT(DISTINCT CASE WHEN type = 'mention' THEN 1 END) as mentions
      FROM notifications
    `);
    
    console.log(`   Total: ${stats.total}`);
    console.log(`   Sin leer: ${stats.unread || 0}`);
    console.log(`   Por tipo:`);
    console.log(`     - Likes: ${stats.likes}`);
    console.log(`     - Comentarios: ${stats.comments}`);
    console.log(`     - Menciones: ${stats.mentions}`);

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ DIAGNÓSTICO COMPLETADO');
    console.log('\n📌 PRÓXIMOS PASOS:');
    console.log('   1. Reinicia el servidor (npm run dev)');
    console.log('   2. Inicia sesión con dos usuarios diferentes');
    console.log('   3. Usuario A: Comenta o reacciona al post de Usuario B');
    console.log('   4. Usuario B: Abre "Avisos" para ver la notificación');

  } catch (error: any) {
    console.error('\n❌ Error durante el diagnóstico:');
    console.error(error.message);
  } finally {
    await connection.end();
  }
})();
