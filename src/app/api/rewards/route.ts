import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const rewards = await query('SELECT id, name, description, image_url, points_cost, type FROM rewards ORDER BY points_cost ASC');
    return NextResponse.json(rewards);
  } catch (err) {
    console.error('Error fetching rewards:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
