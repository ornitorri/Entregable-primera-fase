# 🔧 GUÍA DE INSTALACIÓN Y VERIFICACIÓN - GLOBAL FEED

## Paso 1: Ejecutar Migraciones de BD

### Opción A: MySQL Workbench o CLI
```bash
# Conectar a MySQL
mysql -u usuario -p

# Ejecutar migración principal
source src/migration_admin_features.sql;

# Ejecutar script de verificación
source src/verify_global_feed_schema.sql;
```

### Opción B: Desde Node.js (si tienes conexión configurada)
```javascript
// En tu script de setup
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'readzzi'
});

const migrationSQL = fs.readFileSync('src/migration_admin_features.sql', 'utf8');
await connection.query(migrationSQL);

const verifySQL = fs.readFileSync('src/verify_global_feed_schema.sql', 'utf8');
await connection.query(verifySQL);
```

---

## Paso 2: Verificar la Instalación

### 1. Verificar Tablas en BD
```sql
-- Ejecutar en MySQL
USE readzzi;

-- Debe retornar 3
SELECT COUNT(*) as tabla_count FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'readzzi' AND TABLE_NAME IN ('posts', 'post_reactions', 'post_comments');

-- Ver estructura
DESCRIBE posts;
DESCRIBE post_reactions;
DESCRIBE post_comments;

-- Ver datos
SELECT COUNT(*) FROM posts;
SELECT COUNT(*) FROM post_reactions;
SELECT COUNT(*) FROM post_comments;
```

### 2. Verificar API Endpoints
```bash
# En terminal, con tu servidor Next.js ejecutandose:
# npm run dev

# Test 1: Crear Post (requiere autenticación)
curl -X POST http://localhost:3000/api/community/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -d '{"content":"Mi primer post en el feed global!"}'

# Expected: { id, content, created_at, ... }

# Test 2: Obtener Posts
curl -X GET http://localhost:3000/api/community/posts

# Expected: Array de posts

# Test 3: Reaccionar a Post
curl -X POST http://localhost:3000/api/community/reactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -d '{"postId":1,"emoji":"❤️"}'

# Expected: { success: true }
```

### 3. Test en UI
1. Ir a `http://localhost:3000/comunidad`
2. Iniciar sesión si no estás autenticado
3. Escribir un mensaje en el cuadro de publicación
4. Hacer click en "Publicar"
5. Verificar que el post aparezca en el feed
6. Hacer click en un emoji para reaccionar
7. Hacer click en "Comentarios" para comentar

---

## Paso 3: Troubleshooting

### Problema: "Error: UNIQUE constraint failed"
**Causa**: Intentó reaccionar dos veces al mismo post
**Solución**: Ya implementado - puede cambiar emoji o eliminar reacción

### Problema: "No autorizado"
**Causa**: Token JWT inválido o no enviado
**Solución**: 
- Verificar que `Authorization: Bearer {token}` está en headers
- Verificar que el token no ha expirado
- Re-autenticarse

### Problema: "Tu cuenta ha sido baneada"
**Causa**: El usuario está baneado en la BD
**Solución**: 
```sql
UPDATE users SET is_banned = FALSE WHERE id = 123;
```

### Problema: Posts no aparecen
**Causa**: 
- Tablas no existen
- Conexión a BD no funciona
- CORS bloqueado

**Solución**:
- Ejecutar migraciones nuevamente
- Verificar `database_schema.sql` se ejecutó
- Revisar logs de la consola del navegador

### Problema: "Este post no existe"
**Causa**: ID de post inválido
**Solución**: Usar ID de post que realmente existe

---

## Paso 4: Variables de Entorno Requeridas

Asegurate de tener en `.env.local`:
```env
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/readzzi
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=readzzi
JWT_SECRET=tu_secreto_jwt
NODE_ENV=development
```

---

## Paso 5: Verificación de Integridad

### Queries útiles para debugging:
```sql
-- Ver todos los posts del usuario
SELECT * FROM posts WHERE user_id = 123;

-- Ver reacciones de un post
SELECT * FROM post_reactions WHERE post_id = 1;

-- Ver comentarios de un post
SELECT * FROM post_comments WHERE post_id = 1;

-- Ver usuarios baneados
SELECT * FROM users WHERE is_banned = TRUE;

-- Estadísticas del feed
SELECT 
  'Posts' as tipo, COUNT(*) as total FROM posts
UNION ALL
SELECT 'Reacciones', COUNT(*) FROM post_reactions
UNION ALL
SELECT 'Comentarios', COUNT(*) FROM post_comments
UNION ALL
SELECT 'Usuarios activos', COUNT(DISTINCT user_id) FROM posts;
```

---

## Paso 6: Performance Tips

### Índices ya creados:
- `idx_posts_created_at` - Sorting rápido
- `idx_post_reactions_post_id` - Reacciones rápidas
- `idx_post_comments_post_id` - Comentarios rápidos

### Para mantener performance:
```sql
-- Analizar tabla
ANALYZE TABLE posts;
ANALYZE TABLE post_reactions;
ANALYZE TABLE post_comments;

-- Optimizar tabla
OPTIMIZE TABLE posts;
OPTIMIZE TABLE post_reactions;
OPTIMIZE TABLE post_comments;
```

---

## ✅ Checklist Final

- [ ] Base de datos conectada y funcionando
- [ ] Migraciones ejecutadas sin errores
- [ ] Tablas creadas correctamente
- [ ] Índices disponibles
- [ ] API endpoints respondiendo
- [ ] UI comunidad cargando
- [ ] Post se crea y guarda
- [ ] Reacciones funcionan
- [ ] Comentarios funcionan
- [ ] Botones de eliminar funcionan
- [ ] Validaciones correctas
- [ ] Errores mostrados al usuario

---

## 📞 Soporte

Si tienes problemas:
1. Revisar logs de BD: `SHOW WARNINGS;`
2. Revisar console del navegador (F12)
3. Revisar terminal de Next.js
4. Ejecutar `verify_global_feed_schema.sql` nuevamente
5. Limpiar caché y cookies del navegador

---

**Última actualización**: 27 de Abril, 2026
