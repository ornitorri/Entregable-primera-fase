# 🔧 SOLUCIONAR PROBLEMAS DE CONEXIÓN A BD

## ⚠️ Síntomas Comunes

### 1. "Error: connect ECONNREFUSED 127.0.0.1:3306"
**Significa:** MySQL no está corriendo

**Solución:**
- Abre **Services** (Win+R → services.msc)
- Busca **MySQL** (o "MySQL80" si tienes versión 8.0)
- Click derecho → **Start**
- Espera a que diga "Running"

### 2. "Error: ER_ACCESS_DENIED_FOR_USER"
**Significa:** Contraseña incorrecta o usuario no existe

**Solución:**
- Verifica tu usuario en `.env.local`: `DB_USER=root`
- Verifica tu contraseña: `DB_PASSWORD=` (vacía si no tienes)
- Si tienes contraseña, actualiza: `DB_PASSWORD=tu_contraseña`
- Reinicia servidor: `npm run dev`

### 3. "Error: ER_BAD_DB_ERROR"
**Significa:** La BD readzzi no existe

**Solución:**
En MySQL, ejecuta:
```sql
CREATE DATABASE IF NOT EXISTS readzzi;
USE readzzi;
SOURCE database_schema.sql;
```

### 4. "Error: ETIMEDOUT"
**Significa:** MySQL está muy lento o no responde

**Solución:**
- Reinicia MySQL (services.msc → MySQL → Restart)
- O reinicia tu máquina
- O aumenta el timeout en `.env.local`

---

## 🔍 PASO 1: Verificar que MySQL está Corriendo

### Windows

**Opción A: Services**
```
1. Presiona Win+R
2. Escribe: services.msc
3. Busca: MySQL (o MySQL80)
4. Si no está "Running", click derecho → Start
```

**Opción B: PowerShell**
```powershell
Get-Service | Where-Object {$_.Name -like "*mysql*"} | Select-Object Name, Status
```

**Opción C: Línea de comandos**
```powershell
mysql -u root -p -e "SELECT VERSION();"
```

Si ves la versión, MySQL está corriendo ✅

---

## 🔍 PASO 2: Verificar Credenciales

Tu `.env.local` está así:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=readzzi
```

### ¿Es correcto?

**Si tienes contraseña en MySQL:**
```
Cambiar a:
DB_PASSWORD=tu_contraseña_aqui
```

**Si el usuario no es root:**
```
Cambiar a:
DB_USER=tu_usuario_aqui
```

**Si no sabes tu usuario:**
- Abre MySQL Workbench
- Mira la conexión que usas
- Copia el usuario y contraseña a `.env.local`

---

## 🔍 PASO 3: Verificar Conexión Directa a MySQL

En **PowerShell**, prueba:

```powershell
mysql -h localhost -u root -p -e "SHOW DATABASES;"
```

**Esperado:** Ver lista de BDs incluyendo `readzzi`

**Si no funciona:**
- MySQL no está corriendo (ver PASO 1)
- Contraseña incorrecta (agregar `-p` y luego escribir la contraseña)
- Usuario incorrecto (cambiar `-u root` por tu usuario)

---

## 🔍 PASO 4: Ejecutar Script de Diagnóstico

En MySQL Workbench:
1. File → Open SQL Script
2. Abre: `DIAGNOSTICO_CONEXION_BD.sql`
3. Ejecuta (Ctrl+Enter)

**Deberías ver:**
- ✅ Versión de MySQL
- ✅ Usuario actual
- ✅ BD readzzi existe
- ✅ Tabla users existe
- ✅ Usuarios en la BD

---

## 🔍 PASO 5: Reiniciar Todo

Si aún hay problemas:

```powershell
# 1. Detener servidor Node.js
Ctrl+C

# 2. Reiniciar MySQL
Win+R → services.msc → MySQL → Restart

# 3. Reiniciar servidor Node.js
npm run dev

# 4. Probar login
http://localhost:9002/login
```

---

## 📋 Checklist de Diagnóstico

Marca las cosas que verificaste:

```
[ ] MySQL está corriendo en Services
[ ] `.env.local` tiene credenciales correctas
[ ] Puedo conectar con: mysql -u root -p
[ ] Puedo ver: SHOW DATABASES;
[ ] Veo BD readzzi
[ ] Puedo hacer: USE readzzi;
[ ] Veo tabla users con DESC users;
[ ] SETUP_COMPLETO_BD_Y_USUARIOS.sql se ejecutó
[ ] npm run dev está corriendo sin errores de BD
[ ] Logs muestran [DB] ✅ Conexión a BD establecida correctamente
```

Si tienes todos los ✅, la conexión está bien.

---

## 🚨 Errores Específicos

### "ER_WRONG_NUMBER_OF_ROWS_RETURNED"
Hay un problema con el query. Actualiza la versión de mysql2:
```powershell
npm install mysql2@latest
npm run dev
```

### "ENOTFOUND readzzi"
No puede resolver el nombre. Usa localhost directamente:
```
DB_HOST=127.0.0.1 (en lugar de localhost)
```

### "ER_QUERY_INTERRUPTED"
Timeout. Aumenta en `.env.local`:
```
DB_TIMEOUT=30000
```

---

## 🆘 ¿Aún no funciona?

**Prueba esto:**

1. Abre MySQL Workbench
2. File → New Query Tab
3. Copia TODO de: `SETUP_COMPLETO_BD_Y_USUARIOS.sql`
4. Pega en la query
5. Ctrl+Enter

Si ejecuta sin errores, la BD está bien. El problema es de conexión desde Node.

6. Abre `.env.local` y verifica cada línea:
```
DB_HOST=localhost      (¿Es correcto?)
DB_USER=root           (¿Es tu usuario?)
DB_PASSWORD=           (¿Falta tu contraseña?)
DB_NAME=readzzi        (¿Está escrito bien?)
```

7. Si cambias algo, reinicia: `npm run dev`

---

## 📞 Información de Ayuda

**Terminal (logs del servidor):**
- Busca líneas que digan `[DB]`
- Ahí verá si se conectó correctamente

**Errores comunes:**
- ECONNREFUSED → MySQL no corre
- ACCESS_DENIED → Contraseña o usuario mal
- BAD_DB_ERROR → BD readzzi no existe
- TIMEOUT → MySQL muy lento

---

## ✅ Confirmación de Éxito

Cuando todo funciona, verás:

**En terminal (npm run dev):**
```
[DB] Configuración: { 
  host: 'localhost', 
  user: 'root', 
  database: 'readzzi',
  hasPassword: false 
}
[DB] ✅ Conexión a BD establecida correctamente
```

**En login (al intentar ingresar):**
```
[LOGIN] Intento de login con: { email: 'admin@readzzi.com', ... }
[LOGIN] Usuarios encontrados: 1
[LOGIN] Usuario encontrado: { id: 1, ... }
[LOGIN] Login exitoso para usuario: admin@readzzi.com
```

Si ves ambos mensajes, ¡la conexión está perfecta! ✅

