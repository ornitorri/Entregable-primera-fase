'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowLeft, UserPlus, Phone, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";
import GoogleAuthProvider from '@/components/auth/GoogleAuthProvider';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

export default function RegisterPage() {
  const router = useRouter();
  const bgUrl = "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2500&auto=format&fit=crop";

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alias: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [aliasSuggestions, setAliasSuggestions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      alias: '',
      password: ''
    });
    setAliasSuggestions([]);
    setError('');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateAliasSuggestions = async () => {
    try {
      const base = formData.firstName.toLowerCase().replace(/[^a-z]/g, '') || 'usuario';
      const response = await fetch(`/api/auth/suggest-alias?base=${base}`);
      const data = await response.json();
      setAliasSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error generando sugerencias:', error);
    }
  };

  const checkAliasAvailability = async (alias: string) => {
    try {
      const response = await fetch(`/api/auth/check-alias?alias=${alias}`);
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Error verificando alias:', error);
      return false;
    }
  };

  const handleAliasChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, alias: value }));

    if (value.length > 2) {
      const available = await checkAliasAvailability(value);
      if (!available) {
        setError('Este alias ya está en uso');
      } else {
        setError('');
      }
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, alias: suggestion }));
    setAliasSuggestions([]);
    setError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verificar alias antes de enviar
      const available = await checkAliasAvailability(formData.alias);
      if (!available) {
        setError('El alias ya está en uso');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/');
      } else {
        setError(data.error || 'Error en el registro');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleAuthProvider>
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

      <div className="relative z-10 w-full max-w-[450px] flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700 py-12">
        <Link href="/" className="absolute -top-16 left-0 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-playfair font-black text-white tracking-tighter">
            Únete a Readzzi
          </h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-playfair font-bold text-white tracking-tight">
            Crea tu cuenta literaria
          </h2>
          <p className="text-white/60 text-sm font-light italic">
            Empieza tu viaje hoy mismo y conecta con otros lectores
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
            <AlertDescription className="text-xs font-bold uppercase">{error}</AlertDescription>
          </Alert>
        )}

        <form className="w-full space-y-4" onSubmit={handleRegister} autoComplete="off">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-accent transition-colors" />
              <Input 
                name="firstName"
                autoComplete="off"
                placeholder="Nombres" 
                value={formData.firstName}
                onChange={handleInputChange}
                className="h-12 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-accent/50"
                required
              />
            </div>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-accent transition-colors" />
              <Input 
                name="lastName"
                autoComplete="off"
                placeholder="Apellidos" 
                value={formData.lastName}
                onChange={handleInputChange}
                className="h-12 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-accent/50"
                required
              />
            </div>
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-accent transition-colors" />
            <Input 
              name="email"
              type="email" 
              autoComplete="off"
              placeholder="Correo electrónico" 
              value={formData.email}
              onChange={handleInputChange}
              className="h-12 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-accent/50"
              required
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-accent transition-colors" />
            <Input 
              name="phone"
              type="tel" 
              autoComplete="off"
              placeholder="Teléfono (opcional)" 
              value={formData.phone}
              onChange={handleInputChange}
              className="h-12 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-accent/50"
            />
          </div>

          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-accent transition-colors" />
            <Input 
              name="alias"
              autoComplete="off"
              placeholder="Alias único" 
              value={formData.alias}
              onChange={handleAliasChange}
              className="h-12 pl-10 pr-20 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-accent/50"
              required
            />
            <Button
              type="button"
              onClick={generateAliasSuggestions}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent/20 hover:bg-accent/40 text-accent rounded-lg p-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {aliasSuggestions.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-white/60 text-xs mb-2">Sugerencias:</p>
              <div className="flex flex-wrap gap-2">
                {aliasSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="text-accent text-xs hover:underline"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-accent transition-colors" />
            <Input 
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Contraseña" 
              value={formData.password}
              onChange={handleInputChange}
              className="h-12 pl-10 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-accent/50"
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

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-accent hover:bg-amber-hover text-white font-bold rounded-xl shadow-xl transition-all active:scale-95 border-none mt-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
            Crear cuenta
          </Button>
        </form>

        <div className="w-full flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">o regístrate con</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <GoogleSignInButton mode="register" />

        <div className="pt-4 flex flex-col gap-2">
          <p className="text-white/40 text-[11px] font-medium uppercase tracking-widest">
            ¿Ya tienes una cuenta?
          </p>
          <Link href="/login" className="text-accent font-black text-sm uppercase tracking-widest hover:underline transition-all">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </main>
    </GoogleAuthProvider>
  );
}