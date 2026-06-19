import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token) as { id?: number } | null;
    if (!decoded?.id) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim();
    const limit = Math.min(Number(url.searchParams.get('limit') || '20'), 30);

    if (q.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const term = `%${q}%`;
    const users = await query(
      `SELECT id, alias, first_name, last_name, avatar_url
       FROM users
       WHERE id != ?
         AND (alias LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)
       ORDER BY alias ASC
       LIMIT ?`,
      [decoded.id, term, term, term, term, limit]
    ) as any[];

    return NextResponse.json({
      success: true,
      data: users.map((u) => ({
        id: u.id,
        alias: u.alias,
        firstName: u.first_name,
        lastName: u.last_name,
        avatarUrl: u.avatar_url,
      })),
    });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
