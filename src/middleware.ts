import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

// Rutas protegidas por rol
const ROLE_ROUTES: Record<string, string[]> = {
  admin: ['/', '/admin', '/catalogo', '/planes', '/noticias', '/comunidad', '/perfil', '/carrito', '/checkout'],
  logistics: ['/', '/logistica', '/perfil'],
  marketing: ['/', '/mercadeo', '/perfil'],
  publicity: ['/', '/publicidad', '/perfil'],
  user: ['/', '/catalogo', '/planes', '/noticias', '/comunidad', '/perfil', '/carrito', '/checkout', '/estante'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ⚠️ CRÍTICO: No procesar rutas estáticas/assets
  // Esto permite que CSS, JS, imágenes carguen sin bloquearse
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname.includes('.') || // Archivos con extensión (.css, .js, .png, etc)
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/registro', '/', '/debug', '/api/runtime-id'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Rutas de API públicas
  if (pathname.startsWith('/api/auth/')) {
    // Permite login, register, etc. sin token
    return NextResponse.next();
  }

  // Obtener token de la cookie (preferencia por auth_token, fallback a readzzi_token)
  const token = request.cookies.get('auth_token')?.value || request.cookies.get('readzzi_token')?.value;
  
  console.log('[MIDDLEWARE] Verificando acceso a:', pathname);
  console.log('[MIDDLEWARE] ¿Token presente?:', !!token);
  
  if (!token) {
    console.log('[MIDDLEWARE] No hay token, redirigiendo a login');
    // Si no hay token y la ruta no es pública, redirigir a login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Decodificar token usando jose (compatible con Edge Runtime)
    const decoded = await jwtVerify(token, JWT_SECRET);
    const userRole = (decoded.payload as any).role;
    
    console.log('[MIDDLEWARE] Token válido para usuario:', (decoded.payload as any).id, 'rol:', userRole);

    // Obtener rutas permitidas para este rol
    const allowedRoutes = ROLE_ROUTES[userRole] || [];

    // Verificar si el usuario tiene acceso a esta ruta
    const hasAccess = allowedRoutes.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    );

    console.log('[MIDDLEWARE] ¿Tiene acceso?:', hasAccess, 'rutas permitidas:', allowedRoutes);

    if (!hasAccess) {
      // Redirigir a la página de inicio si no tiene acceso
      console.log('[MIDDLEWARE] Acceso denegado, redirigiendo a /');
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Token inválido o expirado, redirigir a login
    console.error('[MIDDLEWARE] Token inválido o expirado:', (error as any).message);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    response.cookies.delete('readzzi_token');
    return response;
  }
}

export const config = {
  matcher: [
    // Rutas que requieren autenticación y verificación de rol
    '/admin/:path*',
    '/logistica/:path*',
    '/mercadeo/:path*',
    '/publicidad/:path*',
    '/catalogo/:path*',
    '/planes/:path*',
    '/noticias/:path*',
    '/comunidad/:path*',
    '/perfil/:path*',
    '/carrito/:path*',
    '/checkout/:path*',
    '/estante/:path*',
  ],
};
