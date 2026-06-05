# 🔔 Sistema de Notificaciones - Guía de Implementación

## ✅ Lo que se ha completado

### 1. **Base de Datos - Nueva Tabla `notifications`**
Se creó la tabla `notifications` con los siguientes campos:
- `id` (INT, PK)
- `user_id` (INT, FK → users)
- `type` (ENUM: 'like', 'comment', 'mention', 'group', 'system', 'message')
- `title` (VARCHAR 255)
- `content` (TEXT)
- `related_user_id` (INT, opcional)
- `related_post_id` (INT, opcional)
- `related_group_id` (INT, opcional)
- `is_read` (BOOLEAN, default: FALSE)
- `action_url` (VARCHAR 500, opcional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. **Endpoints API Creados**

#### **GET /api/user/notifications**
Obtiene todas las notificaciones del usuario autenticado.

**Query Parameters:**
- `unread=true` (opcional) - Solo notificaciones sin leer

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "type": "like",
    "title": "Elena Martínez reaccionó a tu post",
    "content": "reaccionó a tu post en #RealismoMágico",
    "related_user_id": 2,
    "is_read": false,
    "created_at": "2026-05-08T10:30:00Z"
  }
]
```

#### **POST /api/user/notifications**
Crea una nueva notificación (normalmente enviada desde el backend).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "type": "like",
  "title": "Elena Martínez reaccionó a tu post",
  "content": "reaccionó a tu post en #RealismoMágico",
  "related_user_id": 2,
  "related_post_id": 1,
  "action_url": "/comunidad/posts/1"
}
```

#### **PUT /api/user/notifications/[id]**
Marca una notificación como leída o todas como leídas.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (una notificación):**
```json
{
  "notificationId": 1
}
```

**Body (todas las notificaciones):**
```json
{
  "markAllAsRead": true
}
```

#### **DELETE /api/user/notifications/[id]**
Elimina una notificación.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "notificationId": 1
}
```

### 3. **Componente Frontend Actualizado**

El componente `NotificationPanel.tsx` ahora:
- ✅ Carga notificaciones desde la API al abrir
- ✅ Muestra el contador de notificaciones sin leer
- ✅ Filtra por tipo (Todas, Sin leer, Menciones, Grupos)
- ✅ Permite marcar individual y masivamente como leído
- ✅ Permite eliminar notificaciones
- ✅ Calcula el tiempo relativo automático
- ✅ Muestra iconos dinámicos según el tipo

## 📋 Instrucciones de Uso

### 1. **Ejecutar la Migración SQL**

Conéctate a tu base de datos MySQL y ejecuta:

```bash
# Opción 1: Desde MySQL CLI
mysql -u root -p readzzi < src/migration_notifications.sql

# Opción 2: Desde MySQL Workbench
# - Abre la base de datos "readzzi"
# - Copia y pega el contenido de src/migration_notifications.sql
# - Ejecuta (Ctrl + Enter)
```

### 2. **Verificar la Tabla**

```sql
SELECT * FROM notifications LIMIT 5;
```

### 3. **Crear Notificaciones desde Otros Endpoints**

Cuando un usuario realice una acción (like, comentario, etc.), el backend debe llamar a:

```typescript
// Ejemplo en un endpoint de posts
import fetch from 'node-fetch';

const createNotification = async (userId: number, type: string, title: string, content: string, token: string) => {
  await fetch('http://localhost:9002/api/user/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      type,
      title,
      content,
      related_user_id: currentUserId
    })
  });
};
```

## 🔍 Ejemplos de Notificaciones

### Like en Post
```json
{
  "type": "like",
  "title": "Elena Martínez reaccionó a tu post",
  "content": "reaccionó a tu post con ❤️"
}
```

### Comentario
```json
{
  "type": "comment",
  "title": "Julian Vance comentó tu reseña",
  "content": "comentó: 'Excelente análisis del libro'"
}
```

### Mención
```json
{
  "type": "mention",
  "title": "Carlos Ruiz te mencionó",
  "content": "te mencionó en el grupo 'Clásicos Eternos'"
}
```

### Solicitud Grupo
```json
{
  "type": "group",
  "title": "Sofía Lectora solicitud",
  "content": "solicitó unirse a tu grupo 'Escritores Bogotá'"
}
```

### Sistema
```json
{
  "type": "system",
  "title": "Nuevo lanzamiento disponible",
  "content": "Nuevo libro de Gabriel García Márquez en catálogo"
}
```

## 🎨 Configuración de Tipos

Cada tipo de notificación tiene un ícono y color asociado (en `NotificationPanel.tsx`):

```typescript
const TYPE_CONFIG = {
  like: { icon: Heart, color: 'text-amber', label: 'Me gusta' },
  comment: { icon: MessageSquare, color: 'text-sage', label: 'Comentario' },
  mention: { icon: AtSign, color: 'text-rust', label: 'Mención' },
  group: { icon: Users, color: 'text-primary', label: 'Grupo' },
  system: { icon: BookOpen, color: 'text-amber', label: 'Sistema' },
  message: { icon: MessageSquare, color: 'text-sage', label: 'Mensaje' }
};
```

## 🧪 Pruebas

### Verificar que funciona:
1. Abre la aplicación
2. Inicia sesión con un usuario
3. Haz clic en el icono de "Avisos" en la comunidad
4. Deberías ver las notificaciones cargadas desde la BD
5. Prueba filtros y acciones (marcar como leído, eliminar)

### Acceso directo a la API:
```bash
# Obtener notificaciones
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:9002/api/user/notifications

# Marcar todas como leídas
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"markAllAsRead": true}' \
  http://localhost:9002/api/user/notifications/[id]
```

## 📂 Archivos Creados/Modificados

- ✅ `src/migration_notifications.sql` - Migración de BD
- ✅ `src/app/api/user/notifications/route.ts` - Endpoints GET/POST
- ✅ `src/app/api/user/notifications/[id]/route.ts` - Endpoints PUT/DELETE
- ✅ `src/components/NotificationPanel.tsx` - Componente actualizado

## 🚀 Próximos Pasos

1. **Integrar con eventos reales:**
   - Crear notificación cuando alguien hace like a un post
   - Crear notificación cuando alguien comenta
   - Crear notificación cuando alguien menciona al usuario

2. **Mejorar UX:**
   - Sonido al recibir notificación
   - Notificación en tiempo real (WebSocket)
   - Marcas de lectura

3. **Análisis:**
   - Dashboard de actividad de notificaciones
   - Histórico de acciones

---

**Última actualización:** 8 de Mayo, 2026
