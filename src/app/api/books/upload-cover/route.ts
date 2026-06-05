import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token) as { role?: string } | null;
    if (!decoded || !['admin', 'marketing'].includes(decoded.role || '')) {
      return NextResponse.json({ error: 'No autorizado para subir imágenes' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no debe superar 5MB' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: 'Formato no permitido. Usa JPG, PNG o WEBP' }, { status: 400 });
    }

    const filename = `cover-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'books');
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

    return NextResponse.json({
      success: true,
      url: `/uploads/books/${filename}`
    });
  } catch (error) {
    console.error('Error uploading cover:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
