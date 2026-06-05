import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden crear nuevas cuentas' }, { status: 403 });
    }

    const { firstName, lastName, email, alias, password, role } = await request.json();

    // Validar que el rol sea válido
    const validRoles = ['admin', 'logistics', 'marketing', 'publicity'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
    }

    // Verificar que email y alias no existan
    const existingUser = await query(
      `SELECT id FROM users WHERE email = ? OR alias = ?`,
      [email, alias]
    );

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ error: 'Email o alias ya existe' }, { status: 400 });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nueva cuenta de admin
    await query(
      `INSERT INTO users (first_name, last_name, email, alias, password, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, alias, hashedPassword, role]
    );

    return NextResponse.json({ 
      success: true, 
      message: `Cuenta de ${role} creada correctamente`,
      user: {
        email,
        alias,
        role
      }
    });
  } catch (error) {
    console.error('Error creating staff account:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
