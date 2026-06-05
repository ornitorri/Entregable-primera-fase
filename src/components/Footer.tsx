
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const platformLinks = [
    { label: "Catálogo completo", href: "/catalogo" },
    { label: "Novedades", href: "/noticias" },
    { label: "Libros destacados", href: "/catalogo" },
    { label: "Autores", href: "/catalogo" },
    { label: "Búsqueda", href: "/catalogo" },
  ];

  const communityLinks = [
    { label: "Noticias y eventos", href: "/noticias" },
    { label: "Grupos de lectura", href: "/comunidad/clubes" },
    { label: "Feed Global", href: "/comunidad" },
    { label: "Calendario", href: "/noticias/calendario" },
    { label: "Entrevistas", href: "/noticias" },
  ];

  const accountLinks = [
    { label: "Iniciar sesión", href: "/login" },
    { label: "Crear cuenta", href: "/registro" },
    { label: "Planes Premium", href: "/planes" },
    { label: "Mis pedidos", href: "/perfil" },
    { label: "Suscripción", href: "/planes" },
  ];

  return (
    <footer className="relative z-10 bg-transparent pt-32 pb-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* SECCIÓN SUPERIOR: Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          
          {/* Columna 1: READZZI */}
          <div className="space-y-8">
            <Link href="/" className="inline-block">
              <span className="font-playfair font-black text-4xl tracking-tighter text-white">
                READZZ<span className="text-accent">I</span>
              </span>
            </Link>
            <p className="text-white/60 font-dmsans text-sm leading-relaxed max-w-xs italic font-light">
              La comunidad literaria más grande de Colombia. Libros físicos, eventos exclusivos y un espacio para lectores apasionados.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, idx) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-accent hover:bg-accent/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Columna 2: Plataforma */}
          <div className="space-y-8">
            <h4 className="font-dmsans font-black text-white/40 uppercase tracking-[0.2em] text-[10px]">Plataforma</h4>
            <ul className="space-y-4">
              {platformLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white/80 hover:text-accent text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Comunidad */}
          <div className="space-y-8">
            <h4 className="font-dmsans font-black text-white/40 uppercase tracking-[0.2em] text-[10px]">Comunidad</h4>
            <ul className="space-y-4">
              {communityLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white/80 hover:text-accent text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Cuenta */}
          <div className="space-y-8">
            <h4 className="font-dmsans font-black text-white/40 uppercase tracking-[0.2em] text-[10px]">Tu Cuenta</h4>
            <ul className="space-y-4">
              {accountLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white/80 hover:text-accent text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Mail className="w-32 h-32" /></div>
          <div className="space-y-3 text-center lg:text-left relative z-10">
            <h4 className="text-3xl font-playfair font-black text-white italic">Únete a nuestro newsletter</h4>
            <p className="text-white/40 text-sm font-light italic">Recibe noticias literarias y ofertas exclusivas cada viernes.</p>
          </div>
          <div className="w-full lg:w-auto space-y-4 relative z-10">
            <div className="flex bg-white/5 border border-white/10 rounded-full p-1.5 shadow-2xl max-w-md mx-auto">
              <Input 
                placeholder="Tu correo electrónico..." 
                className="bg-transparent border-none focus-visible:ring-0 text-sm h-12 pl-6 text-white placeholder:text-white/20"
              />
              <Button className="bg-accent hover:bg-amber-hover text-white rounded-full px-10 h-12 font-bold text-xs uppercase tracking-widest transition-all">
                Suscribirme
              </Button>
            </div>
          </div>
        </div>

        {/* LEGAL */}
        <div className="pt-16 border-t border-white/5 text-center space-y-12">
          <div className="space-y-6">
            <p className="text-3xl md:text-4xl font-playfair font-black text-white italic leading-tight max-w-3xl mx-auto opacity-80">
              &ldquo;Descubre tu universo literario. Conéctate, sueña y comparte historias.&rdquo;
            </p>
            <div className="flex justify-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
            </div>
          </div>

          <div className="space-y-8">
            <span className="font-playfair font-black text-2xl tracking-tighter text-white">READZZI</span>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-black text-white/40 uppercase tracking-widest">
              {["Términos", "Privacidad", "Cookies", "Aviso Legal"].map((l, i) => (
                <Link key={i} href="#" className="hover:text-white transition-colors">{l}</Link>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">
                © 2025 · READZZI · HECHO CON PASIÓN EN COLOMBIA 🇨🇴
              </p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
