# 📚 GUÍA DE IMPLEMENTACIÓN - SISTEMA DE GRUPOS LITERARIOS

## Descripción General

Sistema completo de **Grupos Literarios** donde:
- ✅ **Administradores** pueden crear grupos
- ✅ **Usuarios con plan "Embajador"** también pueden crear grupos
- ✅ Los grupos aparecen en el **feed global** (`/grupos`)
- ✅ Los usuarios pueden **solicitar entrada** a los grupos
- ✅ Los **admin/embajadores** pueden **aprobar o rechazar** solicitudes
- ✅ Los miembros pueden **conversar en tiempo real** dentro del grupo

---

## 📋 INSTALACIÓN Y CONFIGURACIÓN

### 1. Ejecutar Migración SQL

**Archivo**: `src/migration_literary_groups.sql`

```sql
-- Ejecuta este archivo en MySQL Workbench o tu cliente MySQL
-- Crea 7 tablas nuevas y modifica la tabla users
```

**Lo que hace:**
- ✅ Agrega columna `subscription_plan` a tabla `users`
- ✅ Crea tabla `literary_groups` (información de grupos)
- ✅ Crea tabla `group_members` (miembros de grupos)
- ✅ Crea tabla `group_join_requests` (solicitudes de entrada)
- ✅ Crea tabla `group_messages` (conversaciones)
- ✅ Crea tabla `group_audit_log` (auditoría)
- ✅ Inserta categorías de literatura por defecto

### 2. Pasos para ejecutar la migración:

```
1. Abre MySQL Workbench
2. Conecta a tu base de datos
3. Abre el archivo: src/migration_literary_groups.sql
4. Ejecuta el script (Ctrl + Shift + Enter o botón play)
5. Verifica que no haya errores
```

---

## 🔌 API ENDPOINTS

### Listar Grupos
```
GET /api/groups
Query Parameters (opcionales):
  - topic: Filtrar por tema
  - search: Buscar por nombre o descripción
  
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Amantes del Realismo Mágico",
      "topic": "Realismo Mágico",
      "member_count": 15,
      ...
    }
  ]
}
```

### Crear Grupo (Solo Admin/Embajador)
```
POST /api/groups
Headers:
  - Cookie: token=jwt_token

Body:
{
  "name": "Mi Grupo de Literatura",
  "description": "Discutimos novelas clásicas",
  "topic": "Clásicos",
  "cover_image": "https://ejemplo.com/imagen.jpg"
}

Response:
{
  "success": true,
  "message": "Group created successfully",
  "data": {
    "id": 1,
    "name": "Mi Grupo de Literatura"
  }
}
```

### Obtener Detalles del Grupo
```
GET /api/groups/:id

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Amantes del Realismo Mágico",
    "description": "...",
    "topic": "Realismo Mágico",
    "member_count": 15,
    "members": [
      {
        "id": 1,
        "user_id": 5,
        "role": "admin",
        "alias": "juan_admin"
      }
    ]
  }
}
```

### Solicitar Entrada al Grupo
```
POST /api/groups/:id/join
Headers:
  - Cookie: token=jwt_token

Body:
{
  "message": "Me encanta el realismo mágico, me gustaría unirme"
}

Response:
{
  "success": true,
  "message": "Join request sent successfully",
  "data": {
    "requestId": 42
  }
}
```

### Obtener Solicitudes de Entrada (Admin/Moderador)
```
GET /api/groups/:id/requests
Headers:
  - Cookie: token=jwt_token

Response:
{
  "success": true,
  "data": [
    {
      "id": 42,
      "user_id": 10,
      "alias": "maria_lectora",
      "email": "maria@example.com",
      "first_name": "María",
      "last_name": "López",
      "message": "Me encanta el realismo mágico",
      "status": "pending",
      "created_at": "2024-05-28T10:30:00Z"
    }
  ]
}
```

### Aprobar/Rechazar Solicitud (Admin/Moderador)
```
POST /api/groups/:id/requests
Headers:
  - Cookie: token=jwt_token

Body:
{
  "requestId": 42,
  "action": "approve"  // o "reject"
}

Response:
{
  "success": true,
  "message": "Request approved successfully",
  "data": {
    "requestId": 42,
    "action": "approve",
    "status": "approved"
  }
}
```

### Enviar Mensaje en Grupo (Solo Miembros)
```
POST /api/groups/:id/messages
Headers:
  - Cookie: token=jwt_token

Body:
{
  "message": "¿Alguien ha leído a García Márquez?"
}

Response:
{
  "success": true,
  "message": "Message sent successfully"
}
```

### Obtener Mensajes del Grupo
```
GET /api/groups/:id/messages?limit=50&offset=0

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "message": "¿Alguien ha leído a García Márquez?",
      "created_at": "2024-05-28T10:30:00Z",
      "alias": "juan_lector"
    }
  ]
}
```

### Obtener Miembros del Grupo
```
GET /api/groups/:id/members

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "role": "admin",
      "alias": "juan_admin",
      "joined_at": "2024-05-28T10:30:00Z"
    }
  ],
  "total": 15
}
```

---

## 🎨 COMPONENTES REACT

### GroupsList
**Ubicación**: `src/components/groups/GroupsList.tsx`

Muestra lista de grupos con filtros por tema y búsqueda.

```tsx
<GroupsList
  onCreateClick={() => setIsCreateFormOpen(true)}
  userRole="admin"
  userPlan="free"
/>
```

**Props:**
- `onCreateClick`: Callback cuando se hace clic en "Crear Grupo"
- `userRole`: Rol del usuario ('admin', 'user', etc.)
- `userPlan`: Plan del usuario ('free', 'premium', 'embajador')

### CreateGroupForm
**Ubicación**: `src/components/groups/CreateGroupForm.tsx`

Modal para crear un nuevo grupo.

```tsx
<CreateGroupForm
  isOpen={isCreateFormOpen}
  onClose={() => setIsCreateFormOpen(false)}
  onSuccess={() => fetchGroups()}
/>
```

### GroupDetail
**Ubicación**: `src/components/groups/GroupDetail.tsx`

Vista detallada del grupo con miembros, chat y opción de unirse.

```tsx
<GroupDetail groupId={1} />
```

### GroupRequestsManager
**Ubicación**: `src/components/groups/GroupRequestsManager.tsx`

Panel para que admins/moderadores gestionen solicitudes.

```tsx
<GroupRequestsManager
  groupId={1}
  canManage={userRole === 'admin'}
/>
```

---

## 📄 PÁGINAS

### Página de Grupos (`/grupos`)
**Archivo**: `src/app/grupos/page.tsx`

Muestra lista de todos los grupos literarios disponibles.

### Página de Detalles del Grupo (`/grupos/:id`)
**Archivo**: `src/app/grupos/[id]/page.tsx`

Muestra detalles de un grupo específico con chat y solicitudes de entrada.

---

## 🔒 CONTROL DE ACCESO Y PERMISOS

### Crear Grupos
- ✅ Solo **Admin** (`role = 'admin'`)
- ✅ Solo usuarios con plan **Embajador** (`subscription_plan = 'embajador'`)

### Solicitar Entrada
- ✅ Cualquier usuario autenticado

### Aprobar/Rechazar Solicitudes
- ✅ Admin del grupo (`role = 'admin'` en group_members)
- ✅ Moderadores del grupo (`role = 'moderator'` en group_members)

### Enviar Mensajes
- ✅ Solo miembros del grupo

---

## 📊 ESTRUCTURA DE BASE DE DATOS

### Tabla: literary_groups
```sql
id               INT PRIMARY KEY
name             VARCHAR(150)
description      TEXT
topic            VARCHAR(100)
cover_image      VARCHAR(500)
created_by       INT (FK users.id)
status           ENUM('active', 'inactive', 'archived')
max_members      INT
is_public        BOOLEAN
created_at       TIMESTAMP
updated_at       TIMESTAMP
```

### Tabla: group_members
```sql
id               INT PRIMARY KEY
group_id         INT (FK literary_groups.id)
user_id          INT (FK users.id)
role             ENUM('admin', 'moderator', 'member')
joined_at        TIMESTAMP

UNIQUE KEY unique_group_member (group_id, user_id)
```

### Tabla: group_join_requests
```sql
id               INT PRIMARY KEY
group_id         INT (FK literary_groups.id)
user_id          INT (FK users.id)
status           ENUM('pending', 'approved', 'rejected')
message          TEXT
reviewed_by      INT (FK users.id)
reviewed_at      TIMESTAMP
created_at       TIMESTAMP

UNIQUE KEY unique_group_user_request (group_id, user_id)
```

### Tabla: group_messages
```sql
id               INT PRIMARY KEY
group_id         INT (FK literary_groups.id)
user_id          INT (FK users.id)
message          TEXT
created_at       TIMESTAMP
updated_at       TIMESTAMP
is_deleted       BOOLEAN
```

### Tabla: group_audit_log
```sql
id               INT PRIMARY KEY
group_id         INT (FK literary_groups.id)
user_id          INT (FK users.id)
action           VARCHAR(50)
details          JSON
created_at       TIMESTAMP
```

---

## 🚀 PRÓXIMOS PASOS

### 1. Integrar con Sistema de Autenticación
```tsx
// Obtener rol y plan del usuario del JWT/contexto
const user = await getCurrentUser();
const canCreateGroup = user.role === 'admin' || user.subscription_plan === 'embajador';
```

### 2. Agregar Roles de Plan "Embajador"
```sql
-- Actualizar usuario a plan embajador
UPDATE users SET subscription_plan = 'embajador' WHERE id = 5;
```

### 3. Integrar Notificaciones
```tsx
// Notificar al admin cuando hay nueva solicitud
await sendNotification({
  userId: groupCreatorId,
  title: 'Nueva solicitud de entrada',
  message: 'María López solicitó entrada a tu grupo'
});
```

### 4. Agregar Validaciones
- Límite de mensajes por minuto (anti-spam)
- Validar longitud de mensajes
- Agregar palabras prohibidas

### 5. Mejorar Chat
- Reacciones con emojis
- Editar/eliminar mensajes
- Menciones @usuario
- Archivos/imágenes

---

## 🐛 TROUBLESHOOTING

### Error: "Only admins can create groups"
**Solución**: El usuario debe tener `role = 'admin'` o `subscription_plan = 'embajador'`

### Error: "You are not a member of this group"
**Solución**: El usuario debe ser aprobado en el grupo antes de enviar mensajes

### Error: "Group not found"
**Solución**: Verificar que el ID del grupo sea válido

---

## 📞 SOPORTE

Para más información, revisa:
- API Endpoints: Ver sección de endpoints arriba
- Base de datos: Ver sección de estructura de BD
- Componentes: Ver sección de componentes React
