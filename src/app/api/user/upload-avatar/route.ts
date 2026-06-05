import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 });
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no debe superar 5MB' }, { status: 400 });
    }

    // Convertir a base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const avatarUrl = `data:${file.type};base64,${base64}`;

    // Actualizar usuario
    await query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, decoded.id]);

    return NextResponse.json({
      message: 'Avatar actualizado exitosamente',
      avatarUrl
    });
  } catch (error) {
    console.error('Error subiendo avatar:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}