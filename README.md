# Readzzi - Plataforma Literaria

Una aplicación web para amantes de los libros, construida con Next.js, TypeScript y MySQL.

## Características

- ✅ Registro e inicio de sesión con encriptación de contraseñas
- ✅ Sistema de alias únicos con sugerencias automáticas
- ✅ Catálogo de libros con calificaciones y reseñas
- ✅ Sistema de estantes personales
- ✅ Comunidades y clubes de lectura
- ✅ Gestión de logros
- ✅ Interfaz responsive con diseño moderno

## Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos
- Instala MySQL Workbench
- Crea una nueva conexión
- Ejecuta el script `database_schema.sql` para crear la base de datos y tablas

### 3. Variables de entorno
Copia `.env.example` a `.env.local` y configura:
```env
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=readzzi
JWT_SECRET=tu_clave_secreta_jwt
```

### 4. Ejecutar la aplicación
```bash
npm run dev
```

## Estructura de la base de datos

### Tablas principales:
- `users`: Usuarios registrados
- `books`: Catálogo de libros
- `categories`: Categorías de libros
- `user_shelves`: Libros en estantes de usuarios
- `reviews`: Reseñas de libros
- `communities`: Comunidades/clubes
- `news`: Noticias y eventos
- `achievements`: Logros disponibles
- `user_achievements`: Logros desbloqueados por usuarios

## APIs

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/check-alias?alias=...` - Verificar disponibilidad de alias
- `GET /api/auth/suggest-alias?base=...` - Generar sugerencias de alias

## Seguridad

- Contraseñas encriptadas con bcrypt
- Validación de alias únicos
- Protección contra inyección SQL con consultas preparadas
- JWT para autenticación de sesiones

## Próximas funcionalidades

- Integración con Google OAuth
- Sistema de recomendaciones basado en IA
- Mensajería en comunidades
- Compras y pagos en línea
- API REST completa para móviles

## Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de datos**: MySQL
- **Autenticación**: JWT + bcrypt
- **UI**: Radix UI, Lucide Icons
- **AI**: Firebase Genkit (Google AI)