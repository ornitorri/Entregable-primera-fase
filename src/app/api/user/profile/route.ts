import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const users = await query('SELECT id, first_name, last_name, email, phone, alias, avatar_url, bio, location, created_at, COALESCE(points,0) as points FROM users WHERE id = ?', [decoded.id]) as any[];
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = users[0];

    // Obtener estadísticas
    const books = await query('SELECT COUNT(*) as count FROM user_shelves WHERE user_id = ?', [decoded.id]) as any[];
    const reviews = await query('SELECT COUNT(*) as count FROM reviews WHERE user_id = ?', [decoded.id]) as any[];
    const communities = await query('SELECT COUNT(*) as count FROM community_members WHERE user_id = ?', [decoded.id]) as any[];

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        alias: user.alias,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        location: user.location,
        points: user.points || 0,
        createdAt: user.created_at
      },
      stats: {
        books: books[0]?.count || 0,
        reviews: reviews[0]?.count || 0,
        communities: communities[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}