import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '@/lib/db';
import { generateUniqueAlias } from '@/lib/generateAlias';
import { buildAuthResponse } from '@/lib/authResponse';

interface GoogleTokenPayload {
  sub: string;
  email?: string;
  email_verified?: string | boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
  aud: string;
}

async function verifyGoogleToken(credential: string): Promise<GoogleTokenPayload | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID no configurado');
  }

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as GoogleTokenPayload;

  if (payload.aud !== clientId) {
    return null;
  }

  const emailVerified =
    payload.email_verified === true || payload.email_verified === 'true';

  if (!payload.email || !emailVerified) {
    return null;
  }

  return payload;
}

async function insertGoogleUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  alias: string;
  googleId: string;
  avatarUrl?: string | null;
}) {
  const randomPassword = await bcrypt.hash(
    crypto.randomBytes(32).toString('hex'),
    10
  );

  try {
    const result = await query(
      `INSERT INTO users (first_name, last_name, email, alias, password, google_id, avatar_url, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'user')`,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.alias,
        randomPassword,
        data.googleId,
        data.avatarUrl || null,
      ]
    ) as { insertId: number };

    return result.insertId;
  } catch (error: any) {
    if (error?.code === 'ER_BAD_FIELD_ERROR') {
      const result = await query(
        `INSERT INTO users (first_name, last_name, email, alias, password, google_id, avatar_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.firstName,
          data.lastName,
          data.email,
          data.alias,
          randomPassword,
          data.googleId,
          data.avatarUrl || null,
        ]
      ) as { insertId: number };

      return result.insertId;
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ error: 'Token de Google requerido' }, { status: 400 });
    }

    const googleUser = await verifyGoogleToken(credential);
    if (!googleUser?.sub || !googleUser.email) {
      return NextResponse.json({ error: 'Token de Google inválido' }, { status: 401 });
    }

    const firstName = googleUser.given_name || googleUser.name?.split(' ')[0] || 'Usuario';
    const lastName =
      googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || 'Google';

    let users = await query(
      'SELECT * FROM users WHERE google_id = ? OR email = ? LIMIT 1',
      [googleUser.sub, googleUser.email]
    ) as any[];

    let user = users[0];
    let isNewUser = false;

    if (!user) {
      const alias = await generateUniqueAlias(firstName || googleUser.email.split('@')[0]);
      const userId = await insertGoogleUser({
        firstName,
        lastName,
        email: googleUser.email,
        alias,
        googleId: googleUser.sub,
        avatarUrl: googleUser.picture || null,
      });

      users = await query('SELECT * FROM users WHERE id = ?', [userId]) as any[];
      user = users[0];
      isNewUser = true;
    } else {
      if (user.is_banned) {
        return NextResponse.json(
          { error: 'Tu cuenta ha sido baneada. Contacta con administración.' },
          { status: 403 }
        );
      }

      const updates: string[] = [];
      const params: any[] = [];

      if (!user.google_id) {
        updates.push('google_id = ?');
        params.push(googleUser.sub);
      }

      if (googleUser.picture && !user.avatar_url) {
        updates.push('avatar_url = ?');
        params.push(googleUser.picture);
      }

      if (updates.length > 0) {
        params.push(user.id);
        await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
        users = await query('SELECT * FROM users WHERE id = ?', [user.id]) as any[];
        user = users[0];
      }
    }

    const response = buildAuthResponse(
      user,
      isNewUser ? 'Cuenta creada con Google' : 'Login con Google exitoso'
    );

    return response;
  } catch (error: any) {
    console.error('Error en Google auth:', error);

    if (error?.message?.includes('GOOGLE_CLIENT_ID')) {
      return NextResponse.json(
        { error: 'Google OAuth no está configurado en el servidor' },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
