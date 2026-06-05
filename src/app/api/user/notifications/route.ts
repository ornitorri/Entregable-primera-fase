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

export async function GET(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = payload.id;
    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true';

    let sql = `
      SELECT 
        id,
        type,
        title,
        content,
        related_user_id,
        related_post_id,
        related_group_id,
        is_read,
        action_url,
        created_at
      FROM notifications
      WHERE user_id = ?
    `;

    const params: any[] = [userId];

    if (unreadOnly) {
      sql += ` AND is_read = FALSE`;
    }

    sql += ` ORDER BY created_at DESC LIMIT 50`;

    const notifications = await query(sql, params);

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('[Notifications GET] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener notificaciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = payload.id;
    const body = await request.json();

    const { type, title, content, related_user_id, related_post_id, related_group_id, action_url } = body;

    // Validar campos requeridos
    if (!type || !title || !content) {
      return NextResponse.json(
        { error: 'Campos requeridos: type, title, content' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO notifications (
        user_id,
        type,
        title,
        content,
        related_user_id,
        related_post_id,
        related_group_id,
        action_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      userId,
      type,
      title,
      content,
      related_user_id || null,
      related_post_id || null,
      related_group_id || null,
      action_url || null
    ];

    await query(sql, params);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[Notifications POST] Error:', error);
    return NextResponse.json(
      { error: 'Error al crear notificación' },
      { status: 500 }
    );
  }
}
