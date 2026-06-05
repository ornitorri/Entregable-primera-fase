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
    const groupId = parseInt(resolvedParams.id);
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const connection = await pool.getConnection();

    // Obtener mensajes del grupo
    const [messages]: any = await connection.execute(
      `SELECT 
        gm.id,
        gm.user_id,
        gm.message,
        gm.image_data,
        gm.created_at,
        gm.updated_at,
        u.alias,
        u.email
      FROM group_messages gm
      JOIN users u ON gm.user_id = u.id
      WHERE gm.group_id = ? AND gm.is_deleted = FALSE
      ORDER BY gm.created_at DESC
      LIMIT ? OFFSET ?`,
      [groupId, limit, offset]
    );

    connection.release();

    // Convertir image_data de Buffer a base64 string si existe
    const messagesWithImages = messages.reverse().map((msg: any) => {
      if (msg.image_data) {
        let imageDataUrl = msg.image_data;
        
        // Si es Buffer, convertir a base64
        if (Buffer.isBuffer(msg.image_data)) {
          imageDataUrl = msg.image_data.toString('utf8'); // Convertir buffer a string
        }
        
        // Si no es ya un data URL, agregarlo (significa que es solo base64)
        if (typeof imageDataUrl === 'string' && !imageDataUrl.startsWith('data:')) {
          imageDataUrl = `data:image/jpeg;base64,${imageDataUrl}`;
        }
        
        msg.image_data = imageDataUrl;
      }
      return msg;
    });

    return NextResponse.json({
      success: true,
      data: messagesWithImages // Mostrar en orden cronológico
    });
  } catch (error) {
    console.error('[API Groups Messages GET]', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching messages' },
      { status: 500 }
    );
  }
}

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
    let { message, image } = await req.json();

    if (!message || (message.trim().length === 0 && !image)) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Si image tiene el prefijo data URL, extraer solo la parte base64
    if (image && image.startsWith('data:')) {
      image = image.split(',')[1]; // Extraer la parte después de la coma
    }

    const connection = await pool.getConnection();

    // Verificar que el usuario es miembro del grupo
    const [memberCheck]: any = await connection.execute(
      `SELECT id FROM group_members WHERE group_id = ? AND user_id = ?`,
      [groupId, userId]
    );

    if (!memberCheck || memberCheck.length === 0) {
      connection.release();
      return NextResponse.json(
        { success: false, error: 'You must be a member of the group to send messages' },
        { status: 403 }
      );
    }

    // Crear mensaje con imagen si existe
    const [result]: any = await connection.execute(
      `INSERT INTO group_messages (group_id, user_id, message, image_data)
       VALUES (?, ?, ?, ?)`,
      [groupId, userId, message || '', image || null]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: result.insertId,
        group_id: groupId,
        user_id: userId,
        message,
        created_at: new Date()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[API Groups Messages POST]', error);
    return NextResponse.json(
      { success: false, error: 'Error sending message' },
      { status: 500 }
    );
  }
}
