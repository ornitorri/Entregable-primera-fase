# 🚀 GUÍA FINAL - ARREGLAR LOGIN (Paso a Paso)

## ❌ Problema Identificado
El login no funciona porque:
1. La base de datos no tiene la columna `role`
2. No hay usuarios de prueba en la BD
3. El servidor necesita reiniciarse después de la migración

## ✅ Solución - 3 PASOS SIMPLES

---

## 📍 PASO 1: Ejecutar Migración en MySQL (5 minutos)

### Opción Recomendada: MySQL Workbench

1. **Abre MySQL Workbench**
2. **Conecta a tu servidor MySQL** (localhost, puerto 3306, usuario root)
3. **Abre archivo:**
   - File → Open SQL Script...
   - Selecciona: `SETUP_COMPLETO_BD_Y_USUARIOS.sql`
4. **Ejecuta TODO el script:**
   - Ctrl+A para seleccionar todo
   - Ctrl+Enter para ejecutar
   - Espera a que termine
5. **Verifica que funcionó:**
   - Abre una nueva pestaña SQL
   - Copia y pega esto:
   ```sql
   USE readzzi;
   SELECT email, role FROM users;
   ```
   - Deberías ver 5 usuarios con diferentes roles

### Opción 2: Línea de Comandos

Abre **PowerShell** en la carpeta del proyecto y ejecuta:

```powershell
mysql -u root -p readzzi < "SETUP_COMPLETO_BD_Y_USUARIOS.sql"
```

Luego ingresa tu contraseña de MySQL (si la tienes)

### Opción 3: phpMyAdmin

1. Entra en phpMyAdmin
2. Selecciona la BD: `readzzi`
3. Pestaña: **SQL**
4. Copia y pega TODO de: `SETUP_COMPLETO_BD_Y_USUARIOS.sql`
5. Click en **Ejecutar**

---

## 📍 PASO 2: Reiniciar el Servidor Next.js (2 minutos)

En tu **PowerShell** donde está corriendo el servidor:

```powershell
# Detener el servidor (presiona Ctrl+C)
Ctrl+C

# Espera a que diga "Server has been stopped"

# Reiniciar el servidor
npm run dev
```

Espera a que veas esto:
```
▲ Next.js 15.5.9
✓ Ready in 2.1s
- Local:        http://localhost:9002
```

---

## 📍 PASO 3: Probar el Login (1 minuto)

Abre tu navegador en: `http://localhost:9002/login`

### Credenciales de Prueba

Intenta login con ANY de estos usuarios:

#### 🟦 Admin (Para Panel de Admin)
```
Email:     admin@readzzi.com
Password:  password123
```
**Debe redirigir a:** `/admin` (Panel de Administración)

#### 🟩 Usuario Normal (Para Comprador)
```
Email:     user@readzzi.com
Password:  password123
```
**Debe redirigir a:** `/` (Home)

#### 🟪 Marketing (Para Panel de Mercadeo)
```
Email:     marketing@readzzi.com
Password:  password123
```
**Debe redirigir a:** `/mercadeo` (Panel de Mercadeo)

#### 🟥 Publicidad (Para Panel de Publicidad)
```
Email:     publicidad@readzzi.com
Password:  password123
```
**Debe redirigir a:** `/publicidad` (Panel de Publicidad)

#### 🟨 Logística (Para Panel de Logística)
```
Email:     logistica@readzzi.com
Password:  password123
```
**Debe redirigir a:** `/logistica` (Panel de Logística)

---

## 🐛 Solucionar Problemas

### Problema: "Credenciales inválidas" o "Error de conexión"

**Qué significa:**
- Los usuarios no se crearon en la BD
- La migración no se ejecutó correctamente

**Solución:**
1. Abre MySQL Workbench
2. Ejecuta esta consulta:
   ```sql
   USE readzzi;
   SHOW TABLES;
   ```
3. Si ves la tabla `users`, ejecuta:
   ```sql
   SELECT COUNT(*) FROM users;
   ```
4. Si dice 0, significa que la migración no funcionó

**Si no funciona:**
- Vuelve a ejecutar `SETUP_COMPLETO_BD_Y_USUARIOS.sql`
- Verifica que no hay errores en la ejecución
- Checa que tienes acceso a la BD `readzzi`

---

### Problema: "Error de conexión" al hacer login

**Qué significa:**
- El servidor Next.js no tiene conexión a MySQL
- Las credenciales en `.env.local` son incorrectas

**Solución:**
1. Verifica el archivo `.env.local`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=          (deixa vacío si no tienes contraseña)
   DB_NAME=readzzi
   ```
2. Si cambias algo, reinicia: `npm run dev`

---

### Problema: No ve ningún error en la pantalla de login

**Qué hacer:**
1. Abre **DevTools** (F12)
2. Pestaña **Console**
3. Intenta login de nuevo
4. Busca mensajes `[CLIENT]` que te muestren qué está pasando

**O revisa el servidor:**
1. Mira la terminal donde corre `npm run dev`
2. Busca líneas que digan `[LOGIN]`
3. Ahí verás exactamente qué está pasando

---

## ✅ VERIFICACIÓN FINAL

Cuando todo esté funcionando, verifica:

```
✅ Puedo hacer login con admin@readzzi.com
✅ Me redirige a /admin
✅ Puedo hacer login con user@readzzi.com
✅ Me redirige a /
✅ Puedo hacer login con marketing@readzzi.com
✅ Me redirige a /mercadeo
✅ Puedo hacer login con publicidad@readzzi.com
✅ Me redirige a /publicidad
✅ Puedo hacer login con logistica@readzzi.com
✅ Me redirige a /logistica
```

Si tienes todos estos ✅, ¡todo está funcionando! 🎉

---

## 📋 Resumen de Cambios Realizados

### En el Código:
✅ `src/app/login/page.tsx` - Redirecciones según rol + mejor logging
✅ `src/app/api/auth/login/route.ts` - Logging detallado para debugging
✅ `src/components/Navigation.tsx` - Tipos actualizados

### En la BD:
✅ Columna `role` agregada a tabla `users`
✅ 5 usuarios de prueba creados
✅ Índices creados para optimización

### Archivos de Ayuda:
✅ `SETUP_COMPLETO_BD_Y_USUARIOS.sql` - Script de migración + usuarios
✅ `VERIFICAR_DESPUES_DE_MIGRACION.sql` - Script de verificación
✅ `GUIA_ARREGLAR_LOGIN.md` - Guía detallada
✅ `.env.local` - Ya estaba configurado correctamente

---

## 🚀 ¡LISTO!

Sigue los 3 pasos y tu login estará funcionando en 10 minutos. 

**¿Preguntas?** Revisa los logs en el servidor (terminal donde corre `npm run dev`)
