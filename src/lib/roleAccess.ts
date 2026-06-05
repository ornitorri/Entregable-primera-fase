// Definir qué páginas puede acceder cada rol
export const ROLE_ACCESS = {
  admin: [
    '/admin',
    '/catalogo',
    '/planes',
    '/noticias',
    '/comunidad',
    '/perfil',
    '/carrito',
    '/checkout'
  ],
  logistics: [
    '/',
    '/logistica',
    '/perfil'
  ],
  marketing: [
    '/',
    '/mercadeo',
    '/perfil'
  ],
  publicity: [
    '/',
    '/publicidad',
    '/perfil'
  ],
  user: [
    '/catalogo',
    '/planes',
    '/noticias',
    '/comunidad',
    '/perfil',
    '/carrito',
    '/checkout',
    '/estante'
  ]
};

export function hasAccessToPage(userRole: string | undefined, pathname: string): boolean {
  if (!userRole) return false;
  
  const accessiblePages = ROLE_ACCESS[userRole as keyof typeof ROLE_ACCESS] || [];
  
  // Verificar si la ruta coincide exactamente o es una subruta
  return accessiblePages.some(page => 
    pathname === page || pathname.startsWith(page + '/')
  );
}

export function getAllowedPages(userRole: string | undefined): string[] {
  if (!userRole) return [];
  return ROLE_ACCESS[userRole as keyof typeof ROLE_ACCESS] || [];
}

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  logistics: 'Logística',
  marketing: 'Mercadeo & Ventas',
  publicity: 'Publicidad',
  user: 'Usuario'
};
