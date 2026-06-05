import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    console.log('[LOGIN] Intento de login con:', { email, passwordLength: password.length });

    // Buscar usuario por email o alias usando SELECT * para soportar
    // distintos estados del esquema (con o sin migraciones adicionales).
    let users = [];
    try {
      users = await query(
        `SELECT * FROM users WHERE email = ? OR alias = ? LIMIT 1`,
        [email, email]  // Buscamos por email O por alias (el usuario puede ingresar cualquiera)
      ) as any[];
      console.log('[LOGIN] Usuarios encontrados:', users.length, 'con valor:', email);
    } catch (dbError) {
      console.error('[LOGIN] Error al consultar BD:', dbError);
      return NextResponse.json({ 
        error: 'Error de conexión con la base de datos',
        details: process.env.NODE_ENV === 'development' ? (dbError as any).message : undefined
      }, { status: 500 });
    }

    if (users.length === 0) {
      console.log('[LOGIN] Usuario no encontrado:', email);
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const user = users[0];
    console.log('[LOGIN] Usuario encontrado:', { id: user.id, email: user.email, alias: user.alias, role: user.role, has_password: !!user.password });

    // Si el campo existe y está activo, bloquear acceso.
    if (user.is_banned) {
      console.log('[LOGIN] Usuario baneado:', user.id);
      return NextResponse.json({ error: 'Tu cuenta ha sido baneada. Contacta con administración.' }, { status: 403 });
    }
    
    // Validación adicional: asegurar que la contraseña existe
    if (!user.password) {
      console.error('[LOGIN] Usuario sin contraseña hasheada:', user.id);
      return NextResponse.json({ error: 'Error de seguridad: contraseña no inicializada' }, { status: 500 });
    }

    // Verificar contraseña
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error('[LOGIN] Error verificando contraseña:', bcryptError);
      return NextResponse.json({ error: 'Error al verificar credenciales' }, { status: 500 });
    }

    if (!isValidPassword) {
      console.log('[LOGIN] Contraseña incorrecta para usuario:', email);
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    console.log('[LOGIN] Contraseña válida, generando token');

    // Generar token con información de rol Y plan
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        alias: user.alias,
        role: user.role || 'user',
        subscription_plan: user.subscription_plan || 'free'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        alias: user.alias,
        phone: user.phone,
        role: user.role || 'user',
        avatarUrl: user.avatar_url || null
      }
    });

    // Establecer cookie con el token para el middleware
    // En desarrollo, no requiere secure. En producción, sí.
    const isProduction = process.env.NODE_ENV === 'production';
    console.log('[LOGIN] Configurando cookies (production:', isProduction, ')');
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    // También establecer cookie no-httpOnly para acceso desde cliente
    response.cookies.set('readzzi_token', token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    console.log('[LOGIN] Login exitoso para usuario:', email, '| Token generado');
    return response;
  } catch (error) {
    console.error('[LOGIN] Error general:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? (error as any).message : undefined
    }, { status: 500 });
  }
}