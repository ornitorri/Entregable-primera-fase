import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  // Also accept x-access-token header for convenience and a token query param for quick testing.
  const xToken = request.headers.get('x-access-token');
  if (xToken) return xToken;

  try {
    const qp = request.nextUrl?.searchParams?.get('token');
    if (qp) return qp;
  } catch (e) {
    // nextUrl may be undefined in some contexts; ignore.
  }

  return (
    request.cookies.get('auth_token')?.value ||
    request.cookies.get('readzzi_token')?.value ||
    null
  );
}