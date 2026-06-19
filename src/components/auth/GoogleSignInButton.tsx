'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { RefreshCw } from 'lucide-react';

interface GoogleSignInButtonProps {
  mode?: 'login' | 'register';
  className?: string;
}

function persistSessionAndRedirect(
  data: {
    token: string;
    user?: {
      id: number;
      firstName?: string;
      lastName?: string;
      email?: string;
      alias?: string;
      phone?: string;
      role?: string;
      avatarUrl?: string | null;
    };
  },
  router: ReturnType<typeof useRouter>
) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem(
    'user_info',
    JSON.stringify({
      id: data.user?.id,
      first_name: data.user?.firstName ?? '',
      last_name: data.user?.lastName ?? '',
      email: data.user?.email ?? '',
      alias: data.user?.alias ?? '',
      phone: data.user?.phone ?? '',
      role: data.user?.role ?? 'user',
      avatar_url: data.user?.avatarUrl ?? null,
    })
  );

  const role = data.user?.role ?? 'user';

  setTimeout(() => {
    if (role === 'admin') router.push('/admin');
    else if (role === 'marketing') router.push('/mercadeo');
    else if (role === 'publicity') router.push('/publicidad');
    else if (role === 'logistics') router.push('/logistica');
    else router.push('/');
  }, 100);
}

export default function GoogleSignInButton({
  mode = 'register',
  className = '',
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      setError('No se recibió credencial de Google');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        persistSessionAndRedirect(data, router);
      } else {
        setError(data.error || 'Error al autenticar con Google');
      }
    } catch {
      setError('Error de conexión con Google');
    } finally {
      setLoading(false);
    }
  };

  if (!clientId) {
    return (
      <p className="text-white/40 text-xs text-center">
        Configura NEXT_PUBLIC_GOOGLE_CLIENT_ID para habilitar Google
      </p>
    );
  }

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {error && (
        <p className="text-red-300 text-xs font-bold uppercase text-center">{error}</p>
      )}

      {loading ? (
        <div className="w-full h-12 flex items-center justify-center gap-2 bg-white/10 rounded-xl text-white/70">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm font-bold">Conectando con Google...</span>
        </div>
      ) : (
        <div className="w-full flex justify-center [&>div]:w-full [&>div>div]:w-full [&_iframe]:!w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('No se pudo completar el inicio con Google')}
            useOneTap={false}
            theme="outline"
            size="large"
            text={mode === 'register' ? 'signup_with' : 'signin_with'}
            shape="rectangular"
            width="400"
            locale="es"
          />
        </div>
      )}
    </div>
  );
}
