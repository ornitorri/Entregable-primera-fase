import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const sql = `
      SELECT
        c.id as cart_id,
        c.quantity,
        c.added_at,
        b.id,
        b.title,
        b.author,
        b.cover,
        b.price,
        b.description
      FROM cart c
      JOIN books b ON c.book_id = b.id
      WHERE c.user_id = ?
      ORDER BY c.added_at DESC
    `;

    const cartItems = await query(sql, [decoded.id]);

    // Transformar los datos para que coincidan con la estructura del frontend
    const formattedItems = cartItems.map((item: any) => ({
      id: item.id,
      slug: item.id,
      titulo: item.title,
      autor: item.author,
      portada: item.cover || 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?q=80&w=400&auto=format&fit=crop',
      precio: parseFloat(item.price) || 0,
      cantidad: item.quantity,
      estado: 'Nuevo',
      stock: 10, // Hardcodeado por ahora
      cart_id: item.cart_id
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
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
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { book_id, quantity = 1 } = await request.json();

    if (!book_id) {
      return NextResponse.json({ error: 'ID del libro requerido' }, { status: 400 });
    }

    // Verificar que el libro existe
    const bookCheck = await query('SELECT id FROM books WHERE id = ?', [book_id]);
    if (bookCheck.length === 0) {
      return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 });
    }

    // Agregar o actualizar el item en el carrito
    await query(`
      INSERT INTO cart (user_id, book_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `, [decoded.id, book_id, quantity, quantity]);

    return NextResponse.json({ success: true, message: 'Libro agregado al carrito' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { book_id, quantity } = await request.json();

    if (!book_id || quantity === undefined) {
      return NextResponse.json({ error: 'ID del libro y cantidad requeridos' }, { status: 400 });
    }

    if (quantity <= 0) {
      // Eliminar del carrito si la cantidad es 0 o menor
      await query('DELETE FROM cart WHERE user_id = ? AND book_id = ?', [decoded.id, book_id]);
      return NextResponse.json({ success: true, message: 'Libro eliminado del carrito' });
    }

    // Actualizar cantidad
    await query('UPDATE cart SET quantity = ? WHERE user_id = ? AND book_id = ?', [quantity, decoded.id, book_id]);

    return NextResponse.json({ success: true, message: 'Cantidad actualizada' });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const url = new URL(request.url);
    const book_id = url.searchParams.get('book_id');

    if (!book_id) {
      return NextResponse.json({ error: 'ID del libro requerido' }, { status: 400 });
    }

    await query('DELETE FROM cart WHERE user_id = ? AND book_id = ?', [decoded.id, book_id]);

    return NextResponse.json({ success: true, message: 'Libro eliminado del carrito' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
