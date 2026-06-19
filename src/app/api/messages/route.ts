import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token) as { id?: number } | null;
    if (!decoded?.id) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const userId = decoded.id;
    const connection = await pool.getConnection();

    const [conversations]: any = await connection.execute(
      `SELECT
        u.id AS other_user_id,
        u.alias,
        u.first_name,
        u.last_name,
        u.avatar_url,
        latest.message AS last_message,
        latest.created_at AS last_message_at,
        latest.sender_id AS last_sender_id,
        (
          SELECT COUNT(*)
          FROM direct_messages unread
          WHERE unread.sender_id = u.id
            AND unread.receiver_id = ?
            AND unread.is_read = FALSE
            AND unread.is_deleted = FALSE
        ) AS unread_count
      FROM (
        SELECT
          CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS partner_id,
          message,
          created_at,
          sender_id,
          ROW_NUMBER() OVER (
            PARTITION BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
            ORDER BY created_at DESC
          ) AS rn
        FROM direct_messages
        WHERE (sender_id = ? OR receiver_id = ?) AND is_deleted = FALSE
      ) latest
      JOIN users u ON u.id = latest.partner_id
      WHERE latest.rn = 1
      ORDER BY latest.created_at DESC`,
      [userId, userId, userId, userId]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      data: conversations.map((c: any) => ({
        otherUserId: c.other_user_id,
        alias: c.alias,
        firstName: c.first_name,
        lastName: c.last_name,
        avatarUrl: c.avatar_url,
        lastMessage: c.last_message,
        lastMessageAt: c.last_message_at,
        lastSenderId: c.last_sender_id,
        unreadCount: c.unread_count,
        isOwnLastMessage: c.last_sender_id === userId,
      })),
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
