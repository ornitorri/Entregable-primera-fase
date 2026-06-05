# 🚀 QUICK START - GRUPOS LITERARIOS

## 3 PASOS PARA EMPEZAR

### ✅ PASO 1: Ejecutar SQL (5 minutos)

```
1. Abre: src/migration_literary_groups.sql
2. Copia todo el contenido
3. Pega en MySQL Workbench
4. Ejecuta (Ctrl + Shift + Enter)
5. ¡Listo! Tablas creadas
```

### ✅ PASO 2: Crear Usuario Embajador (1 minuto)

```sql
-- Hacer que usuario ID 2 sea embajador
UPDATE users SET subscription_plan = 'embajador' WHERE id = 2;
```

### ✅ PASO 3: Ver los Grupos (1 minuto)

```
Abre tu navegador:
http://localhost:9002/grupos

¡Verás la interfaz de grupos!
```

---

## 📂 ARCHIVOS CREADOS

```
✅ src/migration_literary_groups.sql
✅ src/app/api/groups/route.ts
✅ src/app/api/groups/[id]/route.ts
✅ src/app/api/groups/[id]/join/route.ts
✅ src/app/api/groups/[id]/requests/route.ts
✅ src/app/api/groups/[id]/members/route.ts
✅ src/app/api/groups/[id]/messages/route.ts
✅ src/components/groups/GroupsList.tsx
✅ src/components/groups/CreateGroupForm.tsx
✅ src/components/groups/GroupDetail.tsx
✅ src/components/groups/GroupRequestsManager.tsx
✅ src/app/grupos/page.tsx
✅ src/app/grupos/[id]/page.tsx

Documentación:
✅ GUIA_GRUPOS_LITERARIOS.md
✅ INTEGRACION_GRUPOS_FEED_GLOBAL.md
✅ ENTREGA_GRUPOS.md (este)
```

---

## 🎯 LO QUE PUEDE HACER AHORA

### Para Administradores
- ✅ Crear grupos literarios
- ✅ Ver solicitudes de entrada
- ✅ Aprobar o rechazar miembros
- ✅ Moderar conversaciones

### Para Usuarios Embajadores
- ✅ Crear grupos (si tienen plan 'embajador')
- ✅ Aprobar miembros en sus grupos
- ✅ Hablar en los grupos

### Para Usuarios Normales
- ✅ Ver todos los grupos
- ✅ Buscar por tema
- ✅ Solicitar entrada a grupos
- ✅ Hablar en grupos aprobados

---

## 📊 EJEMPLO DE USO

### 1. Admin crea un grupo

```
http://localhost:9002/grupos
Clic en "Crear Grupo"
Nombre: "Fans de García Márquez"
Tema: "Realismo Mágico"
Descripción: "Discutimos la obra del maestro"
Clic en "Crear Grupo"
```

### 2. Usuario solicita entrada

```
http://localhost:9002/grupos/1
Clic en "Solicitar Entrada"
Mensaje: "Me encanta la literatura latinoamericana"
Clic en "Enviar"
```

### 3. Admin aprueba solicitud

```
http://localhost:9002/grupos/1
Baja a "Solicitudes de Entrada"
Clic en "Aprobar"
```

### 4. Usuario habla en el grupo

```
http://localhost:9002/grupos/1
En el chat, escribe un mensaje
Clic en "Enviar"
¡Mensaje aparece!
```

---

## 🔗 URLs IMPORTANTES

```
Listado de grupos:      http://localhost:9002/grupos
Detalles grupo 1:       http://localhost:9002/grupos/1
Detalles grupo 2:       http://localhost:9002/grupos/2
...
```

---

## 🔒 CONTROL DE ACCESO

| Acción | Admin | Embajador | Usuario |
|--------|-------|-----------|--------|
| Ver grupos | ✅ | ✅ | ✅ |
| Crear grupo | ✅ | ✅ | ❌ |
| Unirse a grupo | ✅ | ✅ | ✅ |
| Aprobar miembros | ✅* | ✅* | ❌ |
| Hablar en grupo | ✅* | ✅* | ✅* |

*Solo si son miembros del grupo

---

## 🐛 TROUBLESHOOTING

### Error: "FOREIGN KEY constraint failed"
**Solución**: Ejecutar primero la migración SQL

### Error: "Unauthorized"
**Solución**: Hacer login nuevamente

### Error: "Only admins can create groups"
**Solución**: El usuario debe tener role='admin' o subscription_plan='embajador'

### No puedo enviar mensajes
**Solución**: Debes estar aprobado como miembro del grupo

---

## 💡 TIPS

**Consejo 1**: Para probar, crea varios usuarios y haz que se unan a grupos

**Consejo 2**: Los administradores deben estar en el grupo para gestionar solicitudes

**Consejo 3**: Los embajadores tienen los mismos permisos que los admins en los grupos que crean

---

## ✨ SIGUIENTE PASO

Para integrar los grupos en tu feed global actual:

👉 Lee: `INTEGRACION_GRUPOS_FEED_GLOBAL.md`

---

## 📞 AYUDA

Para documentación completa:

👉 Lee: `GUIA_GRUPOS_LITERARIOS.md`

---

## ✅ CHECKLIST RÁPIDO

```
☐ Ejecutar migration_literary_groups.sql
☐ Crear usuario embajador (UPDATE users...)
☐ Visitar http://localhost:9002/grupos
☐ Crear un grupo
☐ Solicitar entrada con otro usuario
☐ Aprobar la solicitud
☐ Enviar un mensaje en el grupo
☐ ¡Celebrar! 🎉
```

---

**¡Listo! Tu sistema de grupos literarios está funcionando** 🚀
