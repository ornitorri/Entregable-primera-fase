import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, alias, password } = await request.json();

    // Validar campos requeridos
    if (!firstName || !lastName || !email || !alias || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    // Verificar si email o alias ya existen - en una sola query para mejor performance
    const existingUsers = await query(
      'SELECT id, email, alias FROM users WHERE email = ? OR alias = ?',
      [email, alias]
    ) as any[];
    
    if (existingUsers.length > 0) {
      return NextResponse.json({ 
        error: existingUsers[0].email === email 
          ? 'El email ya está registrado' 
          : 'El alias ya está en uso' 
      }, { status: 400 });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario. Soporta esquemas con y sin columna "role".
    try {
      await query(
        `INSERT INTO users (first_name, last_name, email, phone, alias, password, role) 
         VALUES (?, ?, ?, ?, ?, ?, 'user')`,
        [firstName, lastName, email, phone || null, alias, hashedPassword]
      );
    } catch (insertError: any) {
      if (insertError?.code === 'ER_BAD_FIELD_ERROR') {
        await query(
          `INSERT INTO users (first_name, last_name, email, phone, alias, password) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [firstName, lastName, email, phone || null, alias, hashedPassword]
        );
      } else {
        throw insertError;
      }
    }

    return NextResponse.json({ message: 'Usuario registrado exitosamente' }, { status: 201 });
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}