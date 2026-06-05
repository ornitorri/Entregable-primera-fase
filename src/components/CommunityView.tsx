"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MessageSquare, 
  Heart, 
  Users, 
  ArrowRight, 
  Crown, 
  Sparkles, 
  Star,
  Globe,
  TrendingUp,
  Share2,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CommunityView = () => {
  return (
    <div className="max-w-5xl mx-auto pt-12 pb-20 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-accent bg-accent/5 px-5 py-2 rounded-full border border-accent/10">
          <Globe className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Red Social Literaria</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-primary font-playfair tracking-tighter">Comunidad READZZI</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic font-light">
          Únete a la conversación, descubre lecturas y haz amigos que amen los libros tanto como tú.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Post Mock 1 */}
        <Card className="border-border bg-card rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden">
                  <Image src="https://picsum.photos/seed/user2/100/100" alt="Usuario" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-playfair font-bold text-primary leading-none">Elena Martínez</h4>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider">hace 2 horas</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted"><MoreHorizontal className="w-5 h-5" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <p className="text-charcoal leading-relaxed">
              Finalmente he terminado de leer <span className="text-amber font-bold">@CienAñosDeSoledad</span>. Macondo se ha quedado en mi corazón. <span className="text-sage font-medium">#GaboVive</span>
            </p>
            <div className="bg-parchment/50 border border-warm rounded-2xl p-4 flex gap-4">
              <div className="relative w-12 h-18 rounded-lg overflow-hidden shrink-0">
                <Image src="https://picsum.photos/seed/catalog1/200/300" alt="Libro" fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h5 className="font-playfair font-bold text-primary text-sm">Cien Años de Soledad</h5>
                <p className="text-[10px] text-muted italic">Gabriel García Márquez</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-8 pt-0 border-t border-border/20">
            <div className="flex items-center gap-6 pt-4 w-full">
              <Button variant="ghost" className="text-muted hover:text-primary gap-2 p-0"><Heart className="w-4 h-4" /> 45</Button>
              <Button variant="ghost" className="text-muted hover:text-primary gap-2 p-0"><MessageSquare className="w-4 h-4" /> 12</Button>
              <Link href="/comunidad" className="ml-auto">
                <Button variant="ghost" className="text-accent font-bold text-xs uppercase tracking-widest p-0">Ir al feed completo →</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Post Mock 2 */}
        <Card className="border-border bg-card rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden">
                  <Image src="https://picsum.photos/seed/user3/100/100" alt="Usuario" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-playfair font-bold text-primary leading-none">Julian Vance</h4>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider">hace 5 horas</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted"><MoreHorizontal className="w-5 h-5" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video w-full overflow-hidden">
              <Image src="https://picsum.photos/seed/postimg/800/450" alt="Librería" fill className="object-cover" />
            </div>
            <div className="p-8">
              <p className="text-charcoal leading-relaxed italic">"Mi rincón de paz hoy..."</p>
            </div>
          </CardContent>
          <CardFooter className="p-8 pt-0 border-t border-border/20">
            <div className="flex items-center gap-6 pt-4 w-full text-muted">
              <span className="flex items-center gap-2"><Heart className="w-4 h-4" /> 120</span>
              <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> 34</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Seccion Grupos */}
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-playfair font-bold text-primary">Grupos Recomendados</h3>
          <Link href="/comunidad">
            <Button variant="ghost" className="text-accent font-bold uppercase tracking-widest text-xs">Ver todos los grupos</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: "Clásicos Eternos", m: "1.2k", i: "g1" },
            { n: "Misterio Bogotá", m: "850", i: "g2" },
            { n: "Fantasía Juvenil", m: "2.1k", i: "g3" }
          ].map((g, idx) => (
            <Link key={idx} href={`/comunidad/${idx + 1}`}>
              <Card className="overflow-hidden border border-border/10 bg-white/40 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[3rem] group">
                <div className="relative h-40 w-full overflow-hidden">
                  <Image src={`https://picsum.photos/seed/${g.i}/400/200`} alt={g.n} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <CardHeader className="p-6 text-center">
                  <h3 className="font-bold text-xl text-primary font-playfair group-hover:text-accent transition-colors">{g.n}</h3>
                  <p className="text-[10px] text-muted font-bold tracking-[0.2em] uppercase">{g.m} lectores</p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="bg-accent/5 p-12 md:p-20 rounded-[4rem] border border-accent/10 text-center space-y-8 relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <h3 className="text-3xl md:text-5xl font-black text-primary font-playfair italic leading-tight">¿Listo para interactuar?</h3>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic font-light">
          Crea tu perfil y empieza a compartir tu pasión por la lectura con el mundo.
        </p>
        <Link href="/comunidad">
          <Button className="shimmer-btn bg-accent hover:bg-primary text-cream rounded-full px-16 h-20 font-bold text-2xl shadow-2xl shadow-accent/20 transition-all">
            Ir al Feed Global
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CommunityView;
