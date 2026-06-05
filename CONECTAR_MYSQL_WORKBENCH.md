# 🔌 GUÍA - CONECTAR A MYSQL WORKBENCH

## PASO 1: Abrir MySQL Workbench

1. Abre MySQL Workbench
2. En la pantalla principal, verás tus conexiones guardadas
3. Si ves una conexión (ej: "Local instance MySQL80"), haz click
4. Si ves un símbolo de "+" o "Create new connection", click ahí

---

## PASO 2: Verificar/Crear Conexión

### Si tienes una conexión existente:
1. Click en ella
2. Te pedirá contraseña (si tiene)
3. Si tienes contraseña, ingrésala
4. Si NO tienes contraseña, simplemente click OK

### Si necesitas crear una nueva conexión:
1. Haz click en "+" para nueva conexión
2. Llena los campos:

```
Connection Name:    Local MySQL (o el que quieras)
Connection Method:  Standard (TCP/IP)
Hostname:          localhost
Port:              3306
Username:          root
Password:          (déjalo vacío si no tienes)
Default Schema:    (déjalo vacío)
```

3. Click "Test Connection"
4. Si sale "Successfully made the MySQL connection", ¡OK!
5. Click "OK" para guardar

---

## PASO 3: Conectar a la BD

Después de conectar, verás:
- Una ventana con la conexión abierta
- En el lado izquierdo, verás "Schemas"
- Debajo verás las bases de datos disponibles

**Si ves `readzzi`, ¡OK!**

Si NO ves `readzzi`, necesitas crear la BD:

```sql
CREATE DATABASE readzzi;
```

---

## PASO 4: Ejecutar el Script de Migración

Una vez conectado:

1. File → Open SQL Script
2. Selecciona: `SETUP_COMPLETO_BD_Y_USUARIOS.sql`
3. Ctrl+A para seleccionar todo
4. Ctrl+Enter para ejecutar
5. Espera a que termine

---

## 🚨 Si Falla la Conexión

### Error: "Can't connect to MySQL server"
**Significa:** MySQL no está corriendo

**Solución:**
```
Win+R → services.msc
Busca: MySQL (o MySQL80)
Si dice "Stopped", click derecho → Start
Espera a que diga "Running"
```

### Error: "Access denied for user 'root'@'localhost'"
**Significa:** Contraseña incorrecta o usuario incorrecto

**Solución:**
- En MySQL Workbench, click en el engranaje (⚙️) o editar conexión
- Verifica:
  - Username: ¿Es `root`?
  - Password: ¿Dejaste vacío o hay contraseña?
  - Hostname: ¿Es `localhost`?
  - Port: ¿Es `3306`?

### Error: "Unknown database 'readzzi'"
**Significa:** La BD no existe aún

**Solución:**
En una query en Workbench:
```sql
CREATE DATABASE readzzi;
```

---

## 💾 Una vez conectado

Actualiza tu `.env.local` con los datos que usaste:

```
DB_HOST=localhost        (el que usaste en Workbench)
DB_USER=root             (el que usaste en Workbench)
DB_PASSWORD=             (la contraseña que usaste)
DB_NAME=readzzi          (déjalo igual)
```

**IMPORTANTE:** Si cambias algo en `.env.local`, reinicia el servidor:
```powershell
Ctrl+C
npm run dev
```

---

## ✅ Confirmación

Cuando todo esté OK:

1. ✅ MySQL Workbench se conecta sin errores
2. ✅ Ves la BD `readzzi` en el lado izquierdo
3. ✅ `.env.local` tiene las mismas credenciales
4. ✅ Servidor se inicia sin errores [DB]
5. ✅ Login funciona

