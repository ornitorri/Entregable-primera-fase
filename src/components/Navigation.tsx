'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  CreditCard, 
  Users, 
  ShoppingCart, 
  Menu, 
  X, 
  Bell, 
  ChevronRight,
  User,
  LogOut,
  ChevronDown,
  Globe,
  Shield,
  Truck,
  Megaphone,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import NotificationPanel from './NotificationPanel';
import { ROLE_LABELS } from '@/lib/roleAccess';
import { getAuthToken } from '@/lib/clientAuth';

const OFFICIAL_LOGO_URL = "https://i.ibb.co/6RJwjLqG/Whats-App-Image-2026-03-31-at-18-47-01-1.png";

type NavItem = 'inicio' | 'tienda' | 'subscripciones' | 'comunidad' | 'carrito' | 'noticias' | 'perfil' | 'admin' | 'mercadeo' | 'publicidad' | 'logistica';

interface NavigationProps {
  activeTab: NavItem;
  onTabChange?: (tab: NavItem) => void;
}

export default function Navigation({ activeTab }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const hydrateSession = () => {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user_info');
      if (token && user) {
        setIsAuthenticated(true);
        try {
          setUserInfo(JSON.parse(user));
        } catch (e) {
          setUserInfo(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserInfo(null);
      }
    };

    const applyDevResetIfNeeded = async () => {
      // En desarrollo, si el servidor reinicia, limpiamos sesión y autocompletados locales.
      if (process.env.NODE_ENV !== 'development') {
        hydrateSession();
        return;
      }
      try {
        const response = await fetch('/api/runtime-id');
        const data = await response.json();
        const previousRuntimeId = localStorage.getItem('dev_runtime_id');
        const currentRuntimeId = data?.runtimeId;
        if (currentRuntimeId && previousRuntimeId && previousRuntimeId !== currentRuntimeId) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('token');
          localStorage.removeItem('user_info');
          localStorage.removeItem('readzzi_posts');
          localStorage.removeItem('readzzi_local_books');
        }
        if (currentRuntimeId) {
          localStorage.setItem('dev_runtime_id', currentRuntimeId);
        }
      } catch (error) {
        // Si falla esta verificación, mantenemos el comportamiento normal.
      } finally {
        hydrateSession();
      }
    };

    applyDevResetIfNeeded();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = getAuthToken();
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const response = await fetch('/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const items = await response.json();
          setCartCount(items.reduce((sum: number, item: { cantidad: number }) => sum + item.cantidad, 0));
        }
      } catch {
        setCartCount(0);
      }
    };

    if (isAuthenticated) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }

    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [isAuthenticated]);

  const items = [
    { id: 'tienda', label: 'Catálogo', icon: ShoppingBag, href: '/catalogo', roles: ['admin', 'user', 'marketing'] },
    { id: 'subscripciones', label: 'Planes', icon: CreditCard, href: '/planes', roles: ['admin', 'user'] },
    { id: 'noticias', label: 'Noticias', icon: Bell, href: '/noticias', roles: ['admin', 'user', 'marketing', 'publicity'] },
  ] as const;

  const staffNavItems = [
    { id: 'logistica', label: 'Logística', icon: Truck, href: '/logistica', role: 'logistics' },
    { id: 'mercadeo', label: 'Mercadeo', icon: TrendingUp, href: '/mercadeo', role: 'marketing' },
    { id: 'publicidad', label: 'Publicidad', icon: Megaphone, href: '/publicidad', role: 'publicity' },
  ] as const;

  const communityLinks = [
    { label: 'Feed Global', icon: Globe, href: '/comunidad', roles: ['admin', 'user'] },
    { label: 'Mi Perfil', icon: User, href: '/perfil', roles: ['admin', 'user'] },
    { label: 'Explorar Clubes', icon: Users, href: '/comunidad/clubes', roles: ['admin', 'user'] },
  ];

  // Filtrar items según el rol del usuario
  const visibleItems = items.filter(item => {
    if (!userInfo?.role) return true;
    return item.roles.includes(userInfo.role);
  });

  const visibleCommunityLinks = communityLinks.filter(link => {
    if (!userInfo?.role) return true;
    return link.roles.includes(userInfo.role);
  });

  // Para usuarios staff, mostrar solo su página específica
  const isStaffUser = ['logistics', 'marketing', 'publicity'].includes(userInfo?.role);
  const staffPage = staffNavItems.find(item => item.role === userInfo?.role);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] h-20 transition-all duration-500",
        scrolled ? "bg-black/95 backdrop-blur-3xl border-b border-white/10 shadow-2xl" : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="w-full h-full max-w-[1600px] mx-auto px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center gap-4 transition-all hover:opacity-80 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <img 
                src={OFFICIAL_LOGO_URL} 
                alt="Logo" 
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <span className="font-dmsans font-black text-2xl tracking-tight text-white leading-none">
              Readzzi
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <div className="flex items-center gap-2">
            {isStaffUser && staffPage ? (
              // Para usuarios staff, mostrar solo su página
              <Link
                href={staffPage.href}
                className={cn(
                  "relative py-2 flex items-center gap-2 px-4 xl:px-5 rounded-full transition-all group whitespace-nowrap",
                  activeTab === staffPage.id 
                    ? "text-white bg-white/10 ring-1 ring-white/20" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <staffPage.icon className="w-4 h-4" />
                <span className="font-dmsans font-black uppercase text-[10px] xl:text-xs tracking-widest">{staffPage.label}</span>
              </Link>
            ) : (
              // Para usuarios normales y admin
              visibleItems.map(({ id, label, icon: Icon, href }) => (
                <Link
                  key={id}
                  href={href}
                  className={cn(
                    "relative py-2 flex items-center gap-2 px-4 xl:px-5 rounded-full transition-all group whitespace-nowrap",
                    activeTab === id 
                      ? "text-white bg-white/10 ring-1 ring-white/20" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-dmsans font-black uppercase text-[10px] xl:text-xs tracking-widest">{label}</span>
                </Link>
              ))
            )}

            {!isStaffUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "relative py-2 flex items-center gap-2 px-4 xl:px-5 rounded-full transition-all group whitespace-nowrap outline-none",
                    activeTab === 'comunidad' || activeTab === 'perfil'
                      ? "text-white bg-white/10 ring-1 ring-white/20" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}>
                    <Users className="w-4 h-4" />
                    <span className="font-dmsans font-black uppercase text-[10px] xl:text-xs tracking-widest">Comunidad</span>
                    <ChevronDown className="w-3 h-3 opacity-40" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-[#0a0a0c] border-white/10 text-white rounded-2xl p-2 shadow-2xl backdrop-blur-2xl">
                  {visibleCommunityLinks.map((link, idx) => (
                    <DropdownMenuItem key={`community-${idx}`} asChild className="rounded-xl focus:bg-white/10 focus:text-white p-4 cursor-pointer">
                      <Link href={link.href} className="flex items-center gap-4">
                        <link.icon className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-widest">{link.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

          </div>

          <div className="h-8 w-px bg-white/10 mx-2" />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {!isStaffUser && (
                <NotificationPanel>
                  <Button variant="ghost" size="icon" className="text-white/40 hover:text-white relative hover:bg-white/5 h-10 w-10 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-white rounded-full border-2 border-black" />
                  </Button>
                </NotificationPanel>
              )}

              {!isStaffUser && (
                <Link href="/carrito">
                  <Button variant="ghost" size="icon" className="text-white/40 hover:text-white relative hover:bg-white/5 h-10 w-10 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black h-4 w-4 p-0 flex items-center justify-center border border-black">
                        {cartCount > 9 ? '9+' : cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-2 w-10 h-10 rounded-full overflow-hidden border-2 border-white/5 hover:border-white transition-all ring-offset-2 ring-offset-black shadow-lg">
                    <img src={userInfo?.avatar_url || "https://picsum.photos/seed/user1/100/100"} alt="User" className="w-full h-full object-cover" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 bg-[#0a0a0c] border-white/10 text-white rounded-3xl p-5 shadow-2xl backdrop-blur-xl">
                  <div className="p-4 space-y-1">
                    <p className="font-playfair font-black text-xl">{userInfo?.first_name || 'Usuario'} {userInfo?.last_name || ''}</p>
                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                      {ROLE_LABELS[userInfo?.role] || 'Miembro'} ⭐
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/5 mx-2" />
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-white/5 p-4 cursor-pointer">
                    <Link href="/perfil" className="flex items-center gap-4">
                      <User className="w-4 h-4 text-white/60" />
                      <span className="font-bold text-xs uppercase tracking-widest">Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="rounded-xl focus:bg-red-500/10 focus:text-red-400 p-4 cursor-pointer"
                    onClick={() => {
                      localStorage.removeItem('auth_token');
                      localStorage.removeItem('readzzi_token');
                      localStorage.removeItem('user_info');
                      localStorage.removeItem('token');
                      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                      document.cookie = 'readzzi_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                      window.location.href = '/';
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <LogOut className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase tracking-widest">Cerrar Sesión</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/registro">
                <Button className="h-10 px-4 text-[10px] font-black uppercase tracking-widest rounded-full bg-accent hover:bg-amber-hover text-white">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && (
            <NotificationPanel>
              <Button variant="ghost" size="icon" className="text-white/60 h-10 w-10 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-white rounded-full" />
              </Button>
            </NotificationPanel>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/60 h-10 w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-[#0a0a0c] z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col h-full overflow-y-auto px-6 py-10 space-y-10">
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] px-4">Navegación</h4>
              <div className="grid grid-cols-1 gap-3">
                {isStaffUser && staffPage ? (
                  <Link
                    href={staffPage.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-2xl transition-all",
                      activeTab === staffPage.id 
                        ? "bg-white/10 text-white shadow-xl" 
                        : "bg-white/5 text-white/60"
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <staffPage.icon className="w-6 h-6" />
                      <span className="font-black uppercase text-base tracking-widest">{staffPage.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-40" />
                  </Link>
                ) : (
                  [...visibleItems, { id: 'comunidad', label: 'Comunidad', icon: Globe, href: '/comunidad', roles: ['admin', 'user'] }].map(({ id, label, icon: Icon, href }) => (
                    <Link
                      key={`mobile-${id}`}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between p-6 rounded-2xl transition-all",
                        activeTab === id 
                          ? "bg-white/10 text-white shadow-xl" 
                          : "bg-white/5 text-white/60"
                      )}
                    >
                      <div className="flex items-center gap-5">
                        <Icon className="w-6 h-6" />
                        <span className="font-black uppercase text-base tracking-widest">{label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-40" />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
