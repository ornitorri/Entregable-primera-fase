# ⚡ ARREGLAR CONEXIÓN A BD EN 5 MINUTOS

## 🔴 Problema
Login no funciona porque no se conecta a MySQL

## 🟢 Solución - Pasos Rápidos

### PASO 1: Verificar que MySQL está corriendo (1 min)

**Windows:**
- Presiona **Win+R**
- Escribe: `services.msc`
- Busca: **MySQL** (o MySQL80)
- Si dice "Stopped", click derecho → **Start**

**PowerShell:**
```powershell
mysql -u root -p -e "SELECT 'OK';"
```
Si dice OK, MySQL está corriendo ✅

### PASO 2: Revisar credenciales en `.env.local` (1 min)

Abre `.env.local` y verifica:

```
DB_HOST=localhost     ← ¿Correcto?
DB_USER=root          ← ¿Es tu usuario?
DB_PASSWORD=          ← ¿Deja vacío si no tienes contraseña
DB_NAME=readzzi       ← ¿Deja readzzi
```

**Si tienes contraseña en MySQL:**
```
DB_PASSWORD=tu_contraseña_aqui
```

**Si cambias algo, GUARDA el archivo.**

### PASO 3: Ejecutar script de prueba (2 min)

En **PowerShell**, en la carpeta del proyecto:

```powershell
node test-db-connection.js
```

**Deberías ver:**
```
✅ CONEXIÓN EXITOSA
✅ MySQL Version: 8.0.x
✅ Usuario actual: root@localhost
✅ BD readzzi disponible
✅ Tabla 'users' existe
✅ Columna 'role' en tabla users
✅ Total de usuarios: 5
```

Si ves todo ✅, la conexión está perfecta.

### PASO 4: Reiniciar servidor (1 min)

```powershell
Ctrl+C  (para el servidor actual)
npm run dev
```

Espera a ver:
```
[DB] ✅ Conexión a BD establecida correctamente
▲ Next.js Ready in 2.1s
```

### PASO 5: Probar login (No tardará)

Abre: `http://localhost:9002/login`

Intenta con:
```
Email:    admin@readzzi.com
Password: password123
```

Debe redirigir a `/admin` ✅

---

## 🐛 Si Sigue Sin Funcionar

### Error: "ECONNREFUSED"
→ MySQL no está corriendo (ver PASO 1)

### Error: "ACCESS_DENIED"
→ Contraseña incorrecta (actualiza `.env.local`)

### Error: "BAD_DB_ERROR"
→ BD no existe (ejecuta `SETUP_COMPLETO_BD_Y_USUARIOS.sql`)

### No ves [DB] ✅ en los logs
→ El servidor no se reinició correctamente
→ Cierra con Ctrl+C y vuelve a hacer `npm run dev`

---

## 📋 Archivos de Ayuda

| Archivo | Para |
|---------|------|
| `test-db-connection.js` | Probar conexión (ejecutar con node) |
| `DIAGNOSTICO_CONEXION_BD.sql` | Verificar en MySQL |
| `SOLUCIONAR_CONEXION_BD.md` | Guía completa |

---

## ✅ Confirmación

Cuando funciona correctamente, verás:

**Terminal:**
```
[DB] ✅ Conexión a BD establecida correctamente
```

**Login:**
```
[LOGIN] Login exitoso para usuario: admin@readzzi.com
```

Si ves ambos, ¡está funcionando! 🎉

---

**¿Dudas?** Consulta `SOLUCIONAR_CONEXION_BD.md`
