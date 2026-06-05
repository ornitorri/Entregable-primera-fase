# 🔧 GUÍA COMPLETA - ARREGLAR PROBLEMA DE LOGIN

## ⚠️ DIAGNÓSTICO DEL PROBLEMA

El login no funciona porque falta:
1. **Ejecutar la migración de la base de datos** (agregar columna `role`)
2. **Crear usuarios de prueba** en la BD
3. **Reiniciar el servidor Next.js**

---

## ✅ PASOS PARA RESOLVER

### PASO 1: Ejecutar la Migración en MySQL

**Archivo:** `SETUP_COMPLETO_BD_Y_USUARIOS.sql`

Abre tu cliente MySQL (Workbench, phpMyAdmin, etc.) y ejecuta TODO el contenido del archivo anterior.

**Opción A: MySQL Workbench**
```
1. Abre MySQL Workbench
2. Conecta a tu servidor
3. File → Open SQL Script
4. Selecciona: SETUP_COMPLETO_BD_Y_USUARIOS.sql
5. Ctrl+Enter para ejecutar
6. Espera a que termine
```

**Opción B: Línea de Comandos (PowerShell)**
```powershell
mysql -u root -p readzzi < "C:\Users\USUARIO\Desktop\Entregable primera fase\SETUP_COMPLETO_BD_Y_USUARIOS.sql"
```
(Ingresa tu contraseña de MySQL cuando te lo pida)

**Opción C: phpMyAdmin**
```
1. Entra en phpMyAdmin
2. Selecciona BD: readzzi
3. Pestaña: SQL
4. Copia y pega TODO el contenido de SETUP_COMPLETO_BD_Y_USUARIOS.sql
5. Ejecutar
```

---

### PASO 2: Verificar que la Migración Funcionó

Ejecuta ESTA consulta en MySQL para verificar:

```sql
USE readzzi;
DESCRIBE users;
```

Deberías ver que aparecen estas columnas:
- ✅ `role` - (enum)
- ✅ `is_banned` - (tinyint)
- ✅ `ban_reason` - (text)
- ✅ `banned_at` - (timestamp)
- ✅ `avatar_url` - (longtext)

Si ves todas, ¡continúa!

---

### PASO 3: Verificar que se Crearon los Usuarios

Ejecuta esta consulta:

```sql
USE readzzi;
SELECT email, alias, role FROM users;
```

Deberías ver:
```
admin@readzzi.com    | admin_user      | admin
user@readzzi.com     | usuario_normal  | user
marketing@readzzi.com| marketing_user  | marketing
publicidad@readzzi.com| publicidad_user | publicity
logistica@readzzi.com| logistica_user  | logistics
```

Si los ves, ¡todo está listo!

---

### PASO 4: Reiniciar el Servidor Next.js

En tu terminal (PowerShell):

```powershell
# Si el servidor ya está corriendo, presiona Ctrl+C para detenerlo
Ctrl+C

# Luego reinicia
npm run dev
```

Espera a que veas este mensaje:
```
▲ Next.js 15.5.9
- Local:        http://localhost:9002
- Environments: .env.local
✓ Ready in 2.1s
```

---

## 🧪 PRUEBA EL LOGIN

### Credenciales de Prueba

Ahora puedes intentar login con cualquiera de estos usuarios:

#### 🔐 Usuario Admin
```
Email: admin@readzzi.com
Contraseña: password123
```
Debe redirigir a: `/admin`

#### 👤 Usuario Normal
```
Email: user@readzzi.com
Contraseña: password123
```
Debe redirigir a: `/`

#### 📊 Usuario Marketing
```
Email: marketing@readzzi.com
Contraseña: password123
```
Debe redirigir a: `/mercadeo`

#### 📢 Usuario Publicidad
```
Email: publicidad@readzzi.com
Contraseña: password123
```
Debe redirigir a: `/publicidad`

#### 🚚 Usuario Logística
```
Email: logistica@readzzi.com
Contraseña: password123
```
Debe redirigir a: `/logistica`

---

## 🐛 SI SIGUE SIN FUNCIONAR

### Verificar Logs del Servidor

Cuando intentes login, mira la consola donde corre `npm run dev`. Deberías ver:

```
[LOGIN] Intento de login con: { email: 'admin@readzzi.com', passwordLength: 11 }
[LOGIN] Usuarios encontrados: 1
[LOGIN] Usuario encontrado: { id: 1, email: 'admin@readzzi.com', role: 'admin' }
[LOGIN] Contraseña válida, generando token
[LOGIN] Login exitoso para usuario: admin@readzzi.com
```

Si ves esto, el login funcionó en el servidor.

### Revisar Conexión a BD

Si ves este error:
```
[LOGIN] Error de conexión con la base de datos
```

Verifica:
1. ¿Está corriendo MySQL?
2. ¿Son correctas las credenciales en `.env.local`?
   - `DB_HOST=localhost`
   - `DB_USER=root`
   - `DB_PASSWORD=` (sin contraseña o con tu contraseña)
   - `DB_NAME=readzzi`

---

## 🔧 SOLUCIONAR ERRORES COMUNES

### Error: "Credenciales inválidas"
- Verifica que creaste los usuarios en MySQL
- Asegúrate de usar el email exacto (case-sensitive a veces)

### Error: "Error de conexión con la base de datos"
- MySQL no está corriendo
- Credenciales en `.env.local` son incorrectas

### Error: "Error de conexión" (en el cliente)
- El servidor Next.js no está corriendo
- Verifica que `npm run dev` está activo
- URL debe ser `localhost:9002`

### No ve el error en el cliente
- Si ves solo "Error de conexión", abre DevTools (F12)
- Pestaña Network → busca `/api/auth/login`
- Mira la respuesta (Response tab)

---

## ✅ RESUMEN RÁPIDO

1. ✅ Ejecuta: `SETUP_COMPLETO_BD_Y_USUARIOS.sql`
2. ✅ Verifica: `DESCRIBE users;` (debe mostrar columna `role`)
3. ✅ Verifica: `SELECT email, role FROM users;` (debe mostrar 5 usuarios)
4. ✅ Reinicia: `npm run dev`
5. ✅ Prueba login con: `admin@readzzi.com / password123`

¡Eso es todo! 🚀
