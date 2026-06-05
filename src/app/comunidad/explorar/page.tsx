
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Users, 
  Sparkles, 
  ChevronRight, 
  Ghost, 
  Heart, 
  BookOpen, 
  History, 
  Feather, 
  Baby, 
  Globe, 
  ArrowRight,
  TrendingUp,
  Star,
  Plus,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Navigation from '@/components/Navigation';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { name: 'Fantasía', icon: Sparkles, count: 124, bg: 'bg-[#f3e8ff] text-[#7e22ce]', iconColor: 'text-[#9333ea]' },
  { name: 'Romance', icon: Heart, count: 86, bg: 'bg-[#fce7f3] text-[#be185d]', iconColor: 'text-[#db2777]' },
  { name: 'Terror', icon: Ghost, count: 42, bg: 'bg-[#2c2416] text-[#e8dcc8]', iconColor: 'text-[#c8860a]' },
  { name: 'Clásicos', icon: BookOpen, count: 95, bg: 'bg-[#f2ead8] text-[#1a1208]', iconColor: 'text-[#7a6a52]' },
  { name: 'Ciencia Ficción', icon: Globe, count: 67, bg: 'bg-[#e0f2fe] text-[#0369a1]', iconColor: 'text-[#0ea5e9]' },
  { name: 'Histórico', icon: History, count: 53, bg: 'bg-[#fdf3d0] text-[#c8860a]', iconColor: 'text-[#a36d08]' },
  { name: 'Poesía', icon: Feather, count: 39, bg: 'bg-[#e8f2e8] text-[#3d6b4f]', iconColor: 'text-[#3d6b4f]' },
  { name: 'Infantil', icon: Baby, count: 31, bg: 'bg-[#f0fdf4] text-[#15803d]', iconColor: 'text-[#22c55e]' },
];

const FEATURED_GROUPS = [
  { id: 1, name: 'Lectores de Fantasía Colombiana', members: '1.2k', activity: '234 posts hoy', img: 'https://picsum.photos/seed/f1/600/400', genre: 'Fantasía' },
  { id: 2, name: 'Círculo de Realismo Mágico', members: '850', activity: '156 posts hoy', img: 'https://picsum.photos/seed/f2/600/400', genre: 'Clásicos' },
  { id: 3, name: 'Terror en Bogotá', members: '540', activity: '98 posts hoy', img: 'https://picsum.photos/seed/f3/600/400', genre: 'Terror' },
  { id: 4, name: 'Amantes de la Novela Histórica', members: '720', activity: '112 posts hoy', img: 'https://picsum.photos/seed/f4/600/400', genre: 'Histórico' },
];

const NEW_GROUPS = [
  { id: 5, name: 'Nuevas Voces del Caribe', members: '45', genre: 'Ficción', img: 'https://picsum.photos/seed/n1/400/300' },
  { id: 6, name: 'Poesía de Medianoche', members: '128', genre: 'Poesía', img: 'https://picsum.photos/seed/n2/400/300' },
  { id: 7, name: 'Club de Lectura Sci-Fi', members: '82', genre: 'Ciencia Ficción', img: 'https://picsum.photos/seed/n3/400/300' },
];

export default function ExplorarComunidadPage() {
  const [activeFilter, setActiveFilter] = useState('Todos');

  return (
    <main className="min-h-screen bg-background pt-nav pb-20">
      <Navigation activeTab="comunidad" onTabChange={() => {}} />

      {/* HEADER HERO */}
      <section className="relative bg-primary text-cream py-24 lg:py-32 overflow-hidden">
        {/* Patrón literario tenue */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-6 text-center space-y-10 relative z-10">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-playfair font-black tracking-tighter leading-none animate-in fade-in slide-in-from-top duration-700">
              Encuentra tu <br /> <span className="text-accent italic">tribu lectora</span>
            </h1>
            <p className="text-xl md:text-2xl font-dmsans text-muted-foreground/80 italic max-w-2xl mx-auto animate-in fade-in slide-in-from-top duration-700 delay-100">
              Conéctate con miles de lectores que comparten tus mismos gustos y pasiones literarias.
            </p>
          </div>

          {/* Buscador grande */}
          <div className="max-w-3xl mx-auto relative group animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input 
              placeholder="Busca grupos por nombre o género..." 
              className="h-20 pl-16 pr-8 bg-cream text-primary rounded-full border-none shadow-2xl focus-visible:ring-2 focus-visible:ring-accent/50 text-xl font-dmsans"
            />
          </div>

          {/* Tags sugeridos */}
          <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            {['Fantasía', 'Romance', 'Terror', 'Clásicos', 'Ciencia Ficción', 'Poesía', 'Histórico', 'Infantil'].map(tag => (
              <button key={tag} className="px-6 py-2 rounded-full border border-cream/20 hover:bg-cream hover:text-primary text-sm font-bold transition-all">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FILTROS FLOTANTES STICKY - Alineado a la nueva altura 72px */}
      <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur-md border-b border-warm/40 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3">
              {['Todos', 'Más activos', 'Más nuevos', 'Más miembros', 'Públicos', 'Privados', 'Con eventos', 'Busco miembros'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                    activeFilter === filter
                      ? "bg-accent text-cream shadow-lg shadow-accent/20"
                      : "bg-parchment/50 text-muted hover:bg-warm/50"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        
        {/* SECCIÓN CATEGORÍAS */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-playfair font-black text-primary tracking-tight">Explorar por categoría</h2>
            <Button variant="ghost" className="text-accent font-bold uppercase tracking-widest text-xs gap-2">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, i) => (
              <Card key={i} className={cn(
                "group cursor-pointer border-none rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-xl",
                cat.bg
              )}>
                <CardContent className="p-8 space-y-4 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/40 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <cat.icon className={cn("w-8 h-8", cat.iconColor)} />
                  </div>
                  <div>
                    <h3 className="text-xl font-playfair font-bold mb-1">{cat.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70">{cat.count} grupos activos</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SECCIÓN GRUPOS DESTACADOS (CAROUSEL) */}
        <section className="space-y-12">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <TrendingUp className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Tendencia mundial</span>
              </div>
              <h2 className="text-4xl font-playfair font-black text-primary tracking-tight">Grupos más activos esta semana</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full border-warm"><ChevronRight className="w-5 h-5 rotate-180" /></Button>
              <Button variant="outline" size="icon" className="rounded-full border-warm"><ChevronRight className="w-5 h-5" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_GROUPS.map((group) => (
              <Link key={group.id} href={`/comunidad/${group.id}`} className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                <Image src={group.img} alt={group.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                  <Badge className="bg-accent text-cream border-none font-bold text-[9px] uppercase tracking-tighter">
                    <Star className="w-3 h-3 mr-1.5 fill-current" />
                    EMBAJADOR
                  </Badge>
                  <h3 className="text-2xl font-playfair font-bold text-cream leading-tight">{group.name}</h3>
                  <div className="flex flex-col gap-1 text-cream/70 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {group.members} miembros</span>
                    <span className="text-accent">{group.activity}</span>
                  </div>
                  <Button className="w-full bg-cream hover:bg-accent text-primary hover:text-cream rounded-xl h-12 font-bold transition-all">
                    Unirme ahora
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECCIÓN GRUPOS NUEVOS */}
        <section className="space-y-12">
          <h2 className="text-4xl font-playfair font-black text-primary tracking-tight">Recién creados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {NEW_GROUPS.map((group) => (
              <Card key={group.id} className="group border-warm/40 bg-card rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="flex items-center p-6 gap-6">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md shrink-0">
                    <Image src={group.img} alt={group.name} fill className="object-cover" />
                    <Badge className="absolute top-2 left-2 bg-sage text-cream border-none text-[8px] font-black px-1.5 h-4">NUEVO</Badge>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-playfair font-bold text-primary group-hover:text-accent transition-colors line-clamp-1">{group.name}</h4>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{group.members} miembros</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/5 font-bold text-[10px] uppercase tracking-widest p-0 h-auto">
                      Unirme <Plus className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* GRUPOS POR GÉNERO */}
        {['Fantasía', 'Terror', 'Clásicos'].map((genre) => (
          <section key={genre} className="space-y-12">
            <div className="flex items-center justify-between border-b border-warm/40 pb-6">
              <h2 className="text-4xl font-playfair font-black text-primary tracking-tight">Grupos de {genre}</h2>
              <Link href={`/comunidad/explorar?genre=${genre.toLowerCase()}`} className="text-accent font-bold text-sm uppercase tracking-widest hover:underline flex items-center gap-2">
                Ver todos los grupos de {genre} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group cursor-pointer space-y-4">
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <Image src={`https://picsum.photos/seed/genre${genre}${i}/600/350`} alt="Grupo" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-cream border-none font-bold text-[9px]">{genre}</Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-playfair font-bold text-primary group-hover:text-accent transition-colors text-lg line-clamp-1">Club de {genre} #{i}</h3>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest">420 miembros activos</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA FINAL */}
        <section className="bg-accent text-cream p-16 md:p-24 rounded-[4rem] text-center space-y-8 relative overflow-hidden shadow-2xl shadow-accent/20">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Users className="w-64 h-64" /></div>
          <h2 className="text-5xl md:text-7xl font-playfair font-black tracking-tighter leading-tight relative z-10">¿No encuentras tu lugar? <br /> <span className="italic">Crea el tuyo.</span></h2>
          <p className="text-xl opacity-90 italic font-light max-w-2xl mx-auto relative z-10">
            Los Embajadores de READZZI pueden liderar sus propias comunidades. Empieza hoy mismo.
          </p>
          <div className="flex justify-center relative z-10">
            <Button className="bg-primary hover:bg-white hover:text-primary text-cream rounded-full px-16 h-20 text-2xl font-bold shadow-2xl transition-all active:scale-95">
              Crear un grupo nuevo
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}
