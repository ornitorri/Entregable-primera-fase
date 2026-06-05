import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    // Verificar token JWT
    const token = req.cookies.get('auth_token')?.value || req.cookies.get('readzzi_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let userId: number;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      userId = verified.payload.id as number;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const groupId = parseInt(resolvedParams.id);
    const { message } = await req.json();

    const connection = await pool.getConnection();

    // Verificar que el grupo existe
    const [groupCheck]: any = await connection.execute(
      `SELECT id FROM literary_groups WHERE id = ?`,
      [groupId]
    );

    if (!groupCheck || groupCheck.length === 0) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      );
    }

    // Verificar si ya es miembro
    const [memberCheck]: any = await connection.execute(
      `SELECT id FROM group_members WHERE group_id = ? AND user_id = ?`,
      [groupId, userId]
    );

    if (memberCheck && memberCheck.length > 0) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'Already a member of this group' },
        { status: 400 }
      );
    }

    // Agregar usuario como miembro del grupo directamente
    const [result]: any = await connection.execute(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES (?, ?, 'member')`,
      [groupId, userId]
    );

    // Log de auditoría
    await connection.execute(
      `INSERT INTO group_audit_log (group_id, user_id, action, details)
       VALUES (?, ?, 'join_group', ?)`,
      [groupId, userId, JSON.stringify({ message })]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the group',
      data: {
        memberId: result.insertId
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[API Groups Join]', error);
    return NextResponse.json(
      { success: false, error: 'Error sending join request' },
      { status: 500 }
    );
  }
}
