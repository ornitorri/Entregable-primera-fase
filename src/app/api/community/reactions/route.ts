import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { postId, emoji } = await request.json();

    if (!postId || !emoji) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    // Verificar que el usuario no esté baneado
    const userBanStatus = await query(
      `SELECT is_banned FROM users WHERE id = ?`,
      [decoded.id]
    );

    if (userBanStatus?.[0]?.is_banned) {
      return NextResponse.json({ error: 'Tu cuenta ha sido baneada' }, { status: 403 });
    }

    // Verificar si el usuario ya reaccionó a esta publicación
    const existingReaction = await query(
      `SELECT id, emoji FROM post_reactions WHERE post_id = ? AND user_id = ?`,
      [postId, decoded.id]
    );

    if (existingReaction && existingReaction.length > 0) {
      const existing = (existingReaction as any[])[0];
      if (existing.emoji === emoji) {
        // Si es el mismo emoji, eliminar la reacción
        await query(
          `DELETE FROM post_reactions WHERE post_id = ? AND user_id = ?`,
          [postId, decoded.id]
        );
        return NextResponse.json({ success: true, message: 'Reacción eliminada correctamente' });
      } else {
        // Si es un emoji diferente, actualizar la reacción
        await query(
          `UPDATE post_reactions SET emoji = ? WHERE post_id = ? AND user_id = ?`,
          [emoji, postId, decoded.id]
        );
        return NextResponse.json({ success: true, message: 'Reacción actualizada correctamente' });
      }
    }

    // Crear nueva reacción
    await query(
      `INSERT INTO post_reactions (post_id, user_id, emoji) VALUES (?, ?, ?)`,
      [postId, decoded.id, emoji]
    );

    // Obtener el user_id del dueño del post
    const postOwner: any = await query(
      `SELECT user_id FROM posts WHERE id = ?`,
      [postId]
    );

    if (postOwner && postOwner.length > 0) {
      const postOwnerId = postOwner[0].user_id;

      // Crear notificación solo si no es el mismo usuario
      if (postOwnerId !== decoded.id) {
        const reactionUser: any = await query(
          `SELECT first_name, last_name FROM users WHERE id = ?`,
          [decoded.id]
        );

        const userFullName = reactionUser?.[0]?.first_name && reactionUser?.[0]?.last_name
          ? `${reactionUser[0].first_name} ${reactionUser[0].last_name}`
          : 'Un usuario';

        await query(
          `INSERT INTO notifications (user_id, type, title, content, related_user_id, related_post_id, created_at) 
           VALUES (?, 'like', ?, ?, ?, ?, NOW())`,
          [
            postOwnerId,
            `${userFullName} reaccionó a tu post`,
            `reaccionó con ${emoji}`,
            decoded.id,
            postId
          ]
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Reacción creada correctamente' });
  } catch (error) {
    console.error('Error creating reaction:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'ID de publicación requerido' }, { status: 400 });
    }

    await query(
      `DELETE FROM post_reactions WHERE post_id = ? AND user_id = ?`,
      [postId, decoded.id]
    );

    return NextResponse.json({ success: true, message: 'Reacción eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting reaction:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
