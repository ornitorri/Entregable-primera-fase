import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded || (decoded.role !== 'admin' && !['logistics', 'marketing', 'publicity'].includes(decoded.role))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Obtener ingresos mensuales
    const monthlyRevenue = await query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_amount) as total 
       FROM orders 
       WHERE status IN ('En Proceso', 'Enviado', 'Entregado')
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month DESC
       LIMIT 12`
    );

    // Obtener órdenes activas (pendientes y en proceso)
    const activeOrders = await query(
      `SELECT COUNT(*) as count FROM orders 
       WHERE status IN ('Pendiente', 'En Proceso')`
    );

    // Obtener total de usuarios/lectores
    const totalUsers = await query(
      `SELECT COUNT(*) as count FROM users WHERE is_banned = FALSE`
    );

    // Obtener total de usuarios baneados
    const bannedUsers = await query(
      `SELECT COUNT(*) as count FROM users WHERE is_banned = TRUE`
    );

    // Obtener órdenes recientes (últimas 10)
    const recentOrders = await query(
      `SELECT o.id, u.first_name, u.last_name, o.total_amount, o.status, o.created_at
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    // Obtener libros más vendidos
    const topBooks = await query(
      `SELECT b.id, b.title, b.author, COUNT(oi.id) as sold_count
       FROM books b
       LEFT JOIN order_items oi ON b.id = oi.book_id
       GROUP BY b.id, b.title, b.author
       ORDER BY sold_count DESC
       LIMIT 5`
    );

    return NextResponse.json({
      monthlyRevenue: monthlyRevenue || [],
      activeOrders: activeOrders?.[0]?.count || 0,
      totalUsers: totalUsers?.[0]?.count || 0,
      bannedUsers: bannedUsers?.[0]?.count || 0,
      recentOrders: recentOrders || [],
      topBooks: topBooks || []
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
