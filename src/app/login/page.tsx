'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const bgUrl = "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2500&auto=format&fit=crop";

  useEffect(() => {
    setUser('');
    setPassword('');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!user.trim()) {
      setError('Por favor ingresa tu email o usuario');
      return;
    }

    if (!password) {
      setError('Por favor ingresa tu contraseña');
      return;
    }

    try {
      console.log('[CLIENT] Iniciando login con:', user);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ← IMPORTANTE: permitir que se envíen/reciban cookies
        body: JSON.stringify({ email: user, password })
      });

      console.log('[CLIENT] Respuesta del servidor:', response.status);
      const data = await response.json();
      console.log('[CLIENT] Datos recibidos:', { success: response.ok, hasToken: !!data.token, role: data.user?.role });

      if (response.ok && data.token) {
        // Mantener compatibilidad con componentes que ya consumen estas claves
        localStorage.setItem('token', data.token);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_info', JSON.stringify({
          id: data.user?.id,
          first_name: data.user?.firstName ?? '',
          last_name: data.user?.lastName ?? '',
          email: data.user?.email ?? '',
          alias: data.user?.alias ?? '',
          phone: data.user?.phone ?? '',
          role: data.user?.role ?? 'user',
          avatar_url: data.user?.avatarUrl ?? null
        }));
        const role = data.user?.role ?? 'user';
        
        console.log('[CLIENT] Login exitoso, rol:', role, 'redirigiendo después de 100ms...');
        
        // Pequeño delay para asegurar que las cookies se procesen
        setTimeout(() => {
          // Redirigir según el rol del usuario
          if (role === 'admin') {
            console.log('[CLIENT] Redirigiendo a /admin');
            router.push('/admin');
          } else if (role === 'marketing') {
            console.log('[CLIENT] Redirigiendo a /mercadeo');
            router.push('/mercadeo');
          } else if (role === 'publicity') {
            console.log('[CLIENT] Redirigiendo a /publicidad');
            router.push('/publicidad');
          } else if (role === 'logistics') {
            console.log('[CLIENT] Redirigiendo a /logistica');
            router.push('/logistica');
          } else {
            console.log('[CLIENT] Redirigiendo a /');
            router.push('/');
          }
        }, 100);
      } else {
        const errorMsg = data.error || 'Credenciales inválidas';
        console.log('[CLIENT] Error de login:', errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error de conexión';
      console.error('[CLIENT] Error en login:', error);
      setError(errorMsg);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6 bg-black">
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgUrl} 
          alt="Atmospheric starry night" 
          fill 
          className="object-cover opacity-80"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <Link href="/" className="absolute -top-16 left-0 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-6xl font-playfair font-black text-white tracking-tighter">
            Readzzi
          </h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-playfair font-bold text-white tracking-tight">
            Bienvenido de nuevo
          </h2>
          <p className="text-white/60 text-sm font-light italic">
            Inicia sesión en Readzzi
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-bold uppercase">{error}</AlertDescription>
          </Alert>
        )}

        <form className="w-full space-y-4" onSubmit={handleLogin} autoComplete="off">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-accent transition-colors" />
            <Input 
              type="text" 
              autoComplete="off"
              placeholder="Usuario o correo" 
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/35 rounded-xl focus-visible:ring-accent/50"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-accent transition-colors" />
            <Input 
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/35 rounded-xl focus-visible:ring-accent/50"
              required
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-transparent hover:bg-white/10 text-white/60 rounded-lg p-0"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-accent" />
              <Label htmlFor="remember" className="text-[11px] font-medium text-white/60 cursor-pointer">Recuérdame</Label>
            </div>
            <button type="button" className="text-[11px] font-medium text-white/60 hover:text-white transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" className="w-full h-14 bg-accent hover:bg-amber-hover text-white font-bold text-base rounded-xl shadow-2xl transition-all border-none">
            Iniciar sesión
          </Button>
        </form>

        <div className="pt-4 flex flex-col gap-2">
          <p className="text-white/40 text-[11px] font-medium uppercase tracking-widest">
            ¿Aún no tienes cuenta?
          </p>
          <Link href="/registro" className="text-accent font-black text-sm uppercase tracking-widest hover:underline">
            Crear cuenta
          </Link>
        </div>
      </div>
    </main>
  );
}
