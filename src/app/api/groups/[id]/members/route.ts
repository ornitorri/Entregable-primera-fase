import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id);

    const connection = await pool.getConnection();

    // Obtener miembros del grupo
    const [members]: any = await connection.execute(
      `SELECT 
        gm.id,
        gm.user_id,
        gm.role,
        gm.joined_at,
        u.alias,
        u.email,
        u.first_name,
        u.last_name
      FROM group_members gm
      JOIN users u ON gm.user_id = u.id
      WHERE gm.group_id = ?
      ORDER BY gm.role = 'admin' DESC, gm.joined_at ASC`,
      [groupId]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      data: members,
      total: members.length
    });
  } catch (error) {
    console.error('[API Groups Members]', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching members' },
      { status: 500 }
    );
  }
}
