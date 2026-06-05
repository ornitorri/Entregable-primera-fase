import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // Intentar obtener token de auth_token (httpOnly) o readzzi_token
    let token = cookieStore.get('auth_token')?.value;
    if (!token) {
      token = cookieStore.get('readzzi_token')?.value;
    }

    if (!token) {
      return Response.json(
        { error: 'No token found' },
        { status: 401 }
      );
    }

    // Verificar y decodificar el JWT
    const verified = jwt.verify(token, JWT_SECRET) as any;
    
    return Response.json({
      success: true,
      user: verified,
      id: verified.id,
      email: verified.email,
      alias: verified.alias,
      role: verified.role || 'user',
      subscription_plan: verified.subscription_plan || 'free'
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return Response.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
