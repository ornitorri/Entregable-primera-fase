import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function GET(request: NextRequest) {
  const cookies = request.cookies;
  const authToken = cookies.get('auth_token')?.value;
  const readzziToken = cookies.get('readzzi_token')?.value;
  
  console.log('[DEBUG-COOKIES] Auth token presente:', !!authToken);
  console.log('[DEBUG-COOKIES] Readzzi token presente:', !!readzziToken);
  
  let tokenValid = false;
  let tokenData = null;
  
  if (authToken) {
    try {
      const verified = await jwtVerify(authToken, JWT_SECRET);
      tokenData = verified.payload;
      tokenValid = true;
      console.log('[DEBUG-COOKIES] Token válido:', tokenData);
    } catch (error) {
      console.error('[DEBUG-COOKIES] Token inválido:', (error as any).message);
    }
  }
  
  return NextResponse.json({
    auth_token_present: !!authToken,
    readzzi_token_present: !!readzziToken,
    auth_token_valid: tokenValid,
    token_data: tokenData,
    all_cookies: Array.from(cookies).map(([name, value]) => ({
      name,
      value: value.value.substring(0, 30) + (value.value.length > 30 ? '...' : '')
    }))
  });
}
