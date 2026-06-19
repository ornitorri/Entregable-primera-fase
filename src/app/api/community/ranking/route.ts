import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const rows = await query(`
      SELECT 
        u.id,
        u.firstName,
        u.lastName,
        u.avatarUrl,
        COALESCE(u.points, 0) as points,
        COALESCE(u.plan, 'free') as plan
      FROM users u
      WHERE u.firstName IS NOT NULL AND u.lastName IS NOT NULL
      ORDER BY COALESCE(u.points, 0) DESC
      LIMIT 5
    `);

    // Map to the expected format
    const ranking = (rows || []).map((user: any, index: number) => {
      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
      const roles: { [key: string]: string } = {
        'premium': 'PREMIUM ⭐',
        'ambassador': 'EMBAJADOR 👑',
        'free': 'USUARIO'
      };

      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: roles[user.plan] || 'USUARIO',
        points: user.points || 0,
        avatar: user.avatarUrl || `https://picsum.photos/seed/${user.id}/100/100`,
        medal: medals[index] || `${index + 1}️⃣`
      };
    });

    return NextResponse.json(ranking);
  } catch (err) {
    console.error('Error fetching ranking:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
