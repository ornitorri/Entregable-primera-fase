import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alias = searchParams.get('alias');

    if (!alias) {
      return NextResponse.json({ error: 'Alias requerido' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM users WHERE alias = ?', [alias]) as any[];
    const available = existing.length === 0;

    return NextResponse.json({ available });
  } catch (error) {
    console.error('Error verificando alias:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}