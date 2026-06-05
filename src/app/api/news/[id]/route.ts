import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const sql = `
      SELECT 
        n.id,
        n.title,
        n.summary,
        n.content,
        n.image_url,
        n.location,
        n.category,
        n.published_at,
        n.author_id,
        u.first_name,
        u.last_name
      FROM news n
      LEFT JOIN users u ON u.id = n.author_id
      WHERE n.id = ?
    `;

    const rows = await query(sql, [id]);
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
