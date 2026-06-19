Script de prueba local para API

Requisitos:
- Node.js 18+ (para soporte nativo de fetch). Si tienes Node 16, instala una versión moderna o usa curl.

Ejemplos de uso:

- GET /api/orders (usa token de localStorage copiado manualmente):

  node scripts/test_api_local.js --url http://localhost:9002/api/orders --token <TOKEN>

- POST crear pedido (asegúrate de tener items en el carrito o ajusta el endpoint de prueba):

  node scripts/test_api_local.js --url http://localhost:9002/api/orders --token <TOKEN> --method POST --data '{"shipping_address":"Calle 1, Bogotá","payment_method":"tarjeta"}'

Notas:
- El script usa el header `x-access-token` que añadimos como opción de depuración en `src/lib/auth.ts`.
- No modifica nada en la base de datos; solo hace peticiones HTTP.
