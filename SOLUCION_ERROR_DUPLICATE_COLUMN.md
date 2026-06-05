# 🔧 SOLUCIÓN: Error "Duplicate column name 'role'"

## 🎯 Resumen del Problema

El error `Error Code: 1060. Duplicate column name 'role'` significa que **las columnas ya existen** en tu tabla `users`. Esto ocurre cuando:
- La migración ya se ejecutó anteriormente
- Las columnas se agregaron manualmente
- Se ejecutó el script más de una vez

---

## ✅ SOLUCIÓN RÁPIDA

### Opción 1: Usar el nuevo script idempotente (RECOMENDADO)
He actualizado `migration_admin_features.sql` para usar `IF NOT EXISTS`:

```bash
# En MySQL Workbench, ejecuta:
source src/migration_admin_features.sql;
```

Ahora es seguro ejecutarlo múltiples veces sin errores.

---

### Opción 2: Ejecutar solo las tablas que faltan (MÁS RÁPIDO)
Si ya tienes las columnas de `users`, ejecuta solo esto:

```bash
# En MySQL Workbench, ejecuta:
source src/migration_global_feed_only.sql;
```

Este script **omite el ALTER TABLE users** problemático y crea solo las tablas nuevas:
- ✅ `posts`
- ✅ `post_reactions`
- ✅ `post_comments`
- ✅ `orders` / `order_items`
- ✅ `user_ban_logs`

---

### Opción 3: Verificar el estado actual
Para saber exactamente qué columnas ya existen:

```bash
# En MySQL Workbench, ejecuta:
source src/diagnostico_users.sql;
```

Esto mostrará qué columnas (`role`, `is_banned`, `ban_reason`, `banned_at`) ya existen.

---

## 📊 Estado de tu Base de Datos

| Elemento | Estado |
|----------|--------|
| Tabla `users` | ✅ Existe |
| Columna `role` | ⚠️ Ya existe (causa el error) |
| Columna `is_banned` | ⚠️ Probablemente existe |
| Columna `ban_reason` | ⚠️ Probablemente existe |
| Columna `banned_at` | ⚠️ Probablemente existe |
| Tablas del feed global | ❌ Probablemente faltan |

---

## 🚀 PASOS A SEGUIR AHORA

### Paso 1: Ejecuta este script (alternativa más segura)
```sql
-- Ejecuta en MySQL Workbench (copia todo):

USE readzzi;

-- Ver columnas existentes
DESCRIBE users;

-- Crear tablas del feed (sin tocar users)
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  community_id INT,
  content TEXT NOT NULL,
  image_url LONGTEXT,
  book_mention_id VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL,
  FOREIGN KEY (book_mention_id) REFERENCES books(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS post_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_post_reaction (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SELECT 'Tablas del feed global creadas' as resultado;
```

### Paso 2: Verifica que funcionó
```sql
-- Ver las tablas creadas
SHOW TABLES LIKE 'post%';

-- Contar posts
SELECT COUNT(*) FROM posts;
SELECT COUNT(*) FROM post_reactions;
SELECT COUNT(*) FROM post_comments;
```

### Paso 3: Comprueba que el feed funciona
- Ve a `http://localhost:3000/comunidad`
- Crea un post
- ¡Debería guardarse en BD! ✅

---

## 🛠️ Alternativa: Si quieres agregar LAS COLUMNAS FALTANTES de users

Si por alguna razón te faltan algunas columnas en `users`, ejecuta SOLO las que necesites:

```sql
-- OPCIÓN A: Agregar SOLO las que faltan
-- Primero ejecuta el diagnóstico (arriba) para ver cuáles faltan

-- Si falta 'role':
ALTER TABLE users 
ADD COLUMN role ENUM('user', 'admin', 'logistics', 'marketing', 'publicity') DEFAULT 'user' AFTER alias;

-- Si falta 'is_banned':
ALTER TABLE users 
ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;

-- Si falta 'ban_reason':
ALTER TABLE users 
ADD COLUMN ban_reason TEXT;

-- Si falta 'banned_at':
ALTER TABLE users 
ADD COLUMN banned_at TIMESTAMP NULL;
```

---

## 📝 Archivos Actualizados

| Archivo | Cambio |
|---------|--------|
| `migration_admin_features.sql` | ✅ Ahora usa `IF NOT EXISTS` |
| `migration_global_feed_only.sql` | ✨ Nuevo - Sin ALTER TABLE users |
| `diagnostico_users.sql` | ✨ Nuevo - Verifica estado actual |

---

## ❓ Troubleshooting

### "Error Code: 1060" otra vez
**Causa**: Las columnas ya existen  
**Solución**: Usa `migration_global_feed_only.sql` o el script manual arriba

### "Error Code: 1054: Unknown column"
**Causa**: Falta la columna `role` en `users`  
**Solución**: Ejecuta solo el ALTER para esa columna

### "FOREIGN KEY constraint fails"
**Causa**: La tabla referenciada no existe  
**Solución**: Ejecuta primero `database_schema.sql`, luego `migration_global_feed_only.sql`

### Las tablas existen pero el feed no funciona
**Causa**: Probablemente no ejecutaste las migraciones desde el servidor  
**Solución**: 
1. Verifica que `verify_global_feed_schema.sql` se ejecutó
2. Reinicia el servidor: `npm run dev`
3. Limpia caché: Ctrl+Shift+Delete en el navegador

---

## ✅ CHECKLIST - Qué hacer ahora

- [ ] Ejecutar `migration_global_feed_only.sql` (opción más rápida)
- [ ] O ejecutar `migration_admin_features.sql` actualizado
- [ ] Verificar con `SHOW TABLES LIKE 'post%'`
- [ ] Ir a http://localhost:3000/comunidad
- [ ] Crear un post de prueba
- [ ] Verificar que aparece en el feed
- [ ] ¡Listo! 🎉

---

## 🎯 Resumido

**Si solo necesitas que el feed funcione:**
```sql
-- Copia y ejecuta esto en MySQL Workbench:
source src/migration_global_feed_only.sql;
```

**¡Eso es todo! Tu feed global estará listo.**

---

**Última actualización**: 27 de Abril, 2026  
**Versión**: 1.0 - Problema Resuelto
