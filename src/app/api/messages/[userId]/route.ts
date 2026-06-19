import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

function formatImageData(imageData: unknown): string | null {
  if (!imageData) return null;
  let imageDataUrl = imageData;
  if (Buffer.isBuffer(imageData)) {
    imageDataUrl = imageData.toString('utf8');
  }
  if (typeof imageDataUrl === 'string' && !imageDataUrl.startsWith('data:')) {
    return `data:image/jpeg;base64,${imageDataUrl}`;
  }
  return imageDataUrl as string;
}

async function getAuthUserId(request: NextRequest): Promise<number | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  const decoded = verifyToken(token) as { id?: number } | null;
  return decoded?.id ?? null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const currentUserId = await getAuthUserId(request);
    if (!currentUserId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { userId: otherUserIdStr } = await params;
    const otherUserId = parseInt(otherUserIdStr, 10);

    if (isNaN(otherUserId) || otherUserId === currentUserId) {
      return NextResponse.json({ error: 'Usuario inválido' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    const [userCheck]: any = await connection.execute(
      'SELECT id, alias, first_name, last_name, avatar_url FROM users WHERE id = ?',
      [otherUserId]
    );

    if (!userCheck?.length) {
      connection.release();
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const [messages]: any = await connection.execute(
      `SELECT
        dm.id,
        dm.sender_id,
        dm.receiver_id,
        dm.message,
        dm.image_data,
        dm.is_read,
        dm.created_at,
        u.alias,
        u.avatar_url
      FROM direct_messages dm
      JOIN users u ON u.id = dm.sender_id
      WHERE (
        (dm.sender_id = ? AND dm.receiver_id = ?)
        OR (dm.sender_id = ? AND dm.receiver_id = ?)
      ) AND dm.is_deleted = FALSE
      ORDER BY dm.created_at ASC
      LIMIT 200`,
      [currentUserId, otherUserId, otherUserId, currentUserId]
    );

    await connection.execute(
      `UPDATE direct_messages
       SET is_read = TRUE
       WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE`,
      [otherUserId, currentUserId]
    );

    connection.release();

    const otherUser = userCheck[0];

    return NextResponse.json({
      success: true,
      otherUser: {
        id: otherUser.id,
        alias: otherUser.alias,
        firstName: otherUser.first_name,
        lastName: otherUser.last_name,
        avatarUrl: otherUser.avatar_url,
      },
      data: messages.map((msg: any) => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        message: msg.message,
        imageData: formatImageData(msg.image_data),
        isRead: msg.is_read,
        createdAt: msg.created_at,
        alias: msg.alias,
        avatarUrl: msg.avatar_url,
      })),
    });
  } catch (error) {
    console.error('Error fetching direct messages:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const currentUserId = await getAuthUserId(request);
    if (!currentUserId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { userId: otherUserIdStr } = await params;
    const otherUserId = parseInt(otherUserIdStr, 10);

    if (isNaN(otherUserId) || otherUserId === currentUserId) {
      return NextResponse.json({ error: 'Usuario inválido' }, { status: 400 });
    }

    let { message, image } = await request.json();

    if ((!message || message.trim().length === 0) && !image) {
      return NextResponse.json({ error: 'El mensaje no puede estar vacío' }, { status: 400 });
    }

    if (image && typeof image === 'string' && image.startsWith('data:')) {
      image = image.split(',')[1];
    }

    const connection = await pool.getConnection();

    const [userCheck]: any = await connection.execute(
      'SELECT id FROM users WHERE id = ?',
      [otherUserId]
    );

    if (!userCheck?.length) {
      connection.release();
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const [result]: any = await connection.execute(
      `INSERT INTO direct_messages (sender_id, receiver_id, message, image_data)
       VALUES (?, ?, ?, ?)`,
      [currentUserId, otherUserId, message?.trim() || '', image || null]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      messageId: result.insertId,
    });
  } catch (error) {
    console.error('Error sending direct message:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
