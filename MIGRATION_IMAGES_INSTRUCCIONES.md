# Instrucciones para Ejecutar las Migraciones de Imágenes

## 1. Ejecuta la migración SQL en MySQL:

```sql
-- Agregar campo para imágenes en mensajes de grupo
ALTER TABLE group_messages 
ADD COLUMN image_data LONGBLOB NULL AFTER message;

-- Agregar campo para imágenes en posts de comunidad
ALTER TABLE posts 
ADD COLUMN image_data LONGBLOB NULL AFTER image_url;
```

## 2. Cambios Realizados:

### Chat de Grupos:
- ✅ Removido auto-scroll constante - ahora solo scrollea cuando hay mensajes nuevos
- ✅ Agregado input de imágenes con preview
- ✅ Las imágenes se guardan en base64 en `group_messages.image_data`
- ✅ Los mensajes muestran imágenes con max-height de 256px

### Comunidad/Feed:
- ✅ Agregado input de imágenes en el formulario de publicación
- ✅ Preview de imagen con botón para remover
- ✅ Las imágenes se guardan en base64 en `posts.image_data`
- ✅ El botón "Publicar" se activa si hay texto O imagen

### Base de Datos:
- ✅ Agregada columna `image_data LONGBLOB` a `group_messages`
- ✅ Agregada columna `image_data LONGBLOB` a `posts`

## 3. Tamaño máximo de imagen:
- Limitado a 5MB en ambos casos (chat y comunidad)

## 4. Funcionalidades:

**Chat:**
- Puedes subir una imagen sin texto
- Puedes enviar solo texto
- Puedes enviar texto + imagen
- Las imágenes se muestran en los mensajes

**Comunidad:**
- Puedes compartir solo imagen
- Puedes compartir solo texto
- Puedes compartir texto + imagen
- Las imágenes se muestran en el feed
