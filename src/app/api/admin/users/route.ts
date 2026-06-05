import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden acceder' }, { status: 403 });
    }

    const users = await query(
      `SELECT id, first_name, last_name, email, alias, role, is_banned, ban_reason, 
              banned_at, created_at, avatar_url FROM users ORDER BY created_at DESC`
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden acceder' }, { status: 403 });
    }

    const { action, userId, reason } = await request.json();

    if (action === 'ban') {
      // Banear usuario
      const bannedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await query(
        `UPDATE users SET is_banned = TRUE, ban_reason = ?, banned_at = ? WHERE id = ?`,
        [reason || 'Violación de términos de servicio', bannedAt, userId]
      );

      // Registrar en audit log
      await query(
        `INSERT INTO user_ban_logs (user_id, banned_by, reason) VALUES (?, ?, ?)`,
        [userId, decoded.id, reason]
      );

      return NextResponse.json({ success: true, message: 'Usuario baneado correctamente' });
    } else if (action === 'unban') {
      // Desbanear usuario
      await query(
        `UPDATE users SET is_banned = FALSE, ban_reason = NULL, banned_at = NULL WHERE id = ?`,
        [userId]
      );

      // Registrar desbane en audit log
      await query(
        `UPDATE user_ban_logs SET unbanned_at = NOW() WHERE user_id = ? AND unbanned_at IS NULL`,
        [userId]
      );

      return NextResponse.json({ success: true, message: 'Usuario desbaneado correctamente' });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error processing user action:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
