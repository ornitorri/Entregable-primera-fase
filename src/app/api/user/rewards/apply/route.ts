import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const decoded: any = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const body = await request.json();
    const userRewardId = Number(body.user_reward_id || 0);
    if (!userRewardId) return NextResponse.json({ error: 'user_reward_id requerido' }, { status: 400 });

    // Verificar ownership
    const rows = await query('SELECT user_id FROM user_rewards WHERE id = ?', [userRewardId]) as any[];
    if (!rows || rows.length === 0) return NextResponse.json({ error: 'Recompensa de usuario no encontrada' }, { status: 404 });
    if (rows[0].user_id !== decoded.id) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    // Marcar este como aplicado y desmarcar otros
    await query("UPDATE user_rewards SET metadata = JSON_SET(COALESCE(metadata, JSON_OBJECT()), '$.applied', false) WHERE user_id = ?", [decoded.id]);
    await query("UPDATE user_rewards SET metadata = JSON_SET(COALESCE(metadata, JSON_OBJECT()), '$.applied', true) WHERE id = ?", [userRewardId]);

    return NextResponse.json({ success: true, user_reward_id: userRewardId });
  } catch (err) {
    console.error('Error applying user reward:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
