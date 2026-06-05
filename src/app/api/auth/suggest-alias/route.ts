import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const base = searchParams.get('base') || 'usuario';

    const suggestions = [];
    for (let i = 0; i < 5; i++) {
      let alias;
      let attempts = 0;
      do {
        const randomNum = Math.floor(Math.random() * 9999) + 1;
        alias = `${base}${randomNum}`;
        attempts++;
        if (attempts > 10) break; // Evitar loop infinito
      } while (await isAliasTaken(alias));

      if (!await isAliasTaken(alias)) {
        suggestions.push(alias);
      }
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generando sugerencias:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

async function isAliasTaken(alias: string): Promise<boolean> {
  const existing = await query('SELECT id FROM users WHERE alias = ?', [alias]) as any[];
  return existing.length > 0;
}