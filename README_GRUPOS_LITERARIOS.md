# 📚 SISTEMA DE GRUPOS LITERARIOS - ENTREGA COMPLETA

## 🎯 OBJETIVO

Crear un sistema donde:
- **Administradores** crean grupos literarios
- **Usuarios Embajadores** también pueden crear grupos
- Los grupos aparecen en el **feed global**
- Los usuarios pueden **solicitar entrada**
- Los admins **aprueban o rechazan** solicitudes
- Los miembros **conversan** en el grupo

---

## ⚡ EMPIEZA EN 3 MINUTOS

### 1️⃣ Ejecuta el SQL
```bash
Archivo: src/migration_literary_groups.sql
En: MySQL Workbench
```

### 2️⃣ Crea un usuario embajador
```sql
UPDATE users SET subscription_plan = 'embajador' WHERE id = 2;
```

### 3️⃣ Abre en el navegador
```
http://localhost:9002/grupos
```

✅ **¡Listo! Sistema funcionando**

---

## 📖 DOCUMENTACIÓN

| Documento | Descripción | Tiempo |
|-----------|-------------|--------|
| **[QUICK_START_GRUPOS.md](QUICK_START_GRUPOS.md)** | Inicio rápido | 5 min |
| **[GUIA_GRUPOS_LITERARIOS.md](GUIA_GRUPOS_LITERARIOS.md)** | Guía completa con APIs | 20 min |
| **[INTEGRACION_GRUPOS_FEED_GLOBAL.md](INTEGRACION_GRUPOS_FEED_GLOBAL.md)** | Cómo integrar en feed | 15 min |
| **[RESUMEN_VISUAL_GRUPOS.md](RESUMEN_VISUAL_GRUPOS.md)** | Resumen visual y diagramas | 5 min |
| **[INDICE_GRUPOS.md](INDICE_GRUPOS.md)** | Índice de archivos | 10 min |
| **[ENTREGA_GRUPOS.md](ENTREGA_GRUPOS.md)** | Detalles de entrega | 10 min |

---

## 📦 QUÉ SE ENTREGA

### ✅ Base de Datos
- 6 tablas nuevas
- Índices y relaciones
- Datos por defecto
- **Archivo**: `src/migration_literary_groups.sql`

### ✅ API (9 Endpoints)
- Listar, crear, obtener grupos
- Solicitar entrada, gestionar solicitudes
- Chat, miembros, auditoría
- **Ubicación**: `src/app/api/groups/`

### ✅ Componentes React (4)
- Lista de grupos con filtros
- Formulario para crear grupo
- Detalles del grupo + chat
- Gestor de solicitudes
- **Ubicación**: `src/components/groups/`

### ✅ Páginas (2)
- `/grupos` - Listado
- `/grupos/:id` - Detalles
- **Ubicación**: `src/app/grupos/`

### ✅ Documentación (6 archivos)
- Guías completas
- Ejemplos de código
- Troubleshooting

---

## 🗂️ ESTRUCTURA DE CARPETAS

```
Entregable primera fase/
├── 🔴 src/migration_literary_groups.sql        ← EJECUTAR PRIMERO
├── src/migration_literary_groups_comentada.sql (versión comentada)
│
├── src/app/api/groups/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       ├── join/route.ts
│       ├── requests/route.ts
│       ├── members/route.ts
│       └── messages/route.ts
│
├── src/components/groups/
│   ├── GroupsList.tsx
│   ├── CreateGroupForm.tsx
│   ├── GroupDetail.tsx
│   └── GroupRequestsManager.tsx
│
├── src/app/grupos/
│   ├── page.tsx
│   └── [id]/page.tsx
│
├── QUICK_START_GRUPOS.md                    ← LEE PRIMERO
├── GUIA_GRUPOS_LITERARIOS.md
├── INTEGRACION_GRUPOS_FEED_GLOBAL.md
├── RESUMEN_VISUAL_GRUPOS.md
├── INDICE_GRUPOS.md
├── ENTREGA_GRUPOS.md
└── README_GRUPOS_GRUPOS.md (este archivo)
```

---

## 🚀 PASOS RECOMENDADOS

### Paso 1: Leer Documentación (5 min)
Lee: **[QUICK_START_GRUPOS.md](QUICK_START_GRUPOS.md)**

### Paso 2: Ejecutar SQL (2 min)
```
1. Abre: src/migration_literary_groups.sql
2. Copia todo
3. Pega en MySQL Workbench
4. Ejecuta (Ctrl + Shift + Enter)
```

### Paso 3: Probar en Navegador (1 min)
```
http://localhost:9002/grupos
```

### Paso 4: Crear Grupo (2 min)
- Clic en "Crear Grupo"
- Llena formulario
- Clic en "Crear"

### Paso 5: Probar Solicitud (2 min)
- Con otro usuario
- Click en "Solicitar Entrada"
- Escribe mensaje

### Paso 6: Aprobar Solicitud (1 min)
- Como admin
- Click en "Aprobar"

### Paso 7: Enviar Mensajes (1 min)
- Ahora el usuario es miembro
- Puede escribir en el chat

---

## 🔐 PERMISOS

### Admin 🔴
Puede:
- ✅ Ver grupos
- ✅ Crear grupos
- ✅ Aprobar/rechazar miembros
- ✅ Hablar en grupos
- ✅ Moderar

### Embajador 🟢
Puede:
- ✅ Ver grupos
- ✅ Crear grupos (si tiene plan 'embajador')
- ✅ Aprobar/rechazar en SUS grupos
- ✅ Hablar en grupos

### Usuario Normal 🔵
Puede:
- ✅ Ver grupos
- ✅ Solicitar entrada
- ✅ Hablar en grupos aprobados
- ❌ Crear grupos

---

## 🔌 API RÁPIDA

```
GET    /api/groups                → Lista grupos
POST   /api/groups                → Crear grupo (Admin)

GET    /api/groups/:id            → Detalles grupo
POST   /api/groups/:id/join       → Solicitar entrada

GET    /api/groups/:id/requests   → Ver solicitudes
POST   /api/groups/:id/requests   → Aprobar/rechazar

GET    /api/groups/:id/members    → Miembros
GET    /api/groups/:id/messages   → Mensajes
POST   /api/groups/:id/messages   → Enviar mensaje
```

---

## 🧪 PROBAR RÁPIDO

### Crear Grupo
```bash
curl -X POST http://localhost:9002/api/groups \
  -H "Content-Type: application/json" \
  -b "token=tu_jwt" \
  -d '{"name":"Mi Grupo","topic":"Realismo Mágico"}'
```

### Listar Grupos
```bash
curl http://localhost:9002/api/grupos
```

### Solicitar Entrada
```bash
curl -X POST http://localhost:9002/api/groups/1/join \
  -b "token=tu_jwt" \
  -d '{"message":"Quiero unirme"}'
```

---

## 📊 BASE DE DATOS

Tablas creadas:
1. `literary_groups` - Información de grupos
2. `group_members` - Miembros
3. `group_join_requests` - Solicitudes
4. `group_messages` - Chat
5. `group_audit_log` - Auditoría
6. `categories` - Temas (actualizada)

---

## ✅ VERIFICAR INSTALACIÓN

```sql
-- Ver tablas creadas
SHOW TABLES LIKE '%group%';

-- Ver usuarios
SELECT id, alias, subscription_plan FROM users LIMIT 10;

-- Ver grupos
SELECT * FROM literary_groups;

-- Ver miembros
SELECT * FROM group_members;
```

---

## 📚 DOCUMENTACIÓN COMPLETA

Si necesitas más detalles:

| Tema | Archivo |
|------|---------|
| Inicio rápido | [QUICK_START_GRUPOS.md](QUICK_START_GRUPOS.md) |
| Documentación técnica | [GUIA_GRUPOS_LITERARIOS.md](GUIA_GRUPOS_LITERARIOS.md) |
| Integración en feed | [INTEGRACION_GRUPOS_FEED_GLOBAL.md](INTEGRACION_GRUPOS_FEED_GLOBAL.md) |
| Diagramas visuales | [RESUMEN_VISUAL_GRUPOS.md](RESUMEN_VISUAL_GRUPOS.md) |
| Índice de archivos | [INDICE_GRUPOS.md](INDICE_GRUPOS.md) |
| Detalles entrega | [ENTREGA_GRUPOS.md](ENTREGA_GRUPOS.md) |

---

## 🐛 TROUBLESHOOTING

| Error | Solución |
|-------|----------|
| "FOREIGN KEY constraint failed" | Ejecutar SQL primero |
| "Unauthorized" | Re-loguearse |
| "Only admins can create" | Usuario no tiene permisos |
| Tablas no existen | Ejecutar migration_literary_groups.sql |
| No puedo enviar mensajes | Debes estar aprobado como miembro |

---

## 💡 TIPS

1. **Para crear embajador**: `UPDATE users SET subscription_plan = 'embajador' WHERE id = X;`

2. **Para ver solicitudes**: Ir a `/grupos/:id` como admin

3. **Para filtrar grupos**: Usar los filtros por tema

4. **Para auditoría**: Ver tabla `group_audit_log`

---

## 🎯 PRÓXIMAS MEJORAS (Opcional)

- [ ] Reacciones con emojis
- [ ] Menciones @usuario
- [ ] Imágenes en mensajes
- [ ] Notificaciones en tiempo real
- [ ] Búsqueda full-text
- [ ] Moderar palabras prohibidas
- [ ] Exportar conversaciones

---

## 📞 PREGUNTAS

### ¿Por dónde empiezo?
→ Lee [QUICK_START_GRUPOS.md](QUICK_START_GRUPOS.md)

### ¿Cómo integro en mi feed?
→ Lee [INTEGRACION_GRUPOS_FEED_GLOBAL.md](INTEGRACION_GRUPOS_FEED_GLOBAL.md)

### ¿Dónde está el código?
→ Ver carpeta `src/`

### ¿Cuáles son los endpoints?
→ Lee [GUIA_GRUPOS_LITERARIOS.md](GUIA_GRUPOS_LITERARIOS.md#-api-endpoints)

---

## 🎉 CONCLUSIÓN

Tienes un **sistema COMPLETO y FUNCIONAL** de Grupos Literarios listo para usar.

### Lo que puedes hacer:
✅ Crear grupos literarios  
✅ Administrar solicitudes de entrada  
✅ Chatear en grupos  
✅ Filtrar por tema  
✅ Auditoría completa  

### Tiempo para empezar: **3 minutos**

---

## 🚀 EMPIEZA AHORA

1. Lee: [QUICK_START_GRUPOS.md](QUICK_START_GRUPOS.md) (5 min)
2. Ejecuta: `src/migration_literary_groups.sql` (2 min)
3. Abre: `http://localhost:9002/grupos` (1 min)

**¡Listo! 🎉**

---

**Última actualización**: Mayo 28, 2026  
**Estado**: ✅ Completo y Funcional
