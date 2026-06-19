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
    const rewardId = Number(body.rewardId);
    if (!rewardId) return NextResponse.json({ error: 'RewardId requerido' }, { status: 400 });

    const rewards = await query('SELECT id, name, points_cost, type FROM rewards WHERE id = ?', [rewardId]) as any[];
    if (!rewards || rewards.length === 0) return NextResponse.json({ error: 'Recompensa no encontrada' }, { status: 404 });
    const reward = rewards[0];

    // Obtener puntos del usuario
    const users = await query('SELECT COALESCE(points,0) as points FROM users WHERE id = ?', [decoded.id]) as any[];
    const current = users[0]?.points || 0;
    if (current < reward.points_cost) return NextResponse.json({ error: 'Puntos insuficientes' }, { status: 400 });

    // Deduct points and create user_rewards
    await query('UPDATE users SET points = points - ? WHERE id = ?', [reward.points_cost, decoded.id]);
    await query('INSERT INTO points_history (user_id, order_id, points) VALUES (?, ?, ?)', [decoded.id, null, -reward.points_cost]);
    await query('INSERT INTO user_rewards (user_id, reward_id) VALUES (?, ?)', [decoded.id, reward.id]);

    return NextResponse.json({ success: true, reward: { id: reward.id, name: reward.name, type: reward.type }, remainingPoints: current - reward.points_cost });
  } catch (err) {
    console.error('Error redeeming reward:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
