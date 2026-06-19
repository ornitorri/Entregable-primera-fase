import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const decoded: any = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const users = await query('SELECT COALESCE(points,0) as points FROM users WHERE id = ?', [decoded.id]) as any[];
    const history = await query('SELECT id, order_id, points, created_at FROM points_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [decoded.id]);

    return NextResponse.json({ points: users[0]?.points || 0, history });
  } catch (err) {
    console.error('Error en GET /api/user/points', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const decoded: any = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const body = await request.json();
    const toRedeem = Number(body.points || 0);
    const reason = body.reason || 'canje';

    if (!toRedeem || toRedeem <= 0) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
    }

    // Obtener puntos actuales
    const users = await query('SELECT COALESCE(points,0) as points FROM users WHERE id = ?', [decoded.id]) as any[];
    const current = users[0]?.points || 0;
    if (current < toRedeem) {
      return NextResponse.json({ error: 'Puntos insuficientes' }, { status: 400 });
    }

    // Restar puntos y registrar en historial (guardamos como negativo)
    await query('UPDATE users SET points = points - ? WHERE id = ?', [toRedeem, decoded.id]);
    await query('INSERT INTO points_history (user_id, order_id, points) VALUES (?, ?, ?)', [decoded.id, null, -toRedeem]);

    const newUsers = await query('SELECT COALESCE(points,0) as points FROM users WHERE id = ?', [decoded.id]) as any[];

    return NextResponse.json({ success: true, points: newUsers[0]?.points || 0 });
  } catch (err) {
    console.error('Error en POST /api/user/points', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
