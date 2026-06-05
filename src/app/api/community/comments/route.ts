import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'ID de publicación requerido' }, { status: 400 });
    }

    const comments = await query(
      `SELECT pc.id, pc.content, pc.created_at, u.id as user_id, u.first_name, u.last_name, u.avatar_url
       FROM post_comments pc
       JOIN users u ON pc.user_id = u.id
       WHERE pc.post_id = ?
       ORDER BY pc.created_at DESC`,
      [postId]
    );

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
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
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Verificar que el usuario no esté baneado
    const userBanStatus = await query(
      `SELECT is_banned FROM users WHERE id = ?`,
      [decoded.id]
    );

    if (userBanStatus?.[0]?.is_banned) {
      return NextResponse.json({ error: 'Tu cuenta ha sido baneada' }, { status: 403 });
    }

    const { postId, content } = await request.json();

    if (!postId || !content || !content.trim()) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    // Obtener el user_id del dueño del post
    const postOwner: any = await query(
      `SELECT user_id, content FROM posts WHERE id = ?`,
      [postId]
    );

    if (!postOwner || postOwner.length === 0) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const postOwnerId = postOwner[0].user_id;
    const postContent = postOwner[0].content;

    // Insertar el comentario
    await query(
      `INSERT INTO post_comments (post_id, user_id, content) VALUES (?, ?, ?)`,
      [postId, decoded.id, content.trim()]
    );

    // Obtener datos del usuario que comentó
    const commentingUser: any = await query(
      `SELECT first_name, last_name FROM users WHERE id = ?`,
      [decoded.id]
    );

    const userFullName = commentingUser?.[0]?.first_name && commentingUser?.[0]?.last_name 
      ? `${commentingUser[0].first_name} ${commentingUser[0].last_name}`
      : 'Un usuario';

    // Crear notificación solo si no es el mismo usuario
    if (postOwnerId !== decoded.id) {
      await query(
        `INSERT INTO notifications (user_id, type, title, content, related_user_id, related_post_id, created_at) 
         VALUES (?, 'comment', ?, ?, ?, ?, NOW())`,
        [
          postOwnerId,
          `${userFullName} comentó tu post`,
          `comentó: "${content.trim().substring(0, 100)}${content.trim().length > 100 ? '...' : ''}"`,
          decoded.id,
          postId
        ]
      );
    }

    return NextResponse.json({ success: true, message: 'Comentario creado correctamente' });
  } catch (error) {
    console.error('Error creating comment:', error);
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
    const commentId = url.searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json({ error: 'ID de comentario requerido' }, { status: 400 });
    }

    // Verificar que el usuario sea el dueño del comentario o admin
    const comment = await query(
      `SELECT user_id FROM post_comments WHERE id = ?`,
      [commentId]
    );

    if (!comment || comment.length === 0) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }

    const user = await query(
      `SELECT role FROM users WHERE id = ?`,
      [decoded.id]
    );

    if (comment[0].user_id !== decoded.id && user?.[0]?.role !== 'admin') {
      return NextResponse.json({ error: 'No tienes permisos para eliminar este comentario' }, { status: 403 });
    }

    await query(
      `DELETE FROM post_comments WHERE id = ?`,
      [commentId]
    );

    return NextResponse.json({ success: true, message: 'Comentario eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
