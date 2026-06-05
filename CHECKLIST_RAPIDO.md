# ☑️ CHECKLIST - ARREGLAR LOGIN EN 10 MINUTOS

## 📋 Antes de Empezar
- [ ] Tienes acceso a MySQL (Workbench, phpMyAdmin o línea de comandos)
- [ ] Tienes la carpeta del proyecto abierta
- [ ] El servidor Next.js está corriendo (o puedes iniciarlo)

---

## ✅ PASO 1: EJECUTAR MIGRACIÓN EN BD (5 min)

### Opción A: MySQL Workbench (RECOMENDADO)
```
[ ] Abre MySQL Workbench
[ ] Conecta a tu servidor (localhost, usuario root)
[ ] File → Open SQL Script...
[ ] Busca y abre: SETUP_COMPLETO_BD_Y_USUARIOS.sql
[ ] Ctrl+A (seleccionar todo)
[ ] Ctrl+Enter (ejecutar)
[ ] Espera hasta que veas: "Migracion completada"
```

### Opción B: PowerShell
```
[ ] Abre PowerShell en la carpeta del proyecto
[ ] Copia y pega esto:
    mysql -u root -p readzzi < "SETUP_COMPLETO_BD_Y_USUARIOS.sql"
[ ] Presiona Enter
[ ] Ingresa tu contraseña MySQL (si la tienes)
[ ] Espera a que termine
```

### Opción C: phpMyAdmin
```
[ ] Entra en phpMyAdmin
[ ] Selecciona BD: readzzi
[ ] Pestaña: SQL
[ ] Abre archivo: SETUP_COMPLETO_BD_Y_USUARIOS.sql
[ ] Copia TODO el contenido
[ ] Pega en phpMyAdmin
[ ] Click: Ejecutar
[ ] Espera a que termine
```

---

## ✅ VERIFICACIÓN (1 min)

En MySQL, ejecuta esto para verificar:

```sql
USE readzzi;
SELECT email, role FROM users;
```

Deberías ver 5 usuarios:
```
admin@readzzi.com        | admin
user@readzzi.com         | user
marketing@readzzi.com    | marketing
publicidad@readzzi.com   | publicity
logistica@readzzi.com    | logistics
```

- [ ] Veo los 5 usuarios ✅

---

## ✅ PASO 2: REINICIAR SERVIDOR (2 min)

En la terminal donde corre `npm run dev`:

```
[ ] Presiona Ctrl+C para detener el servidor
[ ] Espera a que diga "Server has been stopped"
[ ] Escribe: npm run dev
[ ] Presiona Enter
[ ] Espera a que veas: "✓ Ready in XXs"
```

---

## ✅ PASO 3: PROBAR LOGIN (2 min)

Abre navegador: `http://localhost:9002/login`

### Intenta con USUARIO ADMIN:
```
[ ] Email:     admin@readzzi.com
[ ] Password:  password123
[ ] Click:     Iniciar sesión
[ ] Verifica:  Te redirige a /admin
```

### Intenta con USUARIO NORMAL:
```
[ ] Email:     user@readzzi.com
[ ] Password:  password123
[ ] Click:     Iniciar sesión
[ ] Verifica:  Te redirige a /
```

### Intenta con USUARIO MARKETING:
```
[ ] Email:     marketing@readzzi.com
[ ] Password:  password123
[ ] Click:     Iniciar sesión
[ ] Verifica:  Te redirige a /mercadeo
```

---

## ✅ VERIFICACIÓN FINAL

- [ ] Login funciona con admin
- [ ] Login funciona con usuario normal
- [ ] Login funciona con marketing
- [ ] Redirecciones son correctas
- [ ] Sin errores en console (F12)
- [ ] Sin errores en terminal

---

## 🐛 SI ALGO FALLA

### Error: "Credenciales inválidas"
```
[ ] Verifica que ejecutaste SETUP_COMPLETO_BD_Y_USUARIOS.sql
[ ] Verifica que viste los 5 usuarios en MySQL
[ ] Intenta reiniciar el servidor (npm run dev)
[ ] Intenta con otro usuario (ej: user@readzzi.com)
```

### Error: "Error de conexión"
```
[ ] MySQL está corriendo? Verifica en Services de Windows
[ ] .env.local está bien? Revisa: DB_HOST, DB_USER, DB_PASSWORD
[ ] Reinicia el servidor con: npm run dev
```

### No ves errores en la pantalla
```
[ ] Abre DevTools (F12)
[ ] Pestaña Console
[ ] Busca mensajes [CLIENT]
[ ] Ahí verás qué está pasando
```

---

## 🎉 LISTO!

Si tienes todos los ☑️ marcados, tu login está funcionando correctamente.

**Credenciales para recordar:**
```
admin@readzzi.com     / password123 → /admin
user@readzzi.com      / password123 → /
marketing@readzzi.com / password123 → /mercadeo
publicidad@readzzi.com/ password123 → /publicidad
logistica@readzzi.com / password123 → /logistica
```

---

## 📞 Referencia Rápida

| Archivo | Para Qué |
|---------|----------|
| SETUP_COMPLETO_BD_Y_USUARIOS.sql | Ejecutar PRIMERO |
| VERIFICAR_DESPUES_DE_MIGRACION.sql | Verificar que funcionó |
| RESUMEN_FINAL_ARREGLAR_LOGIN.md | Guía detallada |
| GUIA_ARREGLAR_LOGIN.md | Solución de problemas |

