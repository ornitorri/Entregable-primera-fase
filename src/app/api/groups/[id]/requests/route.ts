import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function GET(
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

    const groupId = parseInt(params.id);

    const connection = await pool.getConnection();

    // Verificar que el usuario sea admin/moderador del grupo
    const [memberCheck]: any = await connection.execute(
      `SELECT role FROM group_members WHERE group_id = ? AND user_id = ?`,
      [groupId, userId]
    );

    if (!memberCheck || memberCheck.length === 0) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'You are not a member of this group' },
        { status: 403 }
      );
    }

    const member = memberCheck[0];
    if (member.role !== 'admin' && member.role !== 'moderator') {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'Only admins and moderators can view requests' },
        { status: 403 }
      );
    }

    // Obtener solicitudes pendientes
    const [requests]: any = await connection.execute(
      `SELECT 
        gjr.id,
        gjr.user_id,
        gjr.message,
        gjr.status,
        gjr.created_at,
        u.alias,
        u.email,
        u.first_name,
        u.last_name
      FROM group_join_requests gjr
      JOIN users u ON gjr.user_id = u.id
      WHERE gjr.group_id = ?
      ORDER BY gjr.status = 'pending' DESC, gjr.created_at DESC`,
      [groupId]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('[API Groups Requests GET]', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching requests' },
      { status: 500 }
    );
  }
}

// Aprobar o rechazar solicitud
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
    const { requestId, action } = await req.json(); // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    // Verificar que el usuario sea admin/moderador del grupo
    const [memberCheck]: any = await connection.execute(
      `SELECT role FROM group_members WHERE group_id = ? AND user_id = ?`,
      [groupId, userId]
    );

    if (!memberCheck || memberCheck.length === 0) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'You are not a member of this group' },
        { status: 403 }
      );
    }

    const member = memberCheck[0];
    if (member.role !== 'admin' && member.role !== 'moderator') {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'Only admins and moderators can manage requests' },
        { status: 403 }
      );
    }

    // Obtener la solicitud
    const [requestData]: any = await connection.execute(
      `SELECT user_id FROM group_join_requests WHERE id = ? AND group_id = ?`,
      [requestId, groupId]
    );

    if (!requestData || requestData.length === 0) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    const requestUserId = requestData[0].user_id;

    if (action === 'approve') {
      // Agregar usuario como miembro
      await connection.execute(
        `INSERT INTO group_members (group_id, user_id, role)
         VALUES (?, ?, 'member')`,
        [groupId, requestUserId]
      );

      // Actualizar solicitud como aprobada
      await connection.execute(
        `UPDATE group_join_requests 
         SET status = 'approved', reviewed_by = ?, reviewed_at = NOW()
         WHERE id = ?`,
        [userId, requestId]
      );

      // Log de auditoría
      await connection.execute(
        `INSERT INTO group_audit_log (group_id, user_id, action, details)
         VALUES (?, ?, 'approve_request', ?)`,
        [groupId, userId, JSON.stringify({ request_id: requestId, user_id: requestUserId })]
      );
    } else {
      // Rechazar solicitud
      await connection.execute(
        `UPDATE group_join_requests 
         SET status = 'rejected', reviewed_by = ?, reviewed_at = NOW()
         WHERE id = ?`,
        [userId, requestId]
      );

      // Log de auditoría
      await connection.execute(
        `INSERT INTO group_audit_log (group_id, user_id, action, details)
         VALUES (?, ?, 'reject_request', ?)`,
        [groupId, userId, JSON.stringify({ request_id: requestId, user_id: requestUserId })]
      );
    }

    connection.release();

    return NextResponse.json({
      success: true,
      message: `Request ${action}ed successfully`,
      data: {
        requestId,
        action,
        status: action === 'approve' ? 'approved' : 'rejected'
      }
    });

  } catch (error) {
    console.error('[API Groups Requests POST]', error);
    return NextResponse.json(
      { success: false, error: 'Error processing request' },
      { status: 500 }
    );
  }
}
