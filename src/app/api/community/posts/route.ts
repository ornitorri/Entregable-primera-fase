import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const communityId = url.searchParams.get('communityId');
    const limit = url.searchParams.get('limit') || '20';
    const token = request.headers.get('authorization')?.split(' ')[1];
    const decoded: any = token ? verifyToken(token) : null;

    let posts;

    if (communityId) {
      posts = await query(
        `SELECT p.id, p.user_id, p.content, p.image_url, p.image_data, p.book_mention_id, p.created_at,
                u.first_name, u.last_name, u.avatar_url,
                b.title as book_title, b.author as book_author, b.cover as book_cover, b.price as book_price
         FROM posts p
         JOIN users u ON p.user_id = u.id
         LEFT JOIN books b ON p.book_mention_id = b.id
         WHERE p.community_id = ? OR (p.community_id IS NULL AND ? = '0')
         ORDER BY p.created_at DESC
         LIMIT ?`,
        [communityId, communityId, parseInt(limit)]
      );
    } else {
      posts = await query(
        `SELECT p.id, p.user_id, p.content, p.image_url, p.image_data, p.book_mention_id, p.created_at,
                u.first_name, u.last_name, u.avatar_url,
                b.title as book_title, b.author as book_author, b.cover as book_cover, b.price as book_price
         FROM posts p
         JOIN users u ON p.user_id = u.id
         LEFT JOIN books b ON p.book_mention_id = b.id
         ORDER BY p.created_at DESC
         LIMIT ?`,
        [parseInt(limit)]
      );
    }

    const postIds = (posts || []).map((p: any) => p.id);
    if (postIds.length === 0) {
      return NextResponse.json([]);
    }

    const placeholders = postIds.map(() => '?').join(',');
    const reactionsRaw = await query(
      `SELECT post_id, emoji, COUNT(*) as count
       FROM post_reactions
       WHERE post_id IN (${placeholders})
       GROUP BY post_id, emoji`,
      postIds
    ) as any[];
    const commentsRaw = await query(
      `SELECT post_id, COUNT(*) as count
       FROM post_comments
       WHERE post_id IN (${placeholders})
       GROUP BY post_id`,
      postIds
    ) as any[];

    const reactedByUserRaw = decoded?.id
      ? await query(
          `SELECT post_id
           FROM post_reactions
           WHERE user_id = ? AND post_id IN (${placeholders})`,
          [decoded.id, ...postIds]
        ) as any[]
      : [];

    const reactionsByPost = reactionsRaw.reduce((acc: Record<number, any[]>, row: any) => {
      if (!acc[row.post_id]) acc[row.post_id] = [];
      acc[row.post_id].push({ emoji: row.emoji, count: Number(row.count) });
      return acc;
    }, {});
    const commentCountByPost = commentsRaw.reduce((acc: Record<number, number>, row: any) => {
      acc[row.post_id] = Number(row.count);
      return acc;
    }, {});
    const reactedSet = new Set((reactedByUserRaw || []).map((row: any) => row.post_id));

    for (const post of posts as any[]) {
      post.reactions = reactionsByPost[post.id] || [];
      post.commentCount = commentCountByPost[post.id] || 0;
      post.hasReacted = reactedSet.has(post.id);
      // Convertir image_data de Buffer a base64 si existe
      if (post.image_data) {
        let imageDataUrl = post.image_data;
        if (Buffer.isBuffer(post.image_data)) {
          imageDataUrl = post.image_data.toString('utf8');
        }
        if (typeof imageDataUrl === 'string' && !imageDataUrl.startsWith('data:')) {
          imageDataUrl = `data:image/jpeg;base64,${imageDataUrl}`;
        }
        post.image_data = imageDataUrl;
      }
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
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

    const { content, imageUrl, imageBase64, bookMentionId, communityId } = await request.json();

    if (!content?.trim() && !imageBase64) {
      return NextResponse.json({ error: 'El contenido o una imagen son requeridos' }, { status: 400 });
    }

    // Si imageBase64 tiene el prefijo data URL, extraer solo la parte base64
    let cleanImageData = imageBase64;
    if (cleanImageData && cleanImageData.startsWith('data:')) {
      cleanImageData = cleanImageData.split(',')[1]; // Extraer la parte después de la coma
    }

    // Insertar nuevo post
    const result = await query(
      `INSERT INTO posts (user_id, community_id, content, image_url, image_data, book_mention_id, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        decoded.id,
        communityId || null,
        content?.trim() || '',
        imageUrl || null,
        cleanImageData || null,
        bookMentionId || null
      ]
    );

    const postId = (result as any).insertId;

    // Obtener el post creado con toda la información
    const newPost = await query(
      `SELECT p.id, p.user_id, p.content, p.image_url, p.image_data, p.book_mention_id, p.created_at,
              u.first_name, u.last_name, u.avatar_url,
              b.title as book_title, b.author as book_author, b.cover as book_cover, b.price as book_price
       FROM posts p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN books b ON p.book_mention_id = b.id
       WHERE p.id = ?`,
      [postId]
    );

    if (!newPost || newPost.length === 0) {
      return NextResponse.json({ error: 'Error al crear el post' }, { status: 500 });
    }

    const post = (newPost as any[])[0];
    
    // Convertir image_data de Buffer a base64 si existe
    let imageDataForResponse = null;
    if (post.image_data) {
      let imageDataUrl = post.image_data;
      if (Buffer.isBuffer(post.image_data)) {
        imageDataUrl = post.image_data.toString('utf8');
      }
      if (typeof imageDataUrl === 'string' && !imageDataUrl.startsWith('data:')) {
        imageDataUrl = `data:image/jpeg;base64,${imageDataUrl}`;
      }
      imageDataForResponse = imageDataUrl;
    }
    
    return NextResponse.json({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      image_url: post.image_url,
      image_data: imageDataForResponse,
      book_mention_id: post.book_mention_id,
      created_at: post.created_at,
      first_name: post.first_name,
      last_name: post.last_name,
      avatar_url: post.avatar_url,
      book_title: post.book_title,
      book_author: post.book_author,
      book_cover: post.book_cover,
      book_price: post.book_price,
      reactions: [],
      commentCount: 0,
      hasReacted: false
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
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
      return NextResponse.json({ error: 'ID de post requerido' }, { status: 400 });
    }

    // Verificar que el usuario sea el dueño del post o admin
    const post = await query(
      `SELECT user_id FROM posts WHERE id = ?`,
      [postId]
    );

    if (!post || post.length === 0) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const user = await query(
      `SELECT role FROM users WHERE id = ?`,
      [decoded.id]
    );

    if ((post as any[])[0].user_id !== decoded.id && (user as any[])?.[0]?.role !== 'admin') {
      return NextResponse.json({ error: 'No tienes permisos para eliminar este post' }, { status: 403 });
    }

    // Eliminar el post (las reacciones y comentarios se eliminarán en cascada)
    await query(
      `DELETE FROM posts WHERE id = ?`,
      [postId]
    );

    return NextResponse.json({ success: true, message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
