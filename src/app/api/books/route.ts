import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category');
    const limit = Number(url.searchParams.get('limit') || '50');

    const where: string[] = [];
    const params: any[] = [];

    if (search.trim()) {
      where.push('(b.title LIKE ? OR b.author LIKE ? OR b.description LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (category && category !== 'todos') {
      where.push('bc.category_id = (SELECT id FROM categories WHERE name = ?)');
      params.push(category);
    }

    const sql = `
      SELECT
        b.id,
        b.title,
        b.author,
        b.rating,
        b.cover,
        b.price,
        b.description,
        GROUP_CONCAT(c.name) as categories,
        b.created_at
      FROM books b
      LEFT JOIN book_categories bc ON b.id = bc.book_id
      LEFT JOIN categories c ON bc.category_id = c.id
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      GROUP BY b.id
      ORDER BY b.created_at DESC
      LIMIT ?
    `;
    params.push(limit);

    const rows = await query(sql, params);

    // Transformar los datos para que coincidan con la estructura esperada
    const books = rows.map((book: any) => ({
      id: book.id,
      slug: book.id,
      titulo: book.title,
      autor: book.author,
      portada: book.cover || 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?q=80&w=400&auto=format&fit=crop',
      precio: parseFloat(book.price) || 0,
      stock: 10, // Por ahora hardcodeado, podríamos agregar campo stock a la tabla
      estado: 'Nuevo',
      genero: book.categories || 'Sin categoría',
      rating: book.rating || 5,
      description: book.description || '',
      created_at: book.created_at
    }));

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded || !['admin', 'marketing'].includes(decoded.role)) {
      return NextResponse.json({ error: 'No autorizado para publicar libros' }, { status: 403 });
    }

    const {
      title,
      author,
      price,
      cover,
      description,
      categories = []
    } = await request.json();

    if (!title || !author || !price) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Generar ID único para el libro
    const bookId = `BK-${Date.now()}`;

    await query(
      'INSERT INTO books (id, title, author, price, cover, description, rating) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [bookId, title, author, price, cover || null, description || '', 5]
    );

    // Agregar categorías si se proporcionaron
    if (categories.length > 0) {
      for (const categoryName of categories) {
        // Primero verificar si la categoría existe, si no, crearla
        let categoryResult = await query('SELECT id FROM categories WHERE name = ?', [categoryName]);
        let categoryId;

        if (categoryResult.length === 0) {
          const insertResult = await query('INSERT INTO categories (name) VALUES (?)', [categoryName]);
          categoryId = insertResult.insertId;
        } else {
          categoryId = categoryResult[0].id;
        }

        // Relacionar libro con categoría
        await query('INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)', [bookId, categoryId]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Libro publicado correctamente',
      bookId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
