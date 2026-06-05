// Script para verificar el token en cookies
console.log('=== VERIFICACIÓN DE TOKEN ===');
console.log('Todas las cookies:', document.cookie);
console.log('');

// Extraer el token
const cookieValue = document.cookie
  .split('; ')
  .find(row => row.startsWith('token='))
  ?.split('=')[1];

console.log('Token encontrado:', !!cookieValue);
if (cookieValue) {
  console.log('Token (primeros 50 caracteres):', cookieValue.substring(0, 50) + '...');
  
  // Intentar decodificar
  try {
    const parts = cookieValue.split('.');
    console.log('Partes del JWT:', parts.length);
    
    if (parts.length === 3) {
      let payload = parts[1];
      const padLength = 4 - (payload.length % 4);
      if (padLength !== 4) {
        payload += '='.repeat(padLength);
      }
      payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      
      const binaryString = atob(payload);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const decoded = JSON.parse(new TextDecoder().decode(bytes));
      console.log('Payload decodificado:', decoded);
      console.log('Rol:', decoded.role);
      console.log('Plan:', decoded.subscription_plan);
    }
  } catch (e) {
    console.error('Error al decodificar:', e);
  }
}
