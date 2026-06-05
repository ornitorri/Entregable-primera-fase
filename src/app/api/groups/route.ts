import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function GET(req: NextRequest) {
  try {
    // Obtener parámetro de búsqueda opcional
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic');
    const search = searchParams.get('search');

    let query = `
      SELECT 
        g.id,
        g.name,
        g.description,
        g.topic,
        g.cover_image,
        g.created_by,
        g.is_public,
        g.created_at,
        u.alias as creator_alias,
        u.email as creator_email,
        COUNT(DISTINCT gm.user_id) as member_count
      FROM literary_groups g
      LEFT JOIN users u ON g.created_by = u.id
      LEFT JOIN group_members gm ON g.id = gm.group_id
      WHERE g.status = 'active'
    `;
    
    const params: any[] = [];

    if (topic) {
      query += ` AND g.topic = ?`;
      params.push(topic);
    }

    if (search) {
      query += ` AND (g.name LIKE ? OR g.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY g.id ORDER BY g.created_at DESC LIMIT 50`;

    const connection = await pool.getConnection();
    const [groups] = await connection.execute(query, params);
    connection.release();

    return NextResponse.json({
      success: true,
      data: groups
    });
  } catch (error) {
    console.error('[API Groups List]', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching groups' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const { name, description, topic, cover_image } = await req.json();

    // Validar campos requeridos
    if (!name || !topic) {
      return NextResponse.json(
        { success: false, error: 'Name and topic are required' },
        { status: 400 }
      );
    }

    // Verificar que el usuario sea admin o tenga plan embajador
    const connection = await pool.getConnection();
    
    const [userCheck]: any = await connection.execute(
      `SELECT role, subscription_plan FROM users WHERE id = ?`,
      [userId]
    );

    if (!userCheck || userCheck.length === 0) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userCheck[0];
    const canCreateGroup = user.role === 'admin' || user.subscription_plan === 'embajador';

    if (!canCreateGroup) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'Only admins and ambassadors can create groups' },
        { status: 403 }
      );
    }

    // Crear el grupo
    const [result]: any = await connection.execute(
      `INSERT INTO literary_groups (name, description, topic, cover_image, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [name, description || null, topic, cover_image || null, userId]
    );

    const groupId = result.insertId;

    // Agregar al creador como admin del grupo
    await connection.execute(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES (?, ?, 'admin')`,
      [groupId, userId]
    );

    // Log de auditoría
    await connection.execute(
      `INSERT INTO group_audit_log (group_id, user_id, action, details)
       VALUES (?, ?, 'create_group', ?)`,
      [groupId, userId, JSON.stringify({ name, topic })]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      message: 'Group created successfully',
      data: {
        id: groupId,
        name,
        topic
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[API Groups Create]', error);
    return NextResponse.json(
      { success: false, error: 'Error creating group' },
      { status: 500 }
    );
  }
}
