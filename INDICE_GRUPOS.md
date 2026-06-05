# 📑 ÍNDICE - SISTEMA DE GRUPOS LITERARIOS

## 📌 LÉEME PRIMERO

### Para Comenzar Rápido (5 minutos)
👉 **[QUICK_START_GRUPOS.md](QUICK_START_GRUPOS.md)** ← Empieza aquí

**Contenido:**
- 3 pasos para empezar
- URLs de acceso
- Control de acceso por rol
- Troubleshooting básico

---

## 📚 DOCUMENTACIÓN COMPLETA

### 1. Guía Principal de Implementación
📄 **[GUIA_GRUPOS_LITERARIOS.md](GUIA_GRUPOS_LITERARIOS.md)**

**Contenido:**
- ✅ Instalación y configuración
- ✅ Todos los endpoints de API (con ejemplos)
- ✅ Componentes React (props y uso)
- ✅ Páginas Next.js
- ✅ Control de acceso y permisos
- ✅ Estructura de base de datos
- ✅ Próximos pasos y mejoras
- ✅ Troubleshooting detallado

### 2. Integración con Feed Global
📄 **[INTEGRACION_GRUPOS_FEED_GLOBAL.md](INTEGRACION_GRUPOS_FEED_GLOBAL.md)**

**Contenido:**
- ✅ 4 opciones de integración
- ✅ Ejemplos de código
- ✅ Componentes para sidebar
- ✅ Estadísticas de grupos
- ✅ Estilos y temas personalizados

### 3. Resumen de Entrega
📄 **[ENTREGA_GRUPOS.md](ENTREGA_GRUPOS.md)**

**Contenido:**
- ✅ Qué se incluye
- ✅ Cómo usar
- ✅ Ejemplos SQL
- ✅ Verificación de funcionamiento
- ✅ Checklist de implementación

---

## 🗄️ ARCHIVOS SQL

### SQL Principal (Ejecutar primero)
📄 **[src/migration_literary_groups.sql](src/migration_literary_groups.sql)**

- Crea todas las tablas necesarias
- Agrega columnas a tabla users
- Inserta categorías por defecto

**Cómo ejecutar:**
```
1. Abre en MySQL Workbench
2. Copia todo el contenido
3. Pega en la pestaña SQL
4. Ejecuta (Ctrl + Shift + Enter)
```

### SQL Comentado (con explicaciones)
📄 **[src/migration_literary_groups_comentada.sql](src/migration_literary_groups_comentada.sql)**

- Lo mismo que anterior pero con más comentarios
- Pasos numerados
- Queries de verificación
- Ejemplos de datos

---

## 💻 CÓDIGO - API ENDPOINTS

Ubicación: `src/app/api/groups/`

```
🔌 GET    /api/groups
   └─ Listar grupos
   └─ Archivo: route.ts (línea GET)

🔌 POST   /api/groups
   └─ Crear grupo (Admin/Embajador)
   └─ Archivo: route.ts (línea POST)

🔌 GET    /api/groups/:id
   └─ Obtener detalles del grupo
   └─ Archivo: [id]/route.ts (línea GET)

🔌 POST   /api/groups/:id/join
   └─ Solicitar entrada al grupo
   └─ Archivo: [id]/join/route.ts

🔌 GET    /api/groups/:id/requests
   └─ Obtener solicitudes pendientes
   └─ Archivo: [id]/requests/route.ts (línea GET)

🔌 POST   /api/groups/:id/requests
   └─ Aprobar/rechazar solicitud
   └─ Archivo: [id]/requests/route.ts (línea POST)

🔌 GET    /api/groups/:id/members
   └─ Obtener miembros del grupo
   └─ Archivo: [id]/members/route.ts

🔌 GET    /api/groups/:id/messages
   └─ Obtener mensajes del grupo
   └─ Archivo: [id]/messages/route.ts (línea GET)

🔌 POST   /api/groups/:id/messages
   └─ Enviar mensaje en el grupo
   └─ Archivo: [id]/messages/route.ts (línea POST)
```

---

## 🎨 CÓDIGO - COMPONENTES REACT

Ubicación: `src/components/groups/`

```
🎨 GroupsList.tsx
   └─ Lista de grupos con filtros y búsqueda
   └─ Props: onCreateClick, userRole, userPlan

🎨 CreateGroupForm.tsx
   └─ Modal para crear nuevo grupo
   └─ Props: isOpen, onClose, onSuccess

🎨 GroupDetail.tsx
   └─ Vista detallada del grupo con chat
   └─ Props: groupId

🎨 GroupRequestsManager.tsx
   └─ Panel para gestionar solicitudes (Admin)
   └─ Props: groupId, canManage
```

---

## 📄 CÓDIGO - PÁGINAS

Ubicación: `src/app/grupos/`

```
📄 page.tsx
   └─ http://localhost:9002/grupos
   └─ Listado de todos los grupos

📄 [id]/page.tsx
   └─ http://localhost:9002/grupos/:id
   └─ Detalles de un grupo específico
```

---

## 🔑 CONCEPTOS CLAVE

### Roles y Permisos

| Acción | Admin | Embajador | Usuario |
|--------|-------|-----------|--------|
| Ver grupos | ✅ | ✅ | ✅ |
| Crear grupo | ✅ | ✅ | ❌ |
| Unirse (solicitar) | ✅ | ✅ | ✅ |
| Aprobar miembros | ✅* | ✅* | ❌ |
| Hablar en grupo | ✅* | ✅* | ✅* |

*Solo si es miembro del grupo

### Flujo de Unirse a un Grupo

```
1. Usuario ve grupos en /grupos
2. Usuario hace clic en "Solicitar Entrada"
3. Solicitud se guarda en BD (status='pending')
4. Admin ve solicitud en panel de gestión
5. Admin aprueba (status='approved')
6. Usuario ahora es miembro
7. Usuario puede hablar en el grupo
```

---

## 🧪 PRUEBAS RÁPIDAS

### Probar Creación de Grupo
```bash
curl -X POST http://localhost:9002/api/groups \
  -H "Content-Type: application/json" \
  -b "token=tu_jwt_token" \
  -d '{
    "name": "Mi Grupo",
    "topic": "Realismo Mágico",
    "description": "Descripción"
  }'
```

### Probar Listado de Grupos
```bash
curl http://localhost:9002/api/groups
```

### Probar Solicitud de Entrada
```bash
curl -X POST http://localhost:9002/api/groups/1/join \
  -H "Content-Type: application/json" \
  -b "token=tu_jwt_token" \
  -d '{"message": "Quiero unirme"}'
```

---

## 📊 TABLAS DE BASE DE DATOS

```
📊 users
   ├─ id, email, alias, ...
   └─ subscription_plan (NEW)

📊 literary_groups (NEW)
   ├─ id, name, topic, created_by
   └─ Información del grupo

📊 group_members (NEW)
   ├─ group_id, user_id, role
   └─ Miembros del grupo

📊 group_join_requests (NEW)
   ├─ group_id, user_id, status
   └─ Solicitudes de entrada

📊 group_messages (NEW)
   ├─ group_id, user_id, message
   └─ Conversaciones

📊 group_audit_log (NEW)
   ├─ group_id, user_id, action
   └─ Auditoría de acciones
```

---

## ✅ CHECKLIST RÁPIDO

Para implementar completo:

```
[ ] 1. Leer QUICK_START_GRUPOS.md
[ ] 2. Ejecutar src/migration_literary_groups.sql
[ ] 3. Verificar tablas creadas en MySQL
[ ] 4. Crear usuario embajador (UPDATE users SET subscription_plan = 'embajador'...)
[ ] 5. Visitar http://localhost:9002/grupos
[ ] 6. Crear un grupo
[ ] 7. Solicitar entrada con otro usuario
[ ] 8. Aprobar solicitud como admin
[ ] 9. Enviar mensaje en el grupo
[ ] 10. (Opcional) Integrar en feed global (ver INTEGRACION_GRUPOS_FEED_GLOBAL.md)
```

---

## 🚀 FLUJO RECOMENDADO DE LECTURA

```
1️⃣  QUICK_START_GRUPOS.md (5 min)
    ↓
2️⃣  Ejecutar SQL
    ↓
3️⃣  Probar en navegador (http://localhost:9002/grupos)
    ↓
4️⃣  GUIA_GRUPOS_LITERARIOS.md (si necesitas detalles)
    ↓
5️⃣  INTEGRACION_GRUPOS_FEED_GLOBAL.md (si quieres integrar)
    ↓
6️⃣  ¡Listo! Sistema funcionando
```

---

## 📞 PREGUNTAS FRECUENTES

### ¿Por dónde empiezo?
→ Lee QUICK_START_GRUPOS.md

### ¿Cómo ejecuto el SQL?
→ Ver sección "SQL Principal" arriba

### ¿Cuáles son los endpoints?
→ Lee GUIA_GRUPOS_LITERARIOS.md (sección API ENDPOINTS)

### ¿Cómo integro en mi feed?
→ Lee INTEGRACION_GRUPOS_FEED_GLOBAL.md

### ¿Cómo doy permisos de crear grupos?
→ UPDATE users SET subscription_plan = 'embajador' WHERE id = X;

### ¿Dónde está el código?
→ Ver sección "CÓDIGO" arriba

---

## 📦 RESUMEN DE ENTREGA

```
Total de archivos creados: 20+
├─ SQL: 2 archivos
├─ API: 9 rutas/endpoints
├─ React: 4 componentes
├─ Pages: 2 páginas
└─ Documentación: 4 archivos

Estado: ✅ COMPLETO Y FUNCIONAL
```

---

## 🎯 PRÓXIMAS MEJORAS (Opcional)

- [ ] Agregar búsqueda full-text
- [ ] Reacciones con emojis en mensajes
- [ ] Menciones @usuario
- [ ] Cargar imágenes en mensajes
- [ ] Notificaciones en tiempo real
- [ ] Exportar conversaciones
- [ ] Moderar palabras prohibidas

---

**¡Tu sistema de Grupos Literarios está listo! 🎉**

Para comenzar, lee: **[QUICK_START_GRUPOS.md](QUICK_START_GRUPOS.md)**
