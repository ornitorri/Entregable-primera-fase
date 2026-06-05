import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const VALID_CATEGORIES = ['noticias', 'giras', 'ferias', 'lanzamientos', 'entrevistas'] as const;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search') || '';
    const limit = Number(url.searchParams.get('limit') || '40');

    const where: string[] = [];
    const params: any[] = [];

    if (category && category !== 'todas') {
      where.push('n.category = ?');
      params.push(category);
    }

    if (search.trim()) {
      where.push('(n.title LIKE ? OR n.summary LIKE ? OR n.content LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

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
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY n.published_at DESC
      LIMIT ?
    `;
    params.push(limit);

    const rows = await query(sql, params);
    return NextResponse.json(rows || []);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded || !['admin', 'publicity'].includes(decoded.role)) {
      return NextResponse.json({ error: 'No autorizado para publicar noticias' }, { status: 403 });
    }

    const { title, summary, content, image_url, location, category } = await request.json();
    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Categoría no válida' }, { status: 400 });
    }

    await query(
      `INSERT INTO news (title, summary, content, image_url, location, category, author_id, type, event_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'news', NULL)`,
      [
        title,
        summary || '',
        content,
        image_url || null,
        location || null,
        category,
        decoded.id
      ]
    );

    return NextResponse.json({ success: true, message: 'Noticia publicada correctamente' }, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
