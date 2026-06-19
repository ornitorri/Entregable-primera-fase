import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const decoded: any = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const rows = await query(`
      SELECT ur.id as user_reward_id, r.id as reward_id, r.name, r.description, r.image_url, r.points_cost, r.type, ur.metadata, ur.created_at
      FROM user_rewards ur
      JOIN rewards r ON ur.reward_id = r.id
      WHERE ur.user_id = ?
      ORDER BY ur.created_at DESC
    `, [decoded.id]);

    return NextResponse.json(rows || []);
  } catch (err) {
    console.error('Error fetching user rewards:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
