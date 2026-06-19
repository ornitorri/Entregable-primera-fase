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

    const body = await request.json();
    const shipping_address = body.shipping_address;
    const payment_method = body.payment_method;
    const applied_points = Number(body.applied_points || 0);

    // shipping_address/payment_method may not exist in all schemas; accept undefined for compatibility

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

    // Calcular total (en COP)
    const totalAmount = cartItems.reduce((total: number, item: any) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);

    // Asegurar tablas/columnas mínimas
    try {
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS points INT DEFAULT 0`, []);
    } catch (e) {}
    try {
      await query(`CREATE TABLE IF NOT EXISTS points_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        order_id VARCHAR(50),
        points INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`, []);
    } catch (e) {}

    // Procesar canje de puntos si se proporcionan
    let discount = 0;
    if (applied_points && applied_points > 0) {
      // obtener puntos actuales
      const userPointsRes = await query('SELECT COALESCE(points,0) as points FROM users WHERE id = ?', [decoded.id]) as any[];
      const currentPoints = userPointsRes[0]?.points || 0;
      if (applied_points > currentPoints) {
        return NextResponse.json({ error: 'Puntos insuficientes' }, { status: 400 });
      }

      // calcular descuento en COP
      const { amountFromPoints } = await import('@/lib/points');
      discount = amountFromPoints(applied_points);
      if (discount > totalAmount) {
        // limitar descuento
        discount = totalAmount;
      }

      // deducir puntos usados
      try {
        await query('UPDATE users SET points = points - ? WHERE id = ?', [applied_points, decoded.id]);
        await query('INSERT INTO points_history (user_id, order_id, points) VALUES (?, ?, ?)', [decoded.id, null, -applied_points]);
      } catch (err) {
        console.error('Error deduciendo puntos:', err);
      }
    }


    // Monto neto después del descuento por puntos
    const netAmount = Math.max(0, totalAmount - discount);

    // Crear el pedido con total neto. Insert without assuming schema-specific columns like id as string
    // Many databases use AUTO_INCREMENT numeric id; insert minimal columns and read insertId.
    const insertRes: any = await query(`
      INSERT INTO orders (user_id, total_amount, status)
      VALUES (?, ?, 'Pendiente')
    `, [decoded.id, netAmount]);

    // Use numeric insertId when available, fallback to timestamp string
    const orderId = insertRes && insertRes.insertId ? insertRes.insertId : `RDZ-${Date.now()}`;

    // Agregar items del pedido
    for (const item of cartItems) {
      try {
        await query(`
          INSERT INTO order_items (order_id, book_id, quantity, unit_price)
          VALUES (?, ?, ?, ?)
        `, [orderId, item.book_id, item.quantity, item.price]);
      } catch (err) {
        console.error('Error inserting order_item:', err);
      }
    }

    // Limpiar el carrito
    await query('DELETE FROM cart WHERE user_id = ?', [decoded.id]);

    // Otorgar puntos por compra basados en monto neto (descuento ya aplicado): 1 punto por cada $2.000 COP
    try {
      const { pointsFromAmount } = await import('@/lib/points');
      const pointsEarned = pointsFromAmount(netAmount);
      if (pointsEarned > 0) {
        await query(`UPDATE users SET points = COALESCE(points,0) + ? WHERE id = ?`, [pointsEarned, decoded.id]);
        await query(`INSERT INTO points_history (user_id, order_id, points) VALUES (?, ?, ?)`, [decoded.id, orderId, pointsEarned]);
      }

      return NextResponse.json({
        success: true,
        message: 'Pedido creado exitosamente',
        orderId,
        totalAmount: netAmount,
        pointsEarned: pointsFromAmount(netAmount),
        pointsApplied: applied_points || 0,
        discountApplied: discount
      }, { status: 201 });
    } catch (err) {
      console.error('Error otorgando puntos:', err);
      return NextResponse.json({
        success: true,
        message: 'Pedido creado exitosamente',
        orderId,
        totalAmount: netAmount,
        pointsEarned: Math.floor(netAmount / 2000),
        pointsApplied: applied_points || 0,
        discountApplied: discount
      }, { status: 201 });
    }
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

    // Select only common columns to be compatible with different DB schemas
    const orders = await query(`
      SELECT
        o.id,
        o.total_amount,
        o.status,
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
