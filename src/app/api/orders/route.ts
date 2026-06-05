import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

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

    const { shipping_address, payment_method } = await request.json();

    if (!shipping_address || !payment_method) {
      return NextResponse.json({ error: 'Dirección de envío y método de pago requeridos' }, { status: 400 });
    }

    // Obtener items del carrito del usuario
    const cartItems = await query(`
      SELECT c.book_id, c.quantity, b.price
      FROM cart c
      JOIN books b ON c.book_id = b.id
      WHERE c.user_id = ?
    `, [decoded.id]);

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // Calcular total
    const totalAmount = cartItems.reduce((total: number, item: any) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);

    // Generar ID único para el pedido
    const orderId = `RDZ-${Date.now()}`;

    // Crear el pedido
    await query(`
      INSERT INTO orders (id, user_id, total_amount, status, shipping_address, payment_method)
      VALUES (?, ?, ?, 'pending', ?, ?)
    `, [orderId, decoded.id, totalAmount, shipping_address, payment_method]);

    // Agregar items del pedido
    for (const item of cartItems) {
      await query(`
        INSERT INTO order_items (order_id, book_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `, [orderId, item.book_id, item.quantity, item.price]);
    }

    // Limpiar el carrito
    await query('DELETE FROM cart WHERE user_id = ?', [decoded.id]);

    return NextResponse.json({
      success: true,
      message: 'Pedido creado exitosamente',
      orderId,
      totalAmount
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

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

    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') || '20');

    const orders = await query(`
      SELECT
        o.id,
        o.total_amount,
        o.status,
        o.shipping_address,
        o.payment_method,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `, [decoded.id, limit]);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
