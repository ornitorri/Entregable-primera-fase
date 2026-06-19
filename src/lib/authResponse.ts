import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUserRecord {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  alias: string;
  phone?: string | null;
  role?: string | null;
  avatar_url?: string | null;
  subscription_plan?: string | null;
}

export function buildAuthResponse(user: AuthUserRecord, message: string) {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      alias: user.alias,
      role: user.role || 'user',
      subscription_plan: user.subscription_plan || 'free',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const response = NextResponse.json({
    message,
    token,
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      alias: user.alias,
      phone: user.phone,
      role: user.role || 'user',
      avatarUrl: user.avatar_url || null,
    },
  });

  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
  });

  response.cookies.set('readzzi_token', token, {
    httpOnly: false,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
