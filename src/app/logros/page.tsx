'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Flame, 
  Trophy, 
  Lock, 
  Star, 
  Crown, 
  Award, 
  BookOpen, 
  Clock,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const STREAK_MOCK = { diasActuales: 12, diasRecord: 28 };
const SEMANA_MOCK = [
  { dia: "L", activo: true }, { dia: "M", activo: true }, { dia: "X", activo: true },
  { dia: "J", activo: true }, { dia: "V", activo: true }, { dia: "S", activo: false },
  { dia: "D", activo: true }
];

const INSIGNIAS_MOCK = [
  { id: 1, nombre: "Primer libro", desc: "Compraste tu primer libro", icono: "📖", desbloqueada: true, fecha: "Ene 2024" },
  { id: 2, nombre: "Lector voraz", desc: "Lee 5 libros en un mes", icono: "🔥", desbloqueada: true, fecha: "Feb 2024" },
  { id: 3, nombre: "Clásicos", desc: "Lee 3 clásicos latinoamericanos", icono: "🌎", desbloqueada: true, fecha: "Mar 2024" },
  { id: 4, nombre: "Madrugador", desc: "Lee antes de las 7am por 7 días", icono: "🌅", desbloqueada: false, fecha: null },
  { id: 5, nombre: "Crítico literario", desc: "Escribe 10 reseñas", icono: "✍️", desbloqueada: false, fecha: null },
  { id: 6, nombre: "Club de oro", desc: "Únete a 3 clubes de lectura", icono: "👑", desbloqueada: false, fecha: null },
];

const RANKING_MOCK = [
  { pos: 1, nombre: "Sofia Lectora", avatar: "SL", libros: 8, paginas: 2340, tu: true },
  { pos: 2, nombre: "Carlos M.", avatar: "CM", libros: 6, paginas: 1890, tu: false },
  { pos: 3, nombre: "Ana García", avatar: "AG", libros: 5, paginas: 1560, tu: false },
  { pos: 4, nombre: "Pedro V.", avatar: "PV", libros: 4, paginas: 1200, tu: false },
  { pos: 5, nombre: "Laura B.", avatar: "LB", libros: 3, paginas: 980, tu: false },
];

export default function LogrosPage() {
  return (
    <main className="min-h-screen bg-transparent pt-nav pb-20 px-6">
      <Navigation activeTab="comunidad" />

      <div className="max-w-5xl mx-auto pt-16 space-y-24">
        {/* SECTION 1: STREAK */}
        <section className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Racha de Lectura</h2>
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <Flame className="w-24 h-24 text-accent fill-accent animate-pulse" />
                <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white pt-2">{STREAK_MOCK.diasActuales}</span>
              </div>
              <h3 className="text-4xl font-playfair font-black text-white">Días seguidos</h3>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              {SEMANA_MOCK.map((dia, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    dia.activo ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-white/5 text-white/10"
                  )}>
                    {dia.activo && <Flame className="w-6 h-6 fill-current" />}
                  </div>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", dia.activo ? "text-white" : "text-white/20")}>
                    {dia.dia}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center pt-4">
              <p className="text-sm text-white/40 italic">
                ¡Llevas {STREAK_MOCK.diasActuales} días! Solo <span className="text-accent font-bold">{STREAK_MOCK.diasRecord - STREAK_MOCK.diasActuales}</span> más para tu récord de {STREAK_MOCK.diasRecord}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: INSIGNIAS */}
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <h3 className="text-4xl font-playfair font-black text-white">Colección de <span className="text-accent italic">Insignias.</span></h3>
            <Badge variant="outline" className="border-white/10 text-white/40 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              3 / 6 Desbloqueadas
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {INSIGNIAS_MOCK.map((badge) => (
              <TooltipProvider key={badge.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className={cn(
                      "p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center text-center space-y-4 group",
                      badge.desbloqueada 
                        ? "bg-accent/10 border-accent/20 hover:bg-accent/20 shadow-xl" 
                        : "bg-white/[0.02] border-white/5 opacity-40 grayscale"
                    )}>
                      <div className="relative">
                        <span className="text-6xl block transform transition-transform group-hover:scale-110 group-hover:rotate-6">{badge.icono}</span>
                        {!badge.desbloqueada && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white/40" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-playfair font-black text-white">{badge.nombre}</h4>
                        <p className="text-xs text-white/40 leading-relaxed italic">{badge.desc}</p>
                      </div>
                      {badge.desbloqueada && (
                        <span className="text-[8px] font-black text-accent uppercase tracking-[0.2em] pt-2">Obtenida en {badge.fecha}</span>
                      )}
                    </Card>
                  </TooltipTrigger>
                  {!badge.desbloqueada && (
                    <TooltipContent className="bg-black/95 border-accent/20 text-white p-4 rounded-2xl shadow-2xl">
                      <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Misión:</p>
                      <p className="text-[10px] italic">{badge.desc}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </section>

        {/* SECTION 3: RANKING */}
        <section className="space-y-12">
          <div className="flex items-end gap-4">
            <TrendingUp className="w-10 h-10 text-accent" />
            <div className="space-y-1">
              <h3 className="text-4xl font-playfair font-black text-white">Ranking Local.</h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Top Lectores Sincelejo • Abril 2024</p>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="divide-y divide-white/5">
              {RANKING_MOCK.map((item) => (
                <div key={item.pos} className={cn(
                  "p-8 flex items-center gap-8 transition-colors",
                  item.tu ? "bg-accent/10 border-y border-accent/20" : "hover:bg-white/[0.03]",
                  item.pos === 1 && "bg-white/[0.04]"
                )}>
                  <div className="w-12 text-center">
                    <span className={cn(
                      "text-3xl font-black font-playfair",
                      item.pos === 1 ? "text-accent" : item.pos === 2 ? "text-slate-300" : item.pos === 3 ? "text-amber-700" : "text-white/20"
                    )}>{item.pos}</span>
                  </div>

                  <div className="flex-1 flex items-center gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shadow-inner",
                      item.pos === 1 ? "bg-accent text-white" : "bg-white/5 text-white/40"
                    )}>
                      {item.pos === 1 ? <Crown className="w-6 h-6" /> : item.avatar}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-white">{item.nombre}</span>
                        {item.tu && <Badge className="bg-accent text-white border-none text-[8px] font-black uppercase">Tú</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-white/30">
                        <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3 text-accent" /> {item.libros} libros</span>
                        <span className="flex items-center gap-1.5"><Award className="w-3 h-3 text-accent" /> {item.paginas.toLocaleString()} págs</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <Button variant="ghost" size="icon" className="text-white/10 hover:text-white"><ChevronRight className="w-5 h-5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
