import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
      WHERE b.id = ?
      GROUP BY b.id
    `;

    const rows = await query(sql, [id]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 });
    }

    const book = rows[0];

    // Transformar los datos para que coincidan con la estructura esperada
    const formattedBook = {
      id: book.id,
      slug: book.id,
      titulo: book.title,
      autor: book.author,
      portada: book.cover || 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?q=80&w=400&auto=format&fit=crop',
      precio: parseFloat(book.price) || 0,
      stock: 10, // Por ahora hardcodeado
      estado: 'Nuevo',
      genero: book.categories || 'Sin categoría',
      rating: book.rating || 5,
      description: book.description || '',
      created_at: book.created_at
    };

    return NextResponse.json(formattedBook);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
