import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-secreto-super-seguro');

async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.slice(7);
    const verified = await jwtVerify(token, SECRET);
    return verified.payload as any;
  } catch {
    return null;
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = payload.id;
    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      // Marcar todas las notificaciones como leídas
      const sql = `UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE`;
      await query(sql, [userId]);
      return NextResponse.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' }, { status: 200 });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: 'notificationId es requerido' },
        { status: 400 }
      );
    }

    // Marcar una notificación específica como leída
    const sql = `UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?`;
    await query(sql, [notificationId, userId]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Notifications PUT] Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar notificación' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = payload.id;
    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        { error: 'notificationId es requerido' },
        { status: 400 }
      );
    }

    const sql = `DELETE FROM notifications WHERE id = ? AND user_id = ?`;
    await query(sql, [notificationId, userId]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Notifications DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar notificación' },
      { status: 500 }
    );
  }
}
