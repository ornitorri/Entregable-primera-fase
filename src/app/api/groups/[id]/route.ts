import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const groupId = parseInt(resolvedParams.id);

    const connection = await pool.getConnection();
    
    // Obtener detalles del grupo
    const [groupData]: any = await connection.execute(
      `SELECT 
        g.*,
        u.alias as creator_alias,
        u.email as creator_email,
        COUNT(DISTINCT gm.user_id) as member_count
      FROM literary_groups g
      LEFT JOIN users u ON g.created_by = u.id
      LEFT JOIN group_members gm ON g.id = gm.group_id
      WHERE g.id = ?
      GROUP BY g.id`,
      [groupId]
    );

    if (!groupData || groupData.length === 0) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      );
    }

    const group = groupData[0];

    // Obtener miembros del grupo (últimos 10)
    const [members]: any = await connection.execute(
      `SELECT 
        gm.id,
        gm.user_id,
        gm.role,
        gm.joined_at,
        u.alias,
        u.email
      FROM group_members gm
      JOIN users u ON gm.user_id = u.id
      WHERE gm.group_id = ?
      ORDER BY gm.role = 'admin' DESC, gm.joined_at DESC
      LIMIT 20`,
      [groupId]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      data: {
        ...group,
        members
      }
    });
  } catch (error) {
    console.error('[API Groups Detail]', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching group' },
      { status: 500 }
    );
  }
}
